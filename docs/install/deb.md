# Install InAccel on Debian / Ubuntu

*![time/embed](Estimated reading time: {X})*

To get started with InAccel on Debian / Ubuntu follow the installation steps.

## Installation methods

You can install InAccel in different ways, depending on your needs:

* Most users [set up InAccel’s repository](#install-using-the-repository) and
install from it, for ease of installation and upgrade tasks. This is the
recommended approach.

* Some users download the DEB packages and
[install them manually](#install-from-packages) and manage upgrades completely
manually. This is useful in situations such as installing InAccel on air-gapped
systems with no access to the internet.

* In testing and development environments, some users choose to use the
automated [convenience script](#install-using-the-convenience-script) to install
InAccel.

### Install using the repository

Before you install InAccel for the first time on a new host machine, you need to
set up the InAccel repository. Afterward, you can install and update InAccel
from the repository.

#### Set up the repository

1. Update the `apt` package index and install packages to allow `apt` to use a
repository over HTTPS:

	```sh
	sudo apt-get update

	sudo apt-get install -y \
	  ca-certificates \
	  curl \
	  gnupg
	```

2. Add InAccel's official GPG key:

	```sh
	sudo mkdir -m 0755 -p /etc/apt/keyrings
	curl -fsSL https://setup.inaccel.com/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/inaccel.gpg
	```

3. Use the following command to set up the repository.

	```sh
	echo \
	"deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/inaccel.gpg] https://dl.cloudsmith.io/public/inaccel/stable/deb/$(. /etc/os-release && echo "$ID") \
	"$(. /etc/os-release && echo "$VERSION_CODENAME")" main" | \
	sudo tee /etc/apt/sources.list.d/inaccel.list > /dev/null
	```

#### Install InAccel

1. Update the `apt` package index.

	```sh
	sudo apt-get update
	```

	!!! info "Receiving a GPG error when running `apt-get` update?"

		Your default [umask](https://en.wikipedia.org/wiki/Umask) may be
		incorrectly configured, preventing detection of the repository public
		key file. Try granting read permission for the InAccel public key file
		before updating the package index:

		```sh
		sudo chmod a+r /etc/apt/keyrings/inaccel.gpg
		sudo apt-get update
		```

2. Install the *latest version* of InAccel, InAccel CLI, InAccel Docker, and
InAccel FPGA:

	```sh
	sudo apt-get install inaccel inaccel-cli inaccel-docker inaccel-fpga
	```

	This command installs InAccel, but it doesn’t start InAccel.

2. Start InAccel and configure InAccel to start on boot.

	```sh
	sudo systemctl enable --now inaccel
	```

### Install from a package

If you cannot use InAccel's repository to install InAccel, you can download the
`.deb` files for your release and install it manually. You need to download a
new files each time you want to upgrade InAccel.

1. Go to
[https://cloudsmith.io/~inaccel/repos/stable/groups/?q=format:deb](https://cloudsmith.io/~inaccel/repos/stable/groups/?q=format:deb).

2. Download the following `deb` files for the InAccel, InAccel CLI, InAccel
Docker, and InAccel FPGA packages:

	* `inaccel_<version>_amd64.deb`

	* `inaccel-cli_<version>_amd64.deb`

	* `inaccel-docker_<version>_amd64.deb`

	* `inaccel-fpga_<version>_amd64.deb`

3. Install the `.deb` packages. Update the path in the following example to
where you downloaded the InAccel packages.

	```sh
	sudo apt-get install /path/to/package.deb
	```

	The InAccel daemon doesn't start automatically.

4. Start InAccel and configure InAccel to start on boot.

	```sh
	sudo systemctl enable --now inaccel
	```

#### Upgrade InAccel

To upgrade InAccel, download the newer package files and repeat the
[installation procedure](#install-from-packages), pointing to the new files.

### Install using the convenience script

InAccel provides a convenience script at
[https://setup.inaccel.com/repository](https://setup.inaccel.com/repository) to
install InAccel into development environments non-interactively. The convenience
script isn’t recommended for production environments, but it’s useful for
creating a provisioning script tailored to your needs. Also refer to the
[install using the repository](#install-using-the-repository) steps to learn
about installation steps to install using the package repository.

Always examine scripts downloaded from the internet before running them locally.
Before installing, make yourself familiar with potential risks and limitations
of the convenience script:

* The script requires `root` or `sudo` privileges to run.

* The script attempts to detect your Linux distribution and version and
configure your package management system for you.

* The script doesn’t allow you to customize most installation parameters.

* The script installs dependencies and recommendations without asking for
confirmation. This may install a large number of packages, depending on the
current configuration of your host machine.

This example downloads the script from
[https://setup.inaccel.com/repository](https://setup.inaccel.com/repository) and
runs it to install the latest stable release of InAccel on Linux:

```sh
curl -fsSL https://setup.inaccel.com/repository -o setup-inaccel.sh
sudo sh setup-inaccel.sh install
```

#### Upgrade InAccel after using the convenience script

If you installed InAccel using the convenience script, you should upgrade
InAccel using your package manager directly. There’s no advantage to re-running
the convenience script. Re-running it can cause issues if it attempts to
re-install repositories which already exist on the host machine.

## Uninstall InAccel

1. Uninstall the InAccel, InAccel CLI, InAccel Docker, and InAccel FPGA
packages:

	```sh
	sudo apt-get purge inaccel inaccel-cli inaccel-docker inaccel-fpga
	```

2. Bitstreams, or customized configuration files on your host are not
automatically removed. To delete all bitstreams:

	```sh
	sudo rm -rf /var/lib/inaccel
	```

You must delete any edited configuration files manually.

## Next steps

* Review the topics in [Develop with InAccel](/develop) to learn how to build
new applications using InAccel.
