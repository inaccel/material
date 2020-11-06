*![time/embed](Estimated reading time: {X})*

## Welcome to InAccel CLI

InAccel CLI is a compact and smart client that provides a simple interface that
automates access to InAccel products simplifying your automation scripts and
making them more readable and easier to maintain. InAccel CLI works with InAccel
**Coral** *container* as well as any InAccel **Bitstream** *repository*
(including [InAccel Store](https://store.inaccel.com)) making your scripts more
efficient and reliable in several ways.

The CLI is divided in **two** main categories:

* *bitstream* commands...<br>...to efficiently manage your Bitstream
	repositories.

* *coral* commands...<br>...to efficiently manage your Coral container.

## inaccel

To list available commands, either run [`inaccel`](index.md) with no
parameters or execute:

```text
$ inaccel help
NAME:
   inaccel - Command Line Interface (CLI) tool

USAGE:
   inaccel [global options] command [command options] [arguments...]

VERSION:
   1.8.14

COMMANDS:
   config, c  Configures bitstream repositories and coral container settings
   help, h    Shows a list of commands or help for one command

   bitstream:
     parse    Parse FPGA binary build-metadata
     install  Install a bitstream to the local or a remote repository, from a local or a remote source
     list     List all the bitstreams or detailed information for specific bitstreams in the local or a remote repository
     remove   Remove one or more bitstreams from the local or a remote repository

   coral:
     console  Get a console inside the InAccel Coral container
     logs     Fetch the logs of the InAccel Coral container
     start    Start the InAccel Coral container
     stop     Stop the InAccel Coral container

   docker:
     prune   Clean all unused data (InAccel containers, images and network)
     status  Print status information about the InAccel containers

   monitor:
     start  Start the InAccel Monitor container
     stop   Stop the InAccel Monitor container

GLOBAL OPTIONS:
   --debug, -d    enable debug output
   --quiet, -q    run in quiet mode
   --help, -h     show help
   --version, -v  print the version
```

### System Requirements

InAccel CLI runs on any modern OS that fully supports the
[Go programming language](https://golang.org).

All *coral* sub-commands operate on
[InAccel Coral](https://hub.docker.com/r/inaccel/coral) container image, using
InAccel **Container Runtime** (`inaccel-runc`). The only prerequisite for
running commands in this category is a [Docker](https://docker.com) version that
supports custom container runtimes (`--runtime` flag).

#### Notice

Depending on your Docker system configuration, you may be required to preface
each [`inaccel coral`](coral/index.md) command with `sudo`. To avoid having to
use `sudo` with the [`inaccel coral`](coral/index.md) command, your system
administrator can create a Unix group called `docker` and add users to it.

For more information about installing Docker or `sudo` configuration, refer to
the Docker [installation](https://docs.docker.com/install) instructions for your
operating system.

### Environment Variables

InAccel CLI makes use of the following environment variables:

| Name                   | Default                               | Description                                    |
| :--------------------- | :-----------------------------------: | :--------------------------------------------- |
| ` INACCEL_CONFIG_DIR ` | ` ~/.inaccel `                        | Defines the InAccel CLI config directory       |
| ` INACCEL_TEMP_DIR `   | The operating system's temp directory | Defines the temp directory used by InAccel CLI |

### Settings file

By default, the InAccel command line stores its configuration settings file in a
directory called `.inaccel` within your `$HOME` directory. However, you can
specify a different location via the `INACCEL_CONFIG_DIR` environment variable.
For example:

```bash
INACCEL_CONFIG_DIR="~/testconfigs" inaccel coral start -t latest
```

Instructs InAccel to use the settings file in your `~/testconfigs` directory
when running the [`inaccel coral start`](coral/start.md) command.

You can modify the `settings.json` or `settings.xml` file to configure bitstream
repositories and coral container settings or you can simply use the
[`inaccel config`](config/index.md) command.

The settings file stores a JSON or an XML encoding of several properties:

> **license**: Sets the InAccel Coral license

> **repositories**: Defines the details of remote repositories

Following is a sample settings file:

=== "JSON"

	```json
	{
		"license": "",
		"repositories": [
			{
				"id": "inaccel-store",
				"user": "inaccel",
				"password": "",
				"url": "https://store.inaccel.com/artifactory/bitstreams"
			}
		]
	}
	```

=== "XML"

	```xml
	<settings>
		<license></license>
		<repositories>
			<repository>
				<id>inaccel-store</id>
				<user>inaccel</user>
				<password></password>
				<url>https://store.inaccel.com/artifactory/bitstreams</url>
			</repository>
		</repositories>
	</settings>
	```
