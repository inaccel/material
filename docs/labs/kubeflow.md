*<small id="time">Estimated reading time: X</small>*

In this tutorial we will demonstrate how to develop a complete machine learning
application using FPGAs on Kubeflow.

### Introduction

[Kubeflow](https://kubeflow.org) is known as a machine learning toolkit for
Kubernetes. It is an open source project dedicated to making deployments of
machine learning workflows on Kubernetes simple, portable, and scalable. It is
used by data scientists and ML engineers who want to build, experiment, test and
serve their ML workflows to various environments.

Some of the main components that make up [Kubeflow](https://kubeflow.org/docs)
include:

* **Central Dashboard**, that provides access to the other main components
through a Web UI
* **Notebook Servers**, to set up Jupyter notebooks
* **Katib**, for automated tuning of ML model's hyperparameters and
* **Pipelines**, for building end-to-end ML workflows, based on containers.

Although, until now, the kubeflow community has presented applications on CPUs
or GPUs, InAccel brings another option. With **InAccel FPGA Kubernetes plugin**,
the accelerated applications can be seamlessly orchestrated without worrying
about resource management and utilization of the FPGA cluster.

### Prerequisites

To run this tutorial, you need an Linux machine with a remarkable amount of
cores, RAM and storage. You will also need root privileges to run some of the
steps. For the sake of simplicity in this tutorial we will use
[Minikube](https://minikube.sigs.k8s.io) to run Kubernetes, since InAccel FPGA
plugin can be enabled on any K8s cluster (e.g. Amazon EKS, Google GKE, etc).

## Set up Docker, kubectl, Minikube and InAccel

The following steps present how to create, configure and launch a single-node
Kubernetes cluster on a RHEL-based Linux system.

### 1. Install Docker

[Docker](https://docs.docker.com/install) is an open-source containerization
technology for building and sharing your applications on any environment.

```bash
sudo yum install -y yum-utils \
	device-mapper-persistent-data \
	lvm2

sudo yum-config-manager \
	--add-repo \
	https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce docker-ce-cli containerd.io

sudo systemctl start docker
```

### 2. Install kubectl

The Kubernetes command-line tool,
[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl), allows you to
run commands against Kubernetes clusters. You can use kubectl to deploy
applications, inspect and manage cluster resources, and view logs.

```bash
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl

chmod +x ./kubectl

sudo mv ./kubectl /usr/local/bin/kubectl
```

### 3. Install Minikube

[Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube) provides a
single-node K8s cluster that is ideal for development and testing purposes.
Alternatively, you can use Kubernetes on Amazon Web Services, Google Cloud
Platform or any other cloud provider.

```bash
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
	&& chmod +x minikube

sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```

### 4. Install InAccel

[InAccel](https://docs.inaccel.com/inaccel/overviews) is an open platform for
developing, shipping, and running accelerated applications. InAccel enables you
to separate your applications from your accelerators so you can deliver
high-performance software quickly.

```bash
curl -sL https://jfrog.inaccel.com/artifactory/generic/packages/inaccel.repo | \
	sudo tee /etc/yum.repos.d/inaccel.repo

sudo yum install -y inaccel

sudo systemctl restart docker
```

### 5. Start Minikube

```bash
minikube start --vm-driver=none
```

### 6. Deploy InAccel FPGA Plugin

Having your Kubernetes cluster up and running you only need two steps to enable
FPGA accelerator orchestration. Get a free license
[**here**](https://inaccel.com/license).

```bash
kubectl create secret generic coral-license-key -n kube-system \
	--from-literal=CORAL_LICENSE_KEY='<your licence key>'

kubectl apply -f https://bitbucket.org/inaccel/deploy/raw/master/inaccel-fpga-plugin.yml
```

## Set up Kubeflow

After setting up the above tools we can create a deployment of Kubeflow with all
its core components without any external dependencies as explained
[here](https://kubeflow.org/docs/started/k8s/kfctl-k8s-istio).

### 1. Install kfctl

Download a kfctl [release](https://github.com/kubeflow/kfctl/releases) and
extract the included binary.

```bash
wget -qO- https://github.com/kubeflow/kfctl/releases/download/v1.0.1/kfctl_v1.0.1-0-gf3edb9b_linux.tar.gz | \
	tar -zxvf -

sudo install kfctl /usr/local/bin
```

### 2. Configure and deploy Kubeflow

Set the configuration file to use when deploying Kubeflow.

```bash
export CONFIG_URI="https://raw.githubusercontent.com/kubeflow/manifests/v1.0-branch/kfdef/kfctl_k8s_istio.v1.0.1.yaml"
```

Then set the Kubeflow application directory for this deployment.

```bash
mkdir -p kftest
cd kftest
```

Configure and deploy Kubeflow using the following `kfctl apply` command.

```bash
kfctl apply -V -f ${CONFIG_URI}
```

List all the pods in the Kubeflow namespace.

```bash
kubectl get pods -n kubeflow
```

### 3. Access Kubeflow Dashboard

The way you can access Central Dashboard and navigate through its components,
depends on where is your host machine.

* If the Kubernetes cluster is running **locally** run these commands:

	```bash
	export INGRESS_HOST=$(minikube ip)

	export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}’)
	```

	And then in a web browser visit:

	```text
	http://$INGRESS_HOST:$INGRESS_PORT
	```

* If the cluster is running on a **remote** machine like in our case (AWS EC2 f1
	instance) run:

	```bash
	kubectl port-forward -n istio-system svc/istio-ingressgateway 8080:80 --address 0.0.0.0
	```

	Open a new SSH client specifying the connections to be forwared to the
	remote port, i.e:

	```bash
	ssh -L 9090:localhost:8080 <user>@<hostname>
	```

	Since we used `9090` as the local TCP port, access the central navigation
	dashboard at `localhost:9090`.

![dashboard](/img/kubeflow-dashboard.png)

Now, you can navigate and create ML workflows on the KF component of your choice
following the instructions on the
[Getting Started](https://kubeflow.org/docs/components) guides.

## Accelerated XGBoost with Katib Hyperparameter tuning

**XGBoost** is a powerful machine learning library that has recently been
dominating applied machine learning since is quite easy to build any predictive
model. But, improving the model is difficult due to the large number of
[parameters](https://xgboost.readthedocs.io/en/latest/parameter.html) and
requires careful tuning to fully leverage its advantages over other algorithms.

**Hyperparameter tuning** is the process of optimizing the hyperparameter values
to maximize the predictive accuracy of a model. If you don’t use Katib or a
similar framework for hyperparameter tuning, you would need to run many
training jobs by yourself, manually adjusting the parameters to find the optimal
values.

These are three steps in order to
[run your own experiments](https://kubeflow.org/docs/components/hyperparameter-tuning/experiment):

1. Package your ML training application as a Docker container image and make
	that image available in a registry.

2. Define the experiment specifications from Katib's '**Submit**' UI or uaing
	a YAML configuration file, setting the parameters you want to tune, the
	objective metric (e.g. model accuracy), the number of trials and more. Using
	the `trialTemplate` field you can also allocate the FPGA resources to enable
	the FPGA-accelerated execution. For example:

	```yaml
	resources:
	  limits:
	    xilinx/aws-vu9p-f1: 1
	```

	![submit](/img/kubeflow-submit.png)

3. Run the experiment from the Katib UI by submiting the YAML file and
	'**Monitor**' the trials.

	![monitor](/img/kubeflow-monitor.png)

### Image classification on SVHN dataset

![svhn](/img/svhn.png){: .center}

[SVHN](http://ufldl.stanford.edu/housenumbers) is a real-world image dataset,
obtained from house numbers in Google Street View images. It consists of 99289
samples and 10 classes, with every sample being a 32-by-32 RGB image (3072
features).

The code of the XGboost training app can be found on
[GitHub](https://github.com/inaccel/jupyter/blob/master/lab/dot/XGBoost/parameter-tuning.py)
but also inside '*inaccel/jupyter:lab*' Docker image.

After defining the parameter list, the search algorithm, the metrics and the
other trial specifications we create a `trialTemplate` YAML, in which we:

* specify which application will run inside the containers,
* define the `tree_method` parameter (`exact`, `hist`, `fpga_exact`, etc.),
* load the bitstream package for XGBoost accelerator and
* allocate the FPGA resources as we mentioned previously.

=== "FPGA"

	```yaml
	apiVersion: batch/v1
	kind: Job
	metadata:
	  name: {{.Trial}}
	  namespace: {{.NameSpace}}
	spec:
	  template:
	    spec:
	      containers:
	      - name: {{.Trial}}
	        image: docker.io/inaccel/jupyter:lab
	        command:
	        - "python3"
	        args:
	        - "XGBoost/parameter-tuning.py"
	        - "--name SVHN"
	        - "--test-size 0.35"
	        - "--max-depth 10"
	        - "--tree-method fpga_exact"
	        - "--bitstream https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic_5.0/com/inaccel/xgboost/0.1/2exact"
	        {{- with .HyperParameters}}
	        {{- range .}}
	        - "{{.Name}}={{.Value}}"
	        {{- end}}
	        {{- end}}
	        resources:
	          limits:
	        	xilinx/aws-vu9p-f1: 1
	      restartPolicy: Never
	```

=== "CPU"

	```yaml
	apiVersion: batch/v1
	kind: Job
	metadata:
	  name: {{.Trial}}
	  namespace: {{.NameSpace}}
	spec:
	  template:
	    spec:
	      containers:
	      - name: {{.Trial}}
	        image: docker.io/inaccel/jupyter:lab
	        command:
	        - "python3"
	        args:
	        - "XGBoost/parameter-tuning.py"
	        - "--name SVHN"
	        - "--test-size 0.35"
	        - "--max-depth 10"
	        - "--tree-method exact"
	        {{- with .HyperParameters}}
	        {{- range .}}
	        - "{{.Name}}={{.Value}}"
	        {{- end}}
	        {{- end}}
	      restartPolicy: Never
	```

Finally, we submit the experiment and navigate to the monitor screen.

* CPU-only training plot:

	![cpu](/img/kubeflow-cpu.png)

* FPGA-accelarated training plot:

	![fpga](/img/kubeflow-fpga.png)

In the above plots we see the objective metrics, `accuracy` and `time`, along
with the three hyperparameters we chose to tune. We can keep the best
combination of them, get more info or retry with another experiment.

We notice that the accuracy of the best model is the same on both executions,
however the multi-threaded CPU-only training needs *1100 seconds*, on average, to
finish, while the FPGA-accelerated one lasts only ~*245 seconds*. This means that
**InAccel XGBoost** achieves up to **4.5x speedup** on this use case.

!!! note

	Both experiments ran on the same machine (AWS f1.2xlarge) that hosts 8 Intel
	Xeon Cores plus 1 Xilinx VU9P FPGA.

The following video presents a complete walkthrough on how to submit a new
experiment using Katib and highlights the extra steps needed for the FPGA
deployment along with a small comparison of CPU and FPGA execution times.

![youtube/embed](5_IMstcic6E)
