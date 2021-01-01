*![time/embed](Estimated reading time: {X})*

In this section, we thoroughly explain how to setup your working environment in
order to run applications powered by InAccel Coral FPGA resource manager.

## Prerequisites

1. **InAccel** (`inaccel`) package (*CLI* + *Container Runtime*) should be
	installed in your system. If you have not already installed InAccel follow
	the instructions provided here: [Debian](/install/debian) |
	[RPM](/install/rpm).

	!!! info

		While InAccel CLI is not a true requirement, we strongly encourage the
		usage of the CLI instead of directly tinkering with any associated
		commands. Setting up Coral without InAcccel CLI and/or InAccel Container
		Runtime is out of the scope of this tutorial.

2. [**Docker**](https://www.docker.com) (`docker`) installation that fully
	supports custom runtimes is required for running Coral which is shipped as a
	container image. If you are planning to use InAccel CLI only for bitstream
	deployment (to any remote repository), then you can skip Docker package
	installation in that machine.

## Verify installation

Before you proceed, ensure that you have successfully installed `inaccel` by
running `inaccel --version`:

```text
$ inaccel --version
inaccel version 1.7.3
```

If your terminal's output is similar or identical to the output above then you
can assume that `inaccel` is properly installed and continue with generating
your free license key.

## Generate a license

In order to launch Coral, you need a valid license key issued by InAccel. This
can be easily achieved through the following steps:

1. Follow [this](https://inaccel.com/license) link and complete the form to
	make an inquiry for a free license. Then, click on button
	*CREATE NEW LICENSE* and you will receive an email by InAccel containing the
	**Community Edition** license key you requested.

2. Retrieve the license key attached to your email and store it in your local
	InAccel settings to use it every time you launch Coral (the *settings* file
	can be found below the `~/.inaccel` directory). Simply issue the following
	command:

	```test
	$ inaccel config license $CORAL_LICENSE_KEY
	```

## Launch InAccel Coral

If you completed the above steps, then you are ready to launch Coral. To make
things clear, Coral is not required to be launched neither at installation nor
at bitstream deployment stage. Its functionality is to manage accelerators,
hence you only need a running instance when your applications are running.

Nevertheless, we suggest to launch Coral now to complete your environment setup.
If you wish, feel free to skip this section and come back before moving to
[Part 4](part4.md).

!!! warning

	If you are launching InAccel Coral for the first time make sure you restart
	docker daemon service by issuing `systemctl docker restart` to enable
	InAccel container runtime (`inaccel-runc`).

1. Start Coral through its associated CLI command.

	```text
	$ inaccel coral start
	Using InAccel Coral:
	latest: Pulling from inaccel/coral
	17282fad1a5e: Pull complete
	bf958f2fb05c: Pull complete
	533d34a577ec: Pull complete
	fb3bea38d5b1: Pull complete
	Digest: sha256:e17b9ded72b20e8719428e1060570bc2cd6cee9196dfb8a952d4f3b2fd43aa32
	Status: Downloaded newer image for inaccel/coral:latest
	docker.io/inaccel/coral:latest
	```

2. Verify Coral is successfully launched by issuing `inaccel coral console`.

	```text
	$ inaccel coral console
	Welcome to
	                          |
	  __|   _      __|  _` |  |
	 (     (   |  |    (   |  | community
	 ___|  ___/  _|    __,_| _| version 2.0.0
	                 by InAccel

	Use exit or Ctrl-D (i.e. EOF) to quit
	coral>
	```

Congratulations, you have successfully completed your InAccel environment setup.
In [Part 3](part3.md), we get our hands dirty by demonstrating how to
package and deploy your accelerators.
