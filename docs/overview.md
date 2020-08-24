*<small id="time">Estimated reading time: X</small>*

InAccel is an open platform for developing, shipping, and running accelerated
applications. InAccel enables you to separate your applications from your
accelerators so you can deliver software quickly. By taking advantage of
InAccel's methodologies for shipping, testing, and deploying accelerators
quickly, you can significantly reduce the delay between creating an FPGA design
and running it in production.

The following figure summarizes InAccel's major **components**:

![picture](/img/inaccel.png){: .center}

---

### Coral FPGA Resource Manager

*Coral* is a **fast** and **general-purpose** FPGA resource manager. It provides
high-level APIs in Java, Scala, Python and C++, and a unified engine that
supports every multi-FPGA platform. Coral is also shipped with higher-level
integrations including **Apache Arrow** for zero-copy, lightning-fast data
transfers and **Apache Spark** for seamless maching learning acceleration.

*Coral* runs on any UNIX-like system (e.g. Linux). It’s easy to deploy on any
machine, since it lives inside a containerized environment — all you need is to
have the vendor-specific FPGA runtime installed on your system and run it with
the container pointing to that installation.

All *Coral* versions are packaged as docker images hosted in
[InAccel Docker Hub](https://hub.docker.com/u/inaccel).

---

### Bitstream Repository

A *bitstream repository* is a central place comprised of bitstream artifacts
which are kept and maintained in an organized way. The concept of a
*bitstream repository* facilitates the development and deployment of bitstreams
and eliminates cumbersome procedures of manually tracking them.

For a detailed overview you can check our
[Tutorial](/tutorial/bitstreams/#bitstream-deployment-concepts) on usage of
bitstream repository capabilities.

---

### InAccel CLI

*InAccel* is a **lightweight** and **easy-to-use** Command Line Interface (CLI),
which bundles the aforementioned utilities and allows users to operate them from
a single tool through straightforward commands.

We are currently offering installation of `inaccel` through packages or
repositories for [Debian-based](/install/debian) and [RHEL-based](/install/rpm)
distributions.

---

### Getting Started

After installing `inaccel`, you can learn the basics with our
[Getting Started](/tutorial/orientation) guide.
