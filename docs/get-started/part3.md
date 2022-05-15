*![time/embed](Estimated reading time: {X})*

This part of the tutorial refers primarily to bitstream developers who are
willing to distribute their FPGA accelerators. By deploying their bitstreams
their implemented accelerators will be available to easily get invoked by any
application through Coral API. If you won't be writing your own bitstreams you
may want to skip this section and move on to [Part 4](part4.md) to learn how to
invoke prebuilt accelerators in your applications.

In this section, we walk you through the process of installing an FPGA bitstream
binary either locally or remotely. We will teach you how to create bitstream
artifacts and how to encrypt and deploy them to a local or a remote repository.

## Bitstream Development (Optional)

In this section, we provide the "Hello World" accelerator example for bitstream
development comprised of a simple vector addition kernel. It receives as input
 two float arrays and adds their respective elements in an output array.

Since the kernel is considered trivial, we will not include the
implementation in this tutorial. However you can download the source code from
our [GitHub repository](https://github.com/inaccel/vadd).

### Build instructions for AWS

1. Launch an
[FPGA Developer AMI](https://aws.amazon.com/marketplace/pp/B06VVYBLZZ) instance.

2. Install the AWS FPGA development toolkit.

	```bash
	git clone https://github.com/aws/aws-fpga.git -b v1.4.22
	source aws-fpga/vitis_setup.sh
	```

3. Clone our demo repository and compile the included FPGA kernels.

	```bash
	git clone https://github.com/inaccel/vadd.git
	v++ vadd/src/vadd.cl --platform ${AWS_PLATFORM} -o vadd.hw.xo
	v++ --link vadd.hw.xo --platform ${AWS_PLATFORM} -o vadd.hw.xclbin
	```

	!!! warning

		FPGA binary compilation is a very slow process. You can still skip this
		part and use our prebuild FPGA binary.

4. Configure AWS CLI with your credentials
 	```bash
	aws configure
	```

5. Create an Amazon FPGA Image (AFI).

	Make sure you specify your **S3 bucket** for the generation of the AFI.

	```bash
	${VITIS_DIR}/tools/create_vitis_afi.sh -xclbin=vadd.hw.xclbin -o=vadd -s3_bucket=<your-aws-bucket> -s3_dcp_key=demo_dcp -s3_logs_key=demo_logs
	```

For more details on the full AWS F1 development lifecycle please refer to this
Vitis
[Quick Start Guide](https://github.com/aws/aws-fpga/tree/master/Vitis).

## Bitstream Packaging

We assume that you have already implemented and compiled a simple bitstream
comprised of the kernel mentioned above. In case you didn't complete
the above [steps](#build-instructions-for-aws) for AWS, you can still download
the prebuilt bitstream binary (`vadd.awsxclbin`) from
[InAccel Store](https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/vector/1/1addition).

At this point, we are ready to move on to the next stage and describe our
generated bistream, creating the specification file (`bitstream.json` or
`bitstream.xml`) that will accompany the bitstream artifact.

### Describe your FPGA binary

As mentioned before, each bitstream artifact contains a descriptive JSON (or
XML) file that defines all the details required to thoroughly describe a
compiled bitstream, like the target platform, the bitstream
kernels, the version and other metadata.

Below we present a verbose, yet simple `bitstream.json` file for our bitstream:

```json
{
	"name": "vadd.awsxclbin",
	"bitstreamId": "vector",
	"version": "1",
	"description": "https://github.com/inaccel/vadd",
	"platform": {
		"vendor": "xilinx",
		"name": "aws-vu9p-f1",
		"version": "shell-v04261818_201920.2",
		"label": [
			"aws"
		]
	},
	"kernels": [
		{
			"name": [
				"vadd"
			],
			"kernelId": "addition",
			"arguments": [
				{
					"type": "float*",
					"name": "a",
					"memory": [
						"0"
					],
					"access": "r"
				},
				{
					"type": "float*",
					"name": "b",
					"memory": [
						"0"
					],
					"access": "r"
				},
				{
					"type": "float*",
					"name": "c",
					"memory": [
						"0"
					],
					"access": "w"
				},
				{
					"type": "int",
					"name": "size"
				}
			]
		}
	]
}
```

As you can notice, we designed bitstream specification file to contain fields
which are self-descriptive in order to reduce the documentation lookup overhead. However,
we will make a brief description for most of the fields with the risk of being
redundant, to make you comfortable on creating your own.

Let's explore the fields we used in our specification file:

* `name` - Bitstream name should match the FPGA binary name
* `bitstreamId` - Prefix to be used by applications to invoke kernels in this bitstream
* `version` - Bitstream version
* `description` - Bitstream description
* `platform`
	* `vendor` - FPGA vendor
	* `name` - FPGA board name
	* `version` - FPGA board version

Now it's time to declare your bitstream kernels. Those are declared inside the
specification file as an array named `kernels`. Each kernel is represented as an
object with the following fields:

* `name` - Actual name list of the kernel functions inside the bitstream
* `kernelId` - Alias name to invoke the specific kernels in your applications
* `arguments` - An array specifying all the kernel arguments
	* `type` - Data type (a star '*' indicates that the argument is an array)
	* `name` - Descriptive argument name
	* `memory` - Memory bank identifier (*only for arrays, not for scalars*)
	* `access` - Access permissions (*only for arrays, not for scalars*)

You are now ready to deploy your first bitstream artifact. For a more detailed
overview of the metadata supported by the bitstream specification file check out
the detailed [Bitstream Reference](/reference/file-formats/bitstream).

## Bitstream Deployment

Once you have created a bitstream artifact by providing a complete bitstream
specification file along with your bitstream binary, you can easily deploy it
through InAccel's CLI. Refer to
[Command Line Interface Reference](/reference/inaccel/cli) for extensive
CLI usage.

!!! warning "The Bitstream binary and its specification file must reside in the same directory."

### Local deployment

Below, we present a typical workflow of deploying your bitstream artifact to
your local repository. When you deploy locally, your bitstreams are stored in
your local machine and become available to Coral running on your machine
immediately. Follow the steps below to get started:

**Step 1:**

Deploy the bitstream artifact to your local repository. The path given as
argument should contain both the *binary* **and** the *specification* file.

```text
$ inaccel bitstream install /local/path/to/bitstream-directory
```

**Step 2:**

Verify that your bitstream is properly installed to your local repository by
issuing the command below.

```text
$ inaccel bitstream list
CHECKSUM        BITSTREAM ID    VERSION    KERNEL IDS    PLATFORM
2c480f9424d4    vector          1          [addition]    aws-vu9p-f1 (xilinx dynamic-shell)
```

If the output of the command matches the one presented above then you have
successfully installed the demo bitstream artifact to your local repository.
After installing the bitstream artifact to your local repository, you can expect
that all kernels of the corresponding bitstream will be easily and securely
accessible from every application requesting accelerators from Coral.

As a bonus, to list the available accelerators of your recently deployed
bitstream along with their
[function prototypes](https://en.wikipedia.org/wiki/Function_prototype), you
simply have to list them using your bitstream's `checksum` value:

```text
$ inaccel bitstream list 2c480f9424d4
PATH            /var/lib/inaccel/repository/.../xilinx/aws-vu9p-f1/dynamic-shell/aws/vector/1/1addition
DESCRIPTION     https://github.com/inaccel/vadd
ACCELERATORS    1 x vector.addition (float* a, float* b, float* c, int size)
```

### Remote deployment (Optional)

Apart from deploying your bitstream to a local repository, you may wish to have
your bitstreams also deployed remotely. Follow the steps below to explore remote
repository capabilities:

**Step 1:**

Start tracking your remote repository through
[`inaccel config`](/reference/inaccel/config) command. For this
tutorial, we will enter some dummy credentials where you can fill in your own
according to your needs.

```bash
inaccel config repository --user inaccel --password rocks --url https://demo.inaccel.com/bistreams demo-repo
```

Notice that `demo-repo` serves as an id for your remote repository.

**Step 2:**

Verify successful tracking of your remote repository by inspecting
`~/.inaccel/settings.xml` file and search for the output presented below:

```xml
<repository>
	<id>demo-repo</id>
	<user>inaccel</user>
	<password>rocks</password>
	<url>https://demo.inaccel.com/bitstreams</url>
</repository>
```

**Step 3:**

Deploy the bitstream artifact to the `demo-repo` repository. Again the path
given as argument should contain your bitstream binary **and** specification
files.

```text
$ inaccel bitstream install --repository demo-repo /remote/path/to/bitstream-directory
```

**Step 4:**

Verify that your bitstream was properly installed to your remote repository by
running:

```text
$ inaccel bitstream list --repository demo-repo
CHECKSUM        BITSTREAM ID    VERSION    KERNEL IDS    PLATFORM
2c480f9424d4    vector          1          [addition]    aws-vu9p-f1 (xilinx dynamic-shell)
```

Assuming you are presented with a similar output you are ready to start
leveraging your accelerators in your applications.

## Bitstream Resolution

InAccel offers a fully-fledged bitstream repository with various bitstreams
available according to whether you are running on Community Edition (CE) or Enterprise
Edition (EE) of InAccel Coral.

For this tutorial we resolve `vadd` bitstream which contains the addition
kernel needed for our application.

```bash
inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/vector/1/1addition
```

Finally, you can explore the available bitstreams on our repository, or host
your own repository and collaborate with your peers.

### Discover available accelerators

As an application developer, you would like to explore the available
accelerators in your bitstream repository. Since you may have not deployed those
bitstreams yourself, simply issue
[`inaccel bitstream list`](/reference/inaccel/bitstream/list) command to
get an overview of the deployed bitstreams in your system along with their
description and available accelerators:

```text
$ inaccel bitstream list
CHECKSUM        BITSTREAM ID    VERSION    KERNEL IDS    PLATFORM
2c480f9424d4    vector          1          [addition]    aws-vu9p-f1 (xilinx dynamic-shell)
```

From the above output, we notice that our repository contains one deployed
bitstream with one accelerator suitable for our goals (i.e *addition*). Our next step is to inspect the bitstream of interest to list
its available accelerators as function prototypes to get a notion of how to
invoke them on our application. We simply issue the following command:

```text
$ inaccel bitstream list 2c480f9424d4
PATH            /var/lib/inaccel/repository/.../xilinx/aws-vu9p-f1/dynamic-shell/aws/vector/1/1addition
DESCRIPTION     https://github.com/inaccel/vadd
ACCELERATORS    1 x vector.addition (float* a, float* b, float* c, int size)
```

That's it! You are now ready to move to
[Part 4: Accelerate your app](part4.md), to invoke your accelerators from your
applications.
