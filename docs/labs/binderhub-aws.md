*![time/embed](Estimated reading time: {X})*

## Introduction

In this article we are going to present the **first ever** FPGA accelerated
execution of Jupyter Notebooks over BinderHub.

[**BinderHub**](https://binderhub.readthedocs.io) enables end users to easily
create computing environments from Git repos, making it easier than ever to run
applications without the need of installing packages, setting up environments
etc. It then serves the custom computing environment at a URL which users can
access remotely. To achieve this functionality BinderHub uses a JupyterHub
running on Kubernetes.

However, this awesome concept misses the ability of running applications in an
accelerated environment. And this is where [**InAccel**](https://inaccel.com)
comes in. InAccel, a world-leader in application acceleration through the use of
adaptive acceleration platforms (ACAP, FPGA) provides an FPGA resource manager
that allows instant deployment, scaling and virtualization of FPGAs making the
utilization of FPGA clusters easier than ever. InAccel's FPGA Kubernetes plugin
enables users to accelerate their Pods within the snap of a finger. That said it
really makes sense to combine all that together to provide seamless acceleration
for any computational intensive workload.

Supposedly having already deployed a Kubernetes cluster over a bunch of servers
hosting FPGAs and having setup BinderHub you only need two steps to enable FPGA
accelerated notebooks:

1. Create a kubernetes secret for the InAccel Resource Manager licensing system.
	If you don't have a license key you can generate one for free
	[here](https://inaccel.com/license). Just fill out the form and you will
	automatically receive an e-mail with the license key requested.

	```bash
	kubectl create secret generic coral-license-key -n kube-system --from-literal=CORAL_LICENSE_KEY='<your license key>'
	```

2. Deploy InAccel FPGA Kubernetes Plugin

	```bash
	kubectl apply -f https://bitbucket.org/inaccel/deploy/raw/master/inaccel-fpga-plugin.yml
	```

You can now run any FPGA accelerated application simply by specifying a Git repo in your BinderHub endpoint.

## A Use Case Scenario using Amazon EKS

Amazon offers its so called [**EKS**](https://aws.amazon.com/eks) service for
creating Kubernetes clusters. What is more,
[**Amazon's F1**](https://aws.amazon.com/ec2/instance-types/f1) (FPGA) instances
are supported by EKS meaning that a user can easily create a Kubernetes cluster
of F1 instances and accelerate his applications using the power of FPGAs and
that is why we are going to use it for this use case scenario.

At this point we are going to guide you through the whole procedure of creating
a Kubernetes cluster in Amazon AWS using EKS service and how to further on
deploy BinderHub, [**InAccel FPGA Plugin**](/setup/kubernetes) and
run an FPGA accelerated application. We suggest that you go over the following
step by step guide but we also provide an alternative
[**kickstart.sh script**](https://bitbucket.org/inaccel/deploy/raw/master/binderhub/kickstart.sh)
script that you can use in case you prefer that.

Before beginning make sure you have the required access/premissions to perform
the actions below using your AWS account. For this guide we used an account with
the following policies attached:

* **IAMFullAccess**

* **AmazonVPCFullAccess**

* **AmazonEKSAdminPolicy**

* **AWSCloudFormationFullAccess**

* **AmazonEC2FullAccess**

!!! hint

	You can change a user's permissions by selecting the **IAM service** from
	Amazon AWS Console. Then from **Users** panel select your user and click on
	**Add permissions**. Select **Attach existing policies directly** and attach
	the desired policies

!!! info

	You can also run the steps below using our
	[**kickstart.sh script**](https://bitbucket.org/inaccel/deploy/raw/master/binderhub/kickstart.sh).

1. Install `python3-pip`.

	=== "Ubuntu"

		```bash
		sudo apt install -y python3-pip
		```

	=== "CentOS"

		```bash
		sudo yum install -y python3-pip
		```

2. Install `ansible`.

	```bash
	sudo pip3 install ansible
	```

3. Download and install `eksctl`.

	```bash
	curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
	sudo mv /tmp/eksctl /usr/bin
	```

4. Install and configure `awscli`.

	```bash
	sudo pip3 install --upgrade awscli
	aws configure
	```

5. Download and install `aws-iam-authenticator`.

	```bash
	sudo curl -o /usr/bin/aws-iam-authenticator https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/linux/amd64/aws-iam-authenticator
	sudo chmod +x /usr/bin/aws-iam-authenticator
	```

6. Download and install `kubectl`.

	```bash
	sudo curl -o /usr/bin/kubectl https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/linux/amd64/kubectl
	sudo chmod +x /usr/bin/kubectl
	```

7. Create a folder named binderhub and get the following files:

	```bash
	mkdir binderhub && cd binderhub
	curl -o eks-config-example.yaml https://bitbucket.org/inaccel/deploy/raw/master/binderhub/eks-config-example.yaml
	curl -o config-fpga-nodes.yaml https://bitbucket.org/inaccel/deploy/raw/master/binderhub/config-fpga-nodes.yaml
	curl -o get-k8s-nodes.sh https://bitbucket.org/inaccel/deploy/raw/master/binderhub/get-k8s-nodes.sh
	```

8. Modify `eks-config-example.yaml` adding your ***publicKey***.

	!!! info

		You can also modify any other option available.

	!!! hint

		In case you do not have a key pair please create one using Amazon EC2
		service.

9. Create an Amazon EKS cluster using the `eks-config-example.yaml` provided.

	```bash
	eksctl create cluster -f eks-config-example.yaml
	```

10. Get the external IPs of the worker nodes (we will need them to configure the
	nodes using ansible). To do so just run `get-k8s-nodes.sh` script. A file
	named `ansible-inventory` will be generated in the same folder.

	```bash
	chmod +x get-k8s-nodes.sh && ./get-k8s-nodes.sh
	```

11. Execute the ansible command to configure all the worker nodes given the
	inventory you just created and specifying your ***private key***.

	```bash
	ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook --private-key=<privateKey> -i ansible-inventory config-fpga-nodes.yaml -u ec2-user -b
	```

12. Install `helm` and `tiller`.

	```bash
	curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash
	kubectl --namespace kube-system create serviceaccount tiller
	kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
	```

13. Init `helm` and `tiller`.

	```bash
	helm init --service-account tiller --wait
	kubectl patch deployment tiller-deploy --namespace=kube-system --type=json --patch='[{"op": "add", "path": "/spec/template/spec/containers/0/command", "value": ["/tiller", "--listen=localhost:44134"]}]'
	helm version
	```

14. Generate two tokens that will be used in the next step.

	```bash
	openssl rand -hex 32
	openssl rand -hex 32
	```

15. Create a `secret.yaml` file with the following structure:

	```yaml
	jupyterhub:
	  hub:
	    services:
	      binder:
	        apiToken: "1st token goes here"
	  proxy:
	      secretToken: "2nd token goes here"
	registry:
	  username: <username>
	  password: <password>
	```

	!!! hint

		Dockerhub registry is used in this example. If you want to connect
		BinderHub to a different docker registry please consider
		[BinderHub documentation](https://binderhub.readthedocs.io)

16. Fill the `secret.yaml` skeleton with the tokens generated and your DockerHub
	credentials.

17. Create a `config.yaml` file with the following structure. Replace
	`docker-id` with your DockerHub account or with your organization's id.

	```yaml
	config:
	  BinderHub:
	    use_registry: true
	    image_prefix: <docker-id>/<prefix>-
	```

18. Install BinderHub. You can modify the `--version` argument as you see fit.
	You can find a list of all the available versions
	[here](https://jupyterhub.github.io/helm-chart/#development-releases-binderhub).

	```bash
	helm repo add jupyterhub https://jupyterhub.github.io/helm-chart
	helm repo update
	helm install jupyterhub/binderhub --version=0.2.0-028.9ba1fc3 --name=binder --namespace=binder -f secret.yaml -f config.yaml
	```

19. Connect BinderHub and JupyterHub.

	```bash
	kubectl --namespace=binder get svc proxy-public | awk 'NR>1 {print $4}'
	```

	!!! hint

		If the above command returns `<pending>` just wait a few moments and
		execute it again.

20. Copy the output of the above command and modify `config.yaml` file adding
	the following:

	```yaml
	config:
	  BinderHub:
	    hub_url: http://<output of the above command>
	```

21. Update Binder beployment. If you chose a different version when installing
	BinderHub make sure you set the same version here:

	```bash
	helm upgrade binder jupyterhub/binderhub --version=0.2.0-028.9ba1fc3 -f secret.yaml -f config.yaml
	```

22. Create a secret for the InAccel Resource Manager licensing system. Make sure
	to enter your license key. If you don't have a license key you can generate
	one for free [here](https://inaccel.com/license).

	```bash
	kubectl create secret generic coral-license-key -n kube-system --from-literal=CORAL_LICENSE_KEY='<your license key>'
	```

23. Deploy InAccel FPGA Kubernetes Plugin:

	```bash
	kubectl apply -f https://bitbucket.org/inaccel/deploy/raw/master/inaccel-fpga-plugin.yml
	```

24. You are all set! Get BinderHub endpoint and paste it in a web browser.

	```bash
	kubectl --namespace=binder get svc binder
	```

	!!! hint

		Wait a couple of minutes for the DNS record returned in the previous
		step to be registered and to become fully functional.

## Run Xilinx Vitis example applications

To promote the benefits of Xilinx's Vitis accelerators, we have created several
jupyter notebooks that invoke the accelerators and can be instantly spawned
using BinderHub. We have modified the Vitis software libraries to use our
framework's API and have implemented the corresponding notebooks.

1. In the BinderHub endpoint you setup previously select **Git repository** from
	the drop down list and then paste the following URL:

	```bash
	https://bitbucket.org/inaccel/vitis-notebooks
	```

	On the **Git branch** field write `aws` and click **Launch**. You should now
	see the docker image being built and after a while a Jupyter Notebook will
	automatically pop up.

	![picture](/img/binder.png){: .center}

2. Run any of the notebooks available or create your own.
