*![time/embed](Estimated reading time: {X})*

Through this tutorial, we will guide you step-by-step on how to leverage InAccel
toolset to ship and run your accelerator workloads in a simple, straightforward
and efficient manner. This tutorial summarizes lots of concepts which are
extensively documented elsewhere, so feel free to follow the links provided to
extract the most value out of our products.

This *Getting Started* tutorial consists of the following **four** parts:

1. Orientation
2. [Setup the working environment](part2.md)
3. [Deploy your bitstreams](part3.md)
4. [Accelerate your app](part4.md)

Prior to the hands-on tutorial describing the exact steps on how to get started,
we consider valuable to provide some motivation behind the necessity of an
intelligent [Bitstream Repository](#bitstream-repository-concepts) combined with
[Coral FPGA Resource Manager](#coral-fpga-resource-manager-concepts) as well as
some high-level details of their functionality.

## Motivation

The end of Moore's Law signified the shift from general purpose computing to
tailor-made, specialized architectures and hardware. As a matter of fact, all
major cloud providers have incorporated FPGAs into their cloud services.

While both CPUs and GPUs have developed a wide, well-established surrounding
software ecosystem around their technologies, unfortunately FPGAs are unable to
compete with the aforementioned hardware on the axis of software tools
available. Currently, an FPGA application developer needs to be aware of
low-level details of the underlying hardware. New layers of granularity need to
be introduced to delegate the hardware details to accelerator designers while
providing a typical software API to application developers.

At InAccel, we believe that wide adoption of hardware technologies requires
significant levels of granularity and abstraction, and we are working towards
that direction to mitigate the steep learning curve of developing, deploying and
running accelerators.

## Bitstream Repository Concepts

Before we proceed with this tutorial, let's take a step back and elaborate on
what a repository of bitstream artifacts represents and why do we need it in the
first place.

### What is a bitstream artifact?

A *bitstream artifact* is a set of files capable of fully describing an FPGA
design. InAccel introduces the notion of a specification file, where a bitstream
developer can explicitly declare all the properties pertaining to the FPGA
binary she is willing to deploy. Therefore, a compiled bitstream along with its
specification file (metadata) comprise the bitstream artifact.

### Why do we need a bitstream artifact?

By accompanying each bitstream with a descriptive file that contains various
metadata we are generating a high-level representation of the bitstream. Through
this representation we achieve to decouple the background knowledge required by
the accelerator designer and the application developers. In particular, the
bitstream developer is responsible to create the specification file with all the
required architecture and platform details. In contrast, the application
developer needs only to be aware of the bitstream/kernel identifiers as well as
the argument list of each accelerator to invoke them properly in her
application.

Advantages of representing bitstreams as artifacts:

* Encapsulate every bit of information describing an FPGA design within a
single file.
* Enable repository management, versioning capabilities and accelerator
performance tracking (see below).
* Conceal low-level hardware details from the application developer allowing a
universal, vendor agnostic (Intel / Xilinx) packaging format.
* Each artifact contains useful metadata for a wide range of utilities and
tools.
* Representing self-contained entities as artifacts is a valuable software
paradigm.

### What is a bitstream repository?

A *bitstream repository* is a central place in which an aggregation of the
aforementioned artifacts is kept and maintained in an organized way. Protection
(encryption/decryption) capabilities enable secure storage of your FPGA binaries
to local and remote repositories with fine-grained access control policies.
Moreover, the supplied metadata in each artifact simplify the process of
maintaining snapshot/release artifacts, allowing continuous integration and
delivery of your accelerated solutions through tailor made development
pipelines. Now the evaluation and benchmarking of accelerators of different
target vendors or versions is rendered trivial.

Finally, InAccel offers an end-to-end JFrog Bitstream repository solution to
fully manage the deployment lifecycle of your FPGA binaries. More information
can be found [here](https://inaccel.com/bitstream-repository).

### What is bitstream deployment?

*Bitstream deployment* is the process of storing your bitstream artifact into a
bitstream repository. Once your bitstream is deployed, you can expect its
kernels to be readily available from every application requesting accelerators
from Coral. Additionally, through our [CLI](/reference/inaccel/cli)
you can list its available accelerators along with many other useful
information.

## Coral FPGA Resource Manager Concepts

Now that we addressed some major shortcomings of the specialized hardware
industry and explained the main concepts of accelerator *deployment* that
InAccel introduces, we continue by presenting InAccel's approach on FPGA
application *development* deficiencies.

InAccel Coral is a **scalable**, **reliable** and **fault-tolerant** distributed
acceleration system responsible for *monitoring*, *virtualizing* and
*orchestrating* clusters of FPGAs. Coral also introduces high-level abstractions
by exposing FPGAs as a single pool of accelerators to any application developer
that she can easily invoke through simple API calls. Finally, Coral runs as a
microservice and is able to run on top of other state-of-the-art resource
managers like Hadoop YARN and Kubernetes.

![picture](/img/architecture.png){: .center}

To summarize, Coral has the following primary goals:

* Serve as a universal orchestrator for FPGA resources and acceleration
requests.
* Improve scalability and maximize performance of deployed accelerators,
ensuring the secure sharing of the available resources.
* Abstract away cumbersome parallel programming languages (like OpenCL) without
compromising flexibility.
* Encompass bitstream management and protection capabilities.

Since we briefly covered the necessity of a universal FPGA resource manager as
well as InAccel's approach on the issue, continue to [Part 2](part2.md) to setup
your environment. You can find more information on Coral integrations and
features [here](https://inaccel.com/coral-fpga-resource-manager).
