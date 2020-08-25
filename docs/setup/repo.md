---
title: Quick & easy setup
---

# Quick & easy setup

*![time/embed](Estimated reading time: {X})*

In testing and development environments, some users choose to use the automated
[convenience script](#setup-using-the-convenience-script) to setup InAccel
repository.

#### Setup using the convenience script

InAccel provides a convenience script at
[setup.inaccel.com/repo](https://setup.inaccel.com/repo) for setting up InAccel
repository into development environments quickly and non-interactively.
**Using this script is not recommended for production environments**, and you
should understand the potential risks before you use them:

* The script requires `root` or `sudo` privileges to run. Therefore, you should
carefully examine and audit the scripts before running them.

* The script attempts to detect your Linux distribution and configure your
package management system for you. This may lead to an unsupported
configuration, either from InAccel’s point of view or from your own
organization’s guidelines and standards.

* The script installs all dependencies and recommendations of the package
manager without asking for confirmation. This may install a large number of
packages, depending on the current configuration of your host machine.

This example uses the script at
[setup.inaccel.com/repo](https://setup.inaccel.com/repo) to setup the InAccel
repository on Linux.

!!! warning

	Always examine scripts downloaded from the internet before running them
	locally.

```bash
curl -sS https://setup.inaccel.com/repo -o setup-inaccel.sh
sudo sh setup-inaccel.sh
```
