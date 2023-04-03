*![time/embed](Estimated reading time: {X})*

In this lab we will go through the setup of a hybrid Kubernetes (K8s) cluster
with FPGA support. By the term *hybrid*, we indicate that there is going to be a
mix of on-prem and AWS nodes. Of course this approach is way more complex
compared to a classic K8s deployment but it has its own benefits too.

Today, we introduce a way of automatically expanding your local Kubernetes
cluster with AWS EC2 instances, while taking advantage of the performance
improvements that FPGA accelerators can offer. To make the overall configuration
and deployment as seamless and easy to use as possible, we use **kubeadm** for
initializing the cluster's control-plane and further on joining new nodes,
AWS **Auto Scaling Groups** and AWS **Launch Configurations** driven by
[**Cluster Autoscaler**](https://hub.helm.sh/charts/stable/cluster-autoscaler)
for the instantiation of Amazon compute resources and
[**InAccel FPGA Operator**](https://hub.helm.sh/charts/inaccel/fpga-operator)
for the discovery, announcement and management of the available FPGAs, but also
for the ease of deployment of containerized hardware accelerated applications,
especially in cases where nodes have multiple FPGA cards (e.g *f1.4xlarge* and
*f1.16xlarge*) and users want to instantly take advantage of them without code
modifications.

This tutorial is split in the following 3 sections:

1. [Preparation and tools](#preparation-and-tools)
2. [Cluster bring-up](#cluster-bring-up)
3. [Evaluation with FPGA workloads](#evaluation-with-fpga-workloads)

## Preparation and tools

In this section we will go through the prerequisites for setting up our cluster.
To begin with, a big challenge is to make the nodes in our private network
communicate with the nodes residing in the AWS VPCs. For that reason, we need to
create a Virtual Private Network (VPN) and connect all the nodes to it. For the
purposes of this demonstration we will host an
[OpenVPN Access Server](https://openvpn.net/vpn-server) on the K8s `master`
node, with the following configuration:

| Network Settings | Option   |
| :--------------- | -------: |
| Protocol         | **UDP**  |
| Port number      | **1194** |

| VPN Settings                                                                        | Option                 |
| :---------------------------------------------------------------------------------- | ---------------------: |
| Should clients be able to communicate with each other on the VPN IP Network?        | **Yes, using Routing** |
| Allow access from these private subnets to all VPN client IP addresses and subnets  | **Yes**                |
| Should client Internet traffic be routed through the VPN?                           | **No**                 |
| Should clients be allowed to access network services on the VPN gateway IP address? | **Yes**                |
| Do not alter clients' DNS server settings                                           | **Yes**                |

| Advanced VPN                                                                 | Option  |
| :--------------------------------------------------------------------------- | ------: |
| Should clients be able to communicate with each other on the VPN IP Network? | **Yes** |

Below you will also find the full list of the required software packages:

> Master node: &nbsp;&nbsp;&nbsp; `docker`, `helm`, `kubeadm`, `openvpn-as`

> Worker nodes: &nbsp;&nbsp;&nbsp; `docker`, `inaccel`, `kubeadm`, `openvpn`,
> `xrt`

!!! note

	* On every node [docker](https://docs.docker.com/engine/install) and
		[kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm)
		must be installed.
	* On every worker node
		[Xilinx XRT](https://www.xilinx.com/products/design-tools/vitis/xrt.html)
		is required accompanied by [InAccel](/install) runtime (as the default
		runtime).
	* [OpenVPN](https://openvpn.net/download-open-vpn) server and client
		packages are also needed for the VPN connections on the master and
		worker nodes, respectively.

!!! important

	Make sure that `swap` is turned off on every node
	([kubernetes/kubernetes#53533](https://github.com/kubernetes/kubernetes/issues/53533)).

	```bash
	sudo swapoff -a
	```

	Always enable and start the Docker service before adding a node.

	```bash
	sudo systemctl enable docker
	sudo systemctl start docker
	```

For the AWS worker nodes we have prepared a community AMI with all the required
dependencies pre-installed.

## Cluster bring-up

Now that everything is ready, let's move on to the actual cluster bring-up. For
all the worker nodes (both on-prem and AWS ones) we have created a bootstrap
script that simplifies the process of bootstrapping a new node into our hybrid
Kubernetes cluster.

??? edit "Click here to inspect `bootstrap.sh` script!"

	```bash
	#!/bin/bash

	set -o pipefail
	set -o nounset
	set -o errexit

	err_report() {
	    echo "Exited with error on line $1"
	}
	trap 'err_report $LINENO' ERR

	IFS=$'\n\t'

	function print_help {
	    echo "usage: $0 [options]"
	    echo "Bootstraps an instance into an InAccel hybrid Kubernetes cluster"
	    echo ""
	    echo "-h,--help print this help"
	    echo "--apiserver-endpoint The API Server endpoint."
	    echo "--discovery-token-ca-cert-hash For token-based discovery, validate that the root CA public key matches this hash."
	    echo "--labels Labels to add when registering the node in the cluster. Labels must be key=value pairs separated by ','."
	    echo "--openvpn-config Read OpenVPN configuration options from file."
	    echo "--openvpn-login Authenticate with OpenVPN server using username/password."
	    echo "--token Use this token for both discovery-token and tls-bootstrap-token."
	}

	while [[ $# -gt 0 ]]; do
	    key="$1"
	    case $key in
	        -h|--help)
	            print_help
	            exit 1
	            ;;
	        --apiserver-endpoint)
	            API_SERVER_ENDPOINT="$2"
	            shift
	            shift
	            ;;
	        --discovery-token-ca-cert-hash)
	            CA_CERT_HASHES="$2"
	            shift
	            shift
	            ;;
	        --labels)
	            NODE_LABELS="$2"
	            shift
	            shift
	            ;;
	        --openvpn-config)
	            CONFIG="$2"
	            shift
	            shift
	            ;;
	        --openvpn-login)
	            AUTH_USER_PASS="$2"
	            shift
	            shift
	            ;;
	        --token)
	            TOKEN="$2"
	            shift
	            shift
	            ;;
	        *)    # unknown option
	            shift # past argument
	            ;;
	    esac
	done

	set +u

	openvpn --config $CONFIG --auth-user-pass $AUTH_USER_PASS &

	while true; do
	    export TUNNEL_IP=$(ifconfig tun0 | grep 'inet ' | awk '{print $2}')
	    [[ -z $TUNNEL_IP ]] || break
	    sleep 3
	done

	cat > init.conf << EOF
	apiVersion: kubeadm.k8s.io/v1beta2
	discovery:
	  bootstrapToken:
	    apiServerEndpoint: $API_SERVER_ENDPOINT
	    token: $TOKEN
	    caCertHashes:
	      - $CA_CERT_HASHES
	    unsafeSkipCAVerification: true
	kind: JoinConfiguration
	nodeRegistration:
	  name: $TUNNEL_IP
	  kubeletExtraArgs:
	EOF

	AWS_INSTANCE_TYPE=$(curl -s http://169.254.169.254/latest/meta-data/instance-type) || AWS_INSTANCE_TYPE="none"
	if [[ $AWS_INSTANCE_TYPE == "none" ]]; then
	    cat >> init.conf << EOF
	    node-labels: $NODE_LABELS
	EOF
	else
	    if [[ ! -z $NODE_LABELS ]]; then
	        NODE_LABELS+=","
	    fi
	    NODE_LABELS+="node.kubernetes.io/instance-type=$AWS_INSTANCE_TYPE"

	    cat >> init.conf << EOF
	    node-labels: $NODE_LABELS
	EOF
	fi

	ip route add 10.96.0.0/16 dev tun0 src $TUNNEL_IP

	kubeadm join --config init.conf
	```

### Setup the Master node

1. Initialize the Kubernetes control-plane. Use the VPN IP, that the OpenVPN
	Access Server has assigned to that node (e.g `172.27.224.1`), as the IP
	address the API Server will advertise it's listening on.

	```bash
	sudo kubeadm init \
		--apiserver-advertise-address=172.27.224.1 \
		--kubernetes-version stable-1.18
	```

	To make `helm` and `kubectl` work for your non-root user, use the commands
	from the `kubeadm init` output.

2. Deploy **Calico** network policy engine for Kubernetes.

	```bash
	kubectl apply -f https://docs.projectcalico.org/v3.14/manifests/calico.yaml
	```

3. Deploy **Cluster Autoscaler** for AWS.

	```bash
	helm repo add stable https://kubernetes-charts.storage.googleapis.com
	helm install cluster-autoscaler stable/cluster-autoscaler \
		--set autoDiscovery.clusterName=InAccel \
		--set awsAccessKeyID=<your-aws-access-key-id> \
		--set awsRegion=us-east-1 \
		--set awsSecretAccessKey=<your-aws-secret-access-key> \
		--set cloudProvider=aws
	```

4. Deploy **InAccel FPGA Operator**.

	```bash
	helm repo add inaccel https://setup.inaccel.com/helm
	helm install inaccel inaccel/fpga-operator \
		--set license=<your-license> \
		--set nodeSelector.inaccel/fpga=enabled
	```

### Setup the local Worker nodes

For the local nodes, you can simply use the `bootstrap.sh` script providing all
the necessary arguments. For example:

```bash
./bootstrap.sh \
	--apiserver-endpoint <your-apiserver-endpoint> \
	--discovery-token-ca-cert-hash <your-discovery-token-ca-cert-hash> \
	--labels inaccel/fpga=enabled \
	--openvpn-config <your-openvpn-config> \
	--openvpn-login <your-openvpn-login> \
	--token <your-token>
```

!!! note

	In case that you don't remember your `kubeadm` tokens, you can always issue
	new ones using the following command:

	```bash
	kubeadm token create --print-join-command --ttl 0
	```

### Setup the AWS Worker nodes

For the AWS nodes, we provide an **AMI** including all the required packages
mentioned in the previous section, but also the `bootstrap.sh` script.

Let's now create two new **Auto Scaling Groups** with specific
**Launch Configurations** in order to be used by the **Cluster Autoscaler**.

The process of creating the above resources is pretty simple if you have already
configured the [AWS CLI](https://aws.amazon.com/cli) (`aws`).

=== "f1.2xlarge"

	```bash
	aws autoscaling create-launch-configuration \
		--image-id ami-02e0c24a82677f084 \
		--instance-type f1.2xlarge \
		--key-name <your-key-name> \
		--launch-configuration-name f1-2xlarge \
		--region us-east-1 \
		--user-data <your-user-data>
	```

=== "f1.4xlarge"

	```bash
	aws autoscaling create-launch-configuration \
		--image-id ami-02e0c24a82677f084 \
		--instance-type f1.4xlarge \
		--key-name <your-key-name> \
		--launch-configuration-name f1-4xlarge \
		--region us-east-1 \
		--user-data <your-user-data>
	```

---

=== "f1.2xlarge"

	```bash
	aws autoscaling create-auto-scaling-group \
		--auto-scaling-group-name f1-2xlarge \
		--availability-zones us-east-1a us-east-1b us-east-1c \
		--launch-configuration-name f1-2xlarge \
		--max-size <your-max-size> \
		--min-size 0 \
		--tags \
			ResourceId=f1-2xlarge,ResourceType=auto-scaling-group,Key=k8s.io/cluster-autoscaler/enabled,Value=true,PropagateAtLaunch=true \
			ResourceId=f1-2xlarge,ResourceType=auto-scaling-group,Key=k8s.io/cluster-autoscaler/InAccel,Value=owned,PropagateAtLaunch=true \
			ResourceId=f1-2xlarge,ResourceType=auto-scaling-group,Key=k8s.io/cluster-autoscaler/node-template/label/node.kubernetes.io/instance-type,Value=f1.2xlarge,PropagateAtLaunch=true \
			ResourceId=f1-2xlarge,ResourceType=auto-scaling-group,Key=k8s.io/cluster-autoscaler/node-template/resources/xilinx/aws-vu9p-f1,Value=1,PropagateAtLaunch=true
	```

=== "f1.4xlarge"

	```bash
	aws autoscaling create-auto-scaling-group \
		--auto-scaling-group-name f1-4xlarge \
		--availability-zones us-east-1a us-east-1b us-east-1c \
		--launch-configuration-name f1-4xlarge \
		--max-size <your-max-size> \
		--min-size 0 \
		--tags \
			ResourceId=f1-4xlarge,ResourceType=auto-scaling-group,Key=k8s.io/cluster-autoscaler/enabled,Value=true,PropagateAtLaunch=true \
			ResourceId=f1-4xlarge,ResourceType=auto-scaling-group,Key=k8s.io/cluster-autoscaler/InAccel,Value=owned,PropagateAtLaunch=true \
			ResourceId=f1-4xlarge,ResourceType=auto-scaling-group,Key=k8s.io/cluster-autoscaler/node-template/label/node.kubernetes.io/instance-type,Value=f1.4xlarge,PropagateAtLaunch=true \
			ResourceId=f1-4xlarge,ResourceType=auto-scaling-group,Key=k8s.io/cluster-autoscaler/node-template/resources/xilinx/aws-vu9p-f1,Value=2,PropagateAtLaunch=true
	```

!!! note

	When creating the launch configuration, in `user-data` flag you should pass
	the base64 encoding of the bootstrap command you would like to run upon
	creating a new EC2 instance, using that launch configuration.

	For example:

	```bash
	echo -n "/opt/inaccel/bootstrap.sh \
		--apiserver-endpoint <your-apiserver-endpoint> \
		--discovery-token-ca-cert-hash <your-discovery-token-ca-cert-hash> \
		--labels inaccel/fpga=enabled \
		--openvpn-config <your-openvpn-config> \
		--openvpn-login <your-openvpn-login> \
		--token <your-token>" | base64
	```

## Evaluation with FPGA workloads

To evaluate our hybrid setup, we configured a K8s cluster consisted of a single
worker node hosting 2 FPGAs of the *Xilinx Alveo family* (one U250 and one
U280).

We then deployed 2 jobs that could be used as part of a larger ML experiment to
tune the parameters of an XGBoost model, requesting 4
*com.inaccel.xgboost.exact* accelerators each. Under the hood,
**InAccel FPGA Operator** had already processed our bitstream repository and had
extracted the information that the specified accelerator was only available for
Xilinx Alveo U250 and AWS Xilinx VU9P FPGA boards. The operator was also aware
of the available FPGA resources on every node, but also the ones that could be
available by bursting to the Cloud.

Submitting the first job, InAccel calculated that the idle Alveo U250 could
fit the accelerator requirements and scheduled that job to run on the on-prem
node.

The second job submission with the same accelerator requirements found the
local worker node with insufficient capacity of *com.inaccel.xgboost.exact*
accelerators, since the Alveo U250 was still occupied. The FPGA operator knowing
that each `xilinx/aws-vu9p-f1` could fit only 2 replicas of the requested
accelerator, translated the request to an amount of 2 AWS Xilinx VU9P FPGAs,
which led the cluster-autoscaler to trigger a scale-up event at the
**f1.4xlarge** node group. The new node automatically joined the cluster and the
job was successfully assigned to it.

But let's see it in action:

![youtube/embed](08UEH7wXjPQ)
