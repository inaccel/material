*![time/embed](Estimated reading time: {X})*

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
* **AutoML (Katib)**, for automated tuning of ML model's hyperparameters and
* **Pipelines**, for building end-to-end ML workflows, based on containers.

Although, until now, the kubeflow community has presented applications on CPUs
or GPUs, InAccel brings another option. With [**InAccel FPGA Operator**](https://artifacthub.io/packages/chart/inaccel/fpga-operator),
the accelerated applications can be seamlessly orchestrated without worrying
about resource management and utilization of the FPGA cluster.

### Prerequisites

To run this tutorial, you need a Linux machine with a remarkable amount of
cores, RAM and storage. You will also need root privileges to run some of the
steps. For the sake of simplicity in this tutorial we will use
[MicroK8s](https://microk8s.io/) to run Kubernetes, since InAccel FPGA Operator
can be enabled on any K8s cluster (e.g. Amazon EKS, Google GKE, etc).

## Set up MicroK8s

The following steps present how to create, configure and launch a single-node
Kubernetes cluster on an Ubuntu Linux system.

### 1. Install MicroK8s

[MicroK8s](https://microk8s.io/docs) provides a powerful K8s cluster that is ideal
for development and testing purposes.
Alternatively, you can use Kubernetes on Amazon Web Services, Google Cloud
Platform or any other cloud provider.

```bash
# install with snap
sudo snap install microk8s --classic --channel=1.21/stable

# join the group
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube

# re-enter the session for the group update to take place
su - $USER

# wait for the Kubernetes services to initialize:
microk8s status --wait-ready
```

### 2. Enable addons, Kubeflow and optionally set aliases

In order for the InAccel FPGA Operator to work properly, dns, helm3 and storage addons need to be additionally enabled.

```bash
microk8s enable dns helm3 storage kubeflow

alias helm="microk8s helm3"
alias kubectl="microk8s kubectl"
```

### 3. Deploy InAccel FPGA Operator
[InAccel FPGA Operator](https://artifacthub.io/packages/chart/inaccel/fpga-operator) is a Helm chart deployed, cloud-native method to standardize and automate the deployment of all necessary components for provisioning FPGA-enabled Kubernetes systems.

```bash
helm repo add inaccel https://setup.inaccel.com/helm
helm install inaccel inaccel/fpga-operator --set kubelet=/var/snap/microk8s/common/var/lib/kubelet
```

### 4. Access Kubeflow Dashboard

The way you can access Central Dashboard and navigate through its components,
depends on where Kubeflow is deployed. You can find detailed instructions on how to access the Kubeflow dashboard [here](https://www.kubeflow.org/docs/distributions/microk8s/kubeflow-on-microk8s/#accessing-the-kubeflow-dashboard) .

* If you installed MicroK8s directly on your Linux machine, you can view the Kubeflow dashboard as follows:

	1. Open a web browser window.
	2. Access the link provided after you have enabled Kubeflow (for example, `10.64.140.43.nip.io`).

* If the cluster is running on a **remote** machine like in our case (AWS EC2 f1
	instance):

	1. Log out from the current session in your terminal using the exit command.
	2. Re-establish connection to the machine using SSH, enabling SOCKS proxy with the `-D9999` parameter.

	```bash
	ssh -D9999 <user>@<machine_public_ip>
	```

	In your host operating system or browser, go to `Settings > Network > Network Proxy`, and enable SOCKS proxy pointing to: `127.0.0.1:9999`.

	Finally, access the Kubeflow dashboard by:

	- Opening a new web browser window.
	- Accessing the link provided after you have enabled Kubeflow (for example, `10.64.140.43.nip.io`).

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

3. Run the experiment from the Katib UI by submitting the YAML file and
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
	spec:
	  template:
	    metadata:
	      labels:
	        inaccel/fpga: enabled
	      annotations:
	        inaccel/cli: |
	          bitstream install --mode others https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/shell-v04261818_201920.2/aws/com/inaccel/xgboost/0.1/2exact
	    spec:
	      containers:
	        - name: training-container
	          image: "docker.io/inaccel/jupyter:lab"
	          command:
	            - python3
	            - XGBoost/parameter-tuning.py
	          args:
	            - "--name=SVHN"
	            - "--test-size=0.35"
	            - "--tree-method=fpga_exact"
	            - "--max-depth=10"
	            - "--alpha=${trialParameters.alpha}"
	            - "--eta=${trialParameters.eta}"
	            - "--subsample=${trialParameters.subsample}"
	          resources:
	            limits:
	              xilinx/aws-vu9p-f1: 1
	      restartPolicy: Never
	```

=== "CPU"

	```yaml
	apiVersion: batch/v1
	kind: Job
	spec:
	  template:
	    spec:
	      containers:
	        - name: training-container
	          image: "docker.io/inaccel/jupyter:lab"
	          command:
	            - python3
	            - XGBoost/parameter-tuning.py
	          args:
	            - "--name=SVHN"
	            - "--test-size=0.35"
	            - "--max-depth=10"
	            - "--alpha=${trialParameters.alpha}"
	            - "--eta=${trialParameters.eta}"
	            - "--subsample=${trialParameters.subsample}"
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
