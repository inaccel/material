---
title: Kubernetes on FPGAs
---

# Kubernetes on FPGAs

*<small id="time">Estimated reading time: X</small>*

## Scale-out FPGA-Accelerated Applications

Kubernetes on FPGAs enables enterprises to scale out application deployment to
multi-cloud FPGA clusters seamlessly. It lets you automate the *deployment*,
*maintenance*, *scheduling* and *operation* of multiple FPGA accelerated
application containers across clusters of nodes.

With increasing number of FPGA powered applications and services and the broad
availability of FPGAs in public cloud, there is a need for open-source
Kubernetes to be FPGA-aware. With **Kubernetes on FPGAs**, software developers
and DevOps engineers can build and deploy FPGA-accelerated applications to
heterogeneous FPGA clusters at scale, seamlessly.

[![kubernetes](/img/kubernetes.png){: .center}](https://kubernetes.io)

## Prerequisites

This section details the prerequisites for setting up a Kubernetes node. The
prerequisites include:

* The worker nodes must be provisioned with the Intel/Xilinx drivers.

* Ensure that a supported version of Docker is installed before proceeding to
	install the [InAccel package](/install/linux) (`inaccel`).

## Cluster Management

Kubernetes offers a number of features that cluster admins can leverage in order
to better manage FPGAs:

* [InAccel FPGA plugin](#device-plugin) allows you to expose the FPGA resources
	to the Kubernetes API.

* [Labels](#inaccel-labels) allow you to identify FPGA nodes and attributes to
  steer workloads accordingly.

The following sections describe how these features can be used.

### Device Plugin

Starting in version 1.8, Kubernetes provides a
[device plugin framework](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins)
for vendors to advertise their resources to the kubelet without changing
Kubernetes core code. Instead of writing custom Kubernetes code, vendors can
implement a device plugin that can be deployed manually or as a DaemonSet.

The InAccel FPGA plugin for Kubernetes is a DaemonSet that allows you to
automatically:

* Expose the type and number of FPGAs on each node of your cluster

* Keep track of the health of your FPGAs

* Run FPGA enabled containers in your Kubernetes cluster

If you have setup your nodes as presented in the above sections, you only need
to deploy a DaemonSet. The FPGA information will show up on your node fairly
quickly.

Run the following commands to create the device plugin and watch the FPGA
informations being exposed inside your cluster:

```bash
helm repo add inaccel https://setup.inaccel.com/helm

helm install inaccel inaccel/fpga-operator --set license=...
```

To check the health of your cluster, run the following command on the master
node and make sure your FPGA worker nodes appear.

```bash
kubectl describe nodes
```

### InAccel Labels

InAccel exposes a standard set of labels for steering your workloads to
different nodes.

If you describe the nodes you will also see a number of labels:

```text
Labels:             ...
                    intel/pac_a10=38d782e3b6125343b9342433e348ac4c
                    ...
```

With InAccel Coral in use, you can specify the FPGA platform version in the Pod
spec:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: jupyter-lab
spec:
  containers:
  - name: jupyter-lab
    image: inaccel/jupyter:lab
    ports:
    - containerPort: 8888
    resources:
      limits:
        intel/pac_a10: 2
  nodeSelector:
    intel/pac_a10: 38d782e3b6125343b9342433e348ac4c # pr/interface_id
```

This will ensure that the Pod will be scheduled to a node that has the FPGA
requirements you specified.
