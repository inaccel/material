---
title: Debian-based Installation
---

# Debian-based Installation

*<small id="time">Estimated reading time: X</small>*

This document elaborates on the installation process of InAccel ecosystem for
Debian-based distributions (Debian / Ubuntu).

## Install InAccel

You can install InAccel in different ways, depending on your needs:

* Most users [set up InAccel’s repositories](#install-using-the-repository) and
	install from them, for ease of installation and upgrade tasks. This is the
	recommended approach.

* Some users download the DEB package and
	[install it manually](#install-from-a-package) and manage upgrades
	completely manually. This is useful in situations such as installing InAccel
	on air-gapped systems with no access to the internet.

### Install using the repository

Before you install InAccel for the first time on a new host machine, you need to
set up the InAccel repository. Afterward, you can install and update InAccel
from the repository.

> **SETUP THE REPOSITORY**

!!! note

	In testing and development environments, some users choose to use the
	automated [convenience script](/setup/repo) to setup
	[InAccel repository](https://setup.inaccel.com).

**Step 1**
&nbsp;&nbsp;&nbsp;Update the `apt` package index:

```bash
sudo apt-get update
```

**Step 2**
&nbsp;&nbsp;&nbsp;Install packages to allow `apt` to use a repository over
HTTPS:

```bash
sudo apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
	gnupg-agent \
	software-properties-common
```

**Step 3**
&nbsp;&nbsp;&nbsp;Add InAccel's official GPG key:

```bash
curl -fsSL https://jfrog.inaccel.com/artifactory/generic/packages/gpg | sudo apt-key add -
```

**Step 4**
&nbsp;&nbsp;&nbsp;Use the following command to set up the repository.

```bash
sudo add-apt-repository \
	"deb [arch=amd64] https://jfrog.inaccel.com/artifactory/generic/packages/debian /"
```

> **INSTALL INACCEL**

**Step 1**
&nbsp;&nbsp;&nbsp;Update the `apt` package index.

```bash
sudo apt-get update
```

**Step 2**
&nbsp;&nbsp;&nbsp;Install the *latest version* of InAccel:

```bash
sudo apt-get install -y inaccel
```

**Step 3**
&nbsp;&nbsp;&nbsp;InAccel offers a modified/extended version of
[`runc`](https://github.com/opencontainers/runc) by adding custom pre-start and
post-stop hooks to Coral containers. By providing our custom runtime we enable
implicit loading of drivers and libraries of FPGA vendors to provide a
zero-configuration experience. To make docker aware of those changes you need to
restart its daemon:

```bash
sudo systemctl restart docker
```

**Step 4**
&nbsp;&nbsp;&nbsp;Verify that InAccel is installed correctly.

```bash
inaccel --version
```

### Install from a package

If you cannot use InAccel's repository to install InAccel, you can download the
`.deb` file for your release and install it manually. You need to download a new
file each time you want to upgrade InAccel.

**Step 1**
&nbsp;&nbsp;&nbsp;Go to
[https://jfrog.inaccel.com/artifactory/generic/packages/debian](https://jfrog.inaccel.com/artifactory/generic/packages/debian)
and download the `.deb` file for the InAccel version you want to install.

**Step 2**
&nbsp;&nbsp;&nbsp;Install InAccel, changing the path below to the path where you
downloaded the InAccel package.

```bash
sudo dpkg -i /path/to/package.deb
```

**Step 3**
&nbsp;&nbsp;&nbsp;Restart docker service to enable InAccel's custom `runc` hooks
(as mentioned above):

```bash
sudo systemctl restart docker
```

**Step 4**
&nbsp;&nbsp;&nbsp;Verify that InAccel is installed correctly.

```bash
inaccel --version
```

## Uninstall InAccel

**Step 1**
&nbsp;&nbsp;&nbsp;Uninstall the InAccel package:

```bash
sudo apt-get purge inaccel
```

**Step 2**
&nbsp;&nbsp;&nbsp;Bitstreams, or customized configuration files on your host are
not automatically removed. To delete all bitstreams:

```bash
sudo rm -rf /var/lib/inaccel
```

You must delete any edited configuration files manually.
