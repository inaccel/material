*![time/embed](Estimated reading time: {X})*

In this tutorial we will demonstrate how to develop a complete machine learning
application using FPGAs on Katib.

### Introduction

[Katib](https://www.kubeflow.org/docs/components/katib/overview/) is a
Kubernetes-native project for automated machine learning (AutoML). Katib
supports hyperparameter tuning, early stopping and neural architecture search
(NAS). It is the project which is agnostic to machine learning (ML) frameworks.
It can tune hyperparameters of applications written in any language of the users'
choice and natively supports many ML frameworks, such as TensorFlow, MXNet,
PyTorch, XGBoost, and others.

Some of the hyperparameters include:

* The learning rate.
* The number of layers in a neural network.
* The number of nodes in each layer.

Although, until now, the katib community has presented applications on CPUs
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

The following steps describe how to create, configure and launch a single-node
Kubernetes cluster on an Ubuntu Linux system.

### 1. Install MicroK8s

[MicroK8s](https://microk8s.io/docs) provides a powerful K8s cluster that is ideal
for development and testing purposes.
Alternatively, you can use Kubernetes on Amazon Web Services, Google Cloud
Platform or any other cloud provider.

```bash
# install with snap
sudo snap install microk8s --classic --channel=latest/edge

# join the group
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube

# re-enter the session for the group update to take place
su - $USER

# wait for the Kubernetes services to initialize:
microk8s status --wait-ready

alias kubectl="microk8s kubectl"
```

### 2. Enable `inaccel` and `storage` addons

[InAccel FPGA Operator](https://artifacthub.io/packages/chart/inaccel/fpga-operator)
is a Helm chart deployed, cloud-native method to standardize and automate the
deployment of all necessary components for provisioning FPGA-enabled Kubernetes
systems. It can be deployed on microk8s simply by enabling `inaccel` add-on.

For Katib to work properly, we also need to enable the `storage`
 plugin.

```bash
microk8s enable inaccel storage

# wait until InAccel FPGA operator pods are running
kubectl rollout status --namespace kube-system daemonset.apps/fpga-operator
```

### 3. Deploy Katib

```bash
# Deploy Katib components
kubectl apply -k "github.com/kubeflow/katib.git/manifests/v1beta1/installs/katib-standalone?ref=master"

# Wait until all Katib pods are running.
kubectl wait --for=condition=ready --timeout=-1s -l "katib.kubeflow.org/component in (controller,db-manager,mysql,ui)" -n kubeflow pod
```

### 4. Access Katib UI

To access the UI you can set port-forwarding for the Katib UI service:

```bash
kubectl port-forward svc/katib-ui -n kubeflow 8080:80 --address 0.0.0.0
```

Then you can access the Katib UI at the following URL:

```bash
http://<machine_public_ip>:8080/katib/
```

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

	![submit](/img/katib-submit.png){: .center}

3. Run the experiment from the Katib UI by submitting the YAML file and
	'**Monitor**' the trials.

	![monitor](/img/katib-monitor.png){: .center}

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

	![cpu](/img/katib-cpu.png)

* FPGA-accelarated training plot:

	![fpga](/img/katib-fpga.png)

In the above plots we see the objective metrics, `accuracy` and `time`, along
with the three hyperparameters we chose to tune. We can keep the best
combination of them, get more info or retry with another experiment.

We notice that the accuracy of the best model is the same on both executions,
however the multi-threaded CPU-only training needs *1018 seconds* on average, to
	finish, while the FPGA-accelerated one lasts only ~*174 seconds*. This means that
**InAccel XGBoost** achieves up to **5.85x speedup** on this use case.

!!! note

	Both experiments ran on the same machine (AWS f1.2xlarge) that hosts 8 Intel
	Xeon Cores plus 1 Xilinx VU9P FPGA.
