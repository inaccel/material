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
adaptive acceleration platforms (ACAP, FPGA) provides an FPGA operator
that allows instant deployment, scaling and virtualization of FPGAs making the
utilization of FPGA clusters easier than ever. InAccel's FPGA Kubernetes device plugin
enables users to accelerate their Pods within the snap of a finger. That said it
really makes sense to combine all that together to provide seamless acceleration
for any computational intensive workload.

Supposedly having already deployed a Kubernetes cluster over a bunch of servers
hosting FPGAs and having setup BinderHub you only need to deploy InAccel FPGA
Operator to enable FPGA accelerated notebooks:

1. Deploy InAccel FPGA Operator:

	```bash
	helm repo add inaccel https://setup.inaccel.com/helm
	helm repo update
	helm install my-fpga-operator inaccel/fpga-operator
	```

	!!! hint
		If you want to run the enterprise edition of Coral or for example to specify the monitor port, you can do so by setting the corresponding values at the step of installing InAccel FPGA Operator. You can find a list of all the available parameters [here](https://artifacthub.io/packages/helm/inaccel/fpga-operator#parameters).
		Example:
		```bash
		helm install my-fpga-operator inaccel/fpga-operator --set license=<your-license> --set monitor.port=<your-monitor-port>
		```

You can now run any FPGA accelerated application simply by specifying a Git repo in your BinderHub endpoint.

## A Use Case Scenario using Amazon EKS

Amazon offers its so called [**EKS**](https://aws.amazon.com/eks) service for
creating Kubernetes clusters. What is more,
[**Amazon's F1**](https://aws.amazon.com/ec2/instance-types/f1) (FPGA) instances
are supported by EKS meaning that a user can easily create a Kubernetes cluster
hosting F1 instances, to accelerate applications using the power of FPGAs and
this is why we are using it in this tutorial.

At this point we are going to guide you through the whole procedure of creating
a Kubernetes cluster in Amazon AWS using EKS service and how to further on
deploy BinderHub, [**InAccel FPGA Operator**](/setup/kubernetes) and
run an FPGA accelerated application.

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

1. Install `python3-pip`.

	=== "Apt"

		```bash
		sudo apt install -y python3-pip
		```

	=== "Yum"

		```bash
		sudo yum install -y python3-pip
		```

2. Download and install `eksctl`.

	```bash
	curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
	sudo mv /tmp/eksctl /usr/bin
	```

3. Install and configure `awscli`.

	```bash
	sudo pip3 install --upgrade awscli
	aws configure
	```

4. Download and install `kubectl`.

	```bash
	sudo curl -o /usr/bin/kubectl https://s3.us-west-2.amazonaws.com/amazon-eks/1.22.6/2022-03-09/bin/linux/amd64/kubectl
	sudo chmod +x /usr/bin/kubectl
	```

5. Setup [helm3](https://helm.sh/docs/intro/install/#from-script):  

	```bash
	curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
	chmod 700 get_helm.sh
	./get_helm.sh
	```

6. Create a Kubernetes Cluster in AWS:

	At this ponint we create a Kubernetes cluster in AWS named `binderhub` that
	will by default spawn two worker nodes with the eks default values.

	```bash
	eksctl create cluster \
		--asg-access \
		--name binderhub \
		--nodegroup-name default \
		--region us-east-1 \
		--version 1.22 \
		--zones us-east-1a,us-east-1b,us-east-1c
	```

7. Create an auto-scaling group of **F1 instances**:

	We set the minimum number of this nodegroup's nodes to zero (0) since we
	don't want to be charged for the FPGA instances unless a pod is requesting
	FPGA resources. In such case, an FPGA (F1) node will be automatically
	spawned and provisioned to handle this acceleration request. To enable this
	functionality we also have to deploy cluster autoscaler (next step).

	```bash
	eksctl create nodegroup \
		--asg-access \
		--cluster binderhub \
		--managed=false \
		--name f1-2xlarge \
		--node-labels inaccel/fpga=enabled \
		--node-type f1.2xlarge \
		--nodes 0 \
		--nodes-max 3 \
		--nodes-min 0 \
		--tags k8s.io/cluster-autoscaler/enabled=true \
		--tags k8s.io/cluster-autoscaler/binderhub=owned \
		--tags k8s.io/cluster-autoscaler/node-template/label/node.kubernetes.io/instance-type=f1.2xlarge \
		--tags k8s.io/cluster-autoscaler/node-template/resources/xilinx/aws-vu9p-f1=1
	```

8. Deploy Kubernetes cluser-autoscaler:

	We make sure that the cluster autoscaler points to the correct Kubernetes
	cluster by specifying the `autoDiscovery.clusterName` and `awsRegion`
	properties.

	```bash
	helm repo add cluster-autoscaler https://kubernetes.github.io/autoscaler
	helm repo update
	helm install cluster-autoscaler cluster-autoscaler/cluster-autoscaler \
	    --set autoDiscovery.clusterName=binderhub \
	    --set awsRegion=us-east-1
	```

9. Prepare the binderhub deployment:

 	To deploy Binderhub we have to first create a yaml file that will host all
	the required configurations. For example, we specify that the pods to be
	spawned by BinderHub, should be labeled as `inaccel/fpga: "enabled"` and
	should request exactly one `xilinx/aws-vu9p-f1` FPGA resource.

	Make sure you replace `docker-id`, `organization-name`, `prefix` and
	`password` with your own values.

	```yaml title="config.yaml"
	config:
	  BinderHub:
	    use_registry: true
	    image_prefix: <docker-id OR organization-name>/<prefix>-

	dind:
	 enabled: true

	jupyterhub:
	  singleuser:
	    profileList:
	      - display_name: "FPGA Server"
	        description: "Spawns a notebook server with access to an FPGA"
	        kubespawner_override:
	          extra_labels:
	            inaccel/fpga: "enabled"
	          extra_resource_limits:
	            xilinx/aws-vu9p-f1: "1"

	registry:
	  username: <docker-id>
	  password: <password>
	```

	!!! hint

		Dockerhub registry is used in this example. If you want to connect
		BinderHub to a different docker registry please consider
		[BinderHub documentation](https://binderhub.readthedocs.io)

10. Install BinderHub.

	You can modify the `--version` argument as you see fit. You can find a list
	of all the available versions [here](https://jupyterhub.github.io/helm-chart/#development-releases-binderhub).

	```bash
	helm repo add jupyterhub https://jupyterhub.github.io/helm-chart
	helm repo update
	helm install binder jupyterhub/binderhub --version=0.2.0-n905.h3d3e24e --namespace=binder -f config.yaml --create-namespace
	```

11. Connect BinderHub and JupyterHub.

	```bash
	kubectl --namespace=binder get svc proxy-public | awk 'NR>1 {print $4}'
	```

	!!! hint

		If the above command returns `<pending>` just wait a few moments and
		execute it again.

	Copy the output of the above command and edit `config.yaml` file adding
	the following:

	```yaml title="config.yaml"
	config:
	  BinderHub:
	    hub_url: http://<output of the above command>
	```

	The whole `config.yaml` file should look like this:

	```yaml title="config.yaml"
	config:
	  BinderHub:
	    use_registry: true
	    image_prefix: <docker-id OR organization-name>/<prefix>-
	    hub_url: http://<output-of-the-above-command>

	dind:
	 enabled: true

	jupyterhub:
	  singleuser:
	    profileList:
	      - display_name: "FPGA Server"
	        description: "Spawns a notebook server with access to an FPGA"
	        kubespawner_override:
	          extra_labels:
	            inaccel/fpga: "enabled"
	          extra_resource_limits:
	            xilinx/aws-vu9p-f1: "1"

	registry:
	  username: <docker-id>
	  password: <password>
	```

12. Update Binder beployment. If you chose a different `version` when installing
	BinderHub make sure you set the same one here:

	```bash
	helm upgrade binder jupyterhub/binderhub --version=0.2.0-n905.h3d3e24e --namespace=binder -f config.yaml
	```

14. Deploy InAccel FPGA Operator:

	```bash
	helm repo add inaccel https://setup.inaccel.com/helm
	helm repo update
	helm install inaccel-fpga-operator inaccel/fpga-operator
	```

15. You are all set! Get BinderHub endpoint and paste it in a web browser.

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

1. In the BinderHub endpoint you setup previously, paste the following URL and
then hit **Launch**:

	```bash
	https://github.com/inaccel/Vitis_Notebooks
	```

	You should then see a docker image being built and after a while you should
	be reirected to a fully working Jupyter Notebook environment.

	![picture](/img/binder.png){: .center}

2. Run any of the notebooks available or create your own.
