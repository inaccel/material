*<small id="time">Estimated reading time: X</small>*

This part of the tutorial refers primarily to bitstream developers who are
willing to distribute their FPGA accelerators. By deploying their bitstreams
their implemented accelerators will be available to easily get invoked by any
application through Coral API. If you won't be writing your own bitstreams you
may want to skip this section and move on to [Part 4](app.md) to learn how to
invoke prebuilt accelerators in your applications.

In this section, we walk you through the process of installing an FPGA bitstream
binary either locally or remotely. We will teach you how to create bitstream
artifacts and how to encrypt and deploy them to a local or a remote repository.

## Bitstream Development (Optional)

In this section, we provide the "Hello World" accelerator example for bitstream
development comprised of a simple vector addition and subtraction. To elucidate,
the first kernel receives as input two float arrays and adds their respective
elements in an output array. The second kernel performs a similar operation
where instead of addition, an element-wise subtraction operation is performed.

Since those kernels are considered trivial, we will not include the
implementation in this tutorial. However you can download the source code from
our [GitHub repository](https://github.com/inaccel/aws-demo).

### Build instructions for AWS

1. Launch an
[FPGA Developer AMI](https://aws.amazon.com/marketplace/pp/B06VVYBLZZ) instance.

2. Install the AWS FPGA development toolkit.

	```bash
	git clone https://github.com/aws/aws-fpga.git
	source aws-fpga/sdaccel_setup.sh
	```

3. Clone our demo repository and compile the included FPGA kernels.

	```bash
	git clone https://github.com/inaccel/aws-demo.git
	make -C aws-demo/device binary/demo.xclbin
	```

	!!! warning

		FPGA binary compilation is a very slow process. You can still skip this
		part and use our prebuild FPGA binary.

3. Create an Amazon FPGA Image (AFI).

	```bash
	${SDACCEL_DIR}/tools/create_sdaccel_afi.sh -xclbin=aws-demo/device/binary/demo.xclbin -o=aws-demo/device/binary/demo -s3_bucket=inaccel -s3_dcp_key=demo_dcp -s3_logs_key=demo_logs
	```

For more details on the full AWS F1 development lifecycle please refer to this
SDAccel
[Quick Start Guide](https://github.com/aws/aws-fpga/tree/master/SDAccel).

## Bitstream Packaging

We assume that you have already implemented and compiled a simple bitstream
comprised of the two kernels mentioned above. In case you didn't complete
the above [steps](#build-instructions-for-aws) for AWS, you can still download
the prebuilt bitstream binary (`demo.awsxclbin`) from
[InAccel Store](https://store.inaccel.com/artifactory/webapp/#/artifacts/browse/tree/General/bitstreams/xilinx/aws-vu9p-f1-04261818/dynamic_5.0/com/inaccel/math/vector/0.1/2addition_2subtraction).

At this point, we are ready to move on to the next stage and describe our
generated bistream, creating the specification file (`bitstream.json` or
`bitstream.xml`) that will accompany the bitstream artifact.

### Describe your FPGA binary

As mentioned before, each bitstream artifact contains a descriptive JSON (or
XML) file that defines all the details required to thoroughly describe the
compiled bitstream. These information include target platform, bitstream
kernels, version and other metadata.

Below we present a verbose, yet simple `bitstream.json` file for our bitstream:

```json
{
	"name": "demo.awsxclbin",
	"bitstreamId": "com.inaccel.math.vector",
	"version": "0.1",
	"description": "vector operations",
	"platform": {
		"vendor": "xilinx",
		"name": "aws-vu9p-f1-04261818",
		"version": "dynamic_5.0"
	},
	"kernels": [
		{
			"name": [
				"vsub_kernel:{vsub_kernel_1}"
			],
			"kernelId": "subtraction",
			"arguments": [
				{
					"type": "float16*",
					"name": "input1",
					"memory": [
						"2"
					],
					"access": "r"
				},
				{
					"type": "float16*",
					"name": "input2",
					"memory": [
						"2"
					],
					"access": "r"
				},
				{
					"type": "float16*",
					"name": "output",
					"memory": [
						"2"
					],
					"access": "w"
				},
				{
					"type": "int",
					"name": "size"
				}
			]
		},
		{
			"name": [
				"vsub_kernel:{vsub_kernel_2}"
			],
			"kernelId": "subtraction",
			"arguments": [
				{
					"type": "float16*",
					"name": "input1",
					"memory": [
						"3"
					],
					"access": "r"
				},
				{
					"type": "float16*",
					"name": "input2",
					"memory": [
						"3"
					],
					"access": "r"
				},
				{
					"type": "float16*",
					"name": "output",
					"memory": [
						"3"
					],
					"access": "w"
				},
				{
					"type": "int",
					"name": "size"
				}
			]
		},
		{
			"name": [
				"vadd_kernel:{vadd_kernel_1}"
			],
			"kernelId": "addition",
			"arguments": [
				{
					"type": "float16*",
					"name": "input1",
					"memory": [
						"0"
					],
					"access": "r"
				},
				{
					"type": "float16*",
					"name": "input2",
					"memory": [
						"0"
					],
					"access": "r"
				},
				{
					"type": "float16*",
					"name": "output",
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
		},
		{
			"name": [
				"vadd_kernel:{vadd_kernel_2}"
			],
			"kernelId": "addition",
			"arguments": [
				{
					"type": "float16*",
					"name": "input1",
					"memory": [
						"1"
					],
					"access": "r"
				},
				{
					"type": "float16*",
					"name": "input2",
					"memory": [
						"1"
					],
					"access": "r"
				},
				{
					"type": "float16*",
					"name": "output",
					"memory": [
						"1"
					],
					"access": "r"
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
which are self-descriptive to reduce the documentation lookup overhead. However,
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
[Command Line Interface Reference](/reference/inaccel/overview) for extensive
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
CHECKSUM        BITSTREAM ID               VERSION    KERNEL IDS                PLATFORM
25f737db86a3    com.inaccel.math.vector    0.1        [addition subtraction]    aws-vu9p-f1-04261818 (xilinx dynamic_5.0)
```

If the output of the command matches the one presented above then you have
successfully installed the demo bitstream artifact to your local repository.
After installing the bitstream artifact to your local repository, you can expect
that all kernels of the corresponding bitstream will be easily and securely
accesible from every application requesting accelerators from Coral.

As a bonus, to list the available accelerators of your recently deployed
bitstream along with their
[function prototypes](https://en.wikipedia.org/wiki/Function_prototype), you
simply have to list them using your bitstream's `checksum` value:

```text
$ inaccel bitstream list 25f737db86a3
PATH            /var/lib/inaccel/repository/.../xilinx/aws-vu9p-f1-04261818/dynamic_5.0/com/inaccel/math/vector/0.1/2addition_2subtraction
DESCRIPTION     vector operations
ACCELERATORS    2 x com.inaccel.math.vector.addition (float16* input1, float16* input2, float16* output, int size)
                2 x com.inaccel.math.vector.subtraction (float16* input1, float16* input2, float16* output, int size)
```

### Remote deployment (Optional)

Apart from deploying your bitstream to a local repository, you may wish to have
your bitstreams also deployed remotely. Follow the steps below to explore remote
repository capabilities:

**Step 1:**

Start tracking your remote repository through
[`inaccel config`](/reference/inaccel/config/command) command. For this
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
CHECKSUM        BITSTREAM ID               VERSION    KERNEL IDS                PLATFORM
25f737db86a3    com.inaccel.math.vector    0.1        [addition subtraction]    aws-vu9p-f1-04261818 (xilinx dynamic_5.0)
```

Assuming you are presented with a similar output you are ready to start
leveraging your accelerators in your applications.

## Bitstream Resolution

InAccel offers a fully-fledged bitstream repository with various bitstreams
available according to whether you own a Community Edition (CE) or an Enterprise
Edition (EE) license.

For this tutorial we need to resolve the `demo` bitstream that contains the
kernels we will need for our application.

```bash
inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1-04261818/dynamic_5.0/com/inaccel/math/vector/0.1/2addition_2subtraction
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
CHECKSUM        BITSTREAM ID               VERSION    KERNEL IDS                PLATFORM
25f737db86a3    com.inaccel.math.vector    0.1        [addition subtraction]    aws-vu9p-f1-04261818 (xilinx dynamic_5.0)
```

From the above output, we notice that our repository contains one deployed
bitstream with two accelerators suitable for our goals (i.e *addition* and
*subtraction*). Our next step is to inspect the bitstream of interest to list
its available accelerators as function prototypes to get a notion of how to
invoke them on our application. We simply issue the following command:

```text
$ inaccel bitstream list 25f737db86a3
PATH            /var/lib/inaccel/repository/.../xilinx/aws-vu9p-f1-04261818/dynamic_5.0/com/inaccel/math/vector/0.1/2addition_2subtraction
DESCRIPTION     vector operations
ACCELERATORS    2 x com.inaccel.math.vector.addition (float16* input1, float16* input2, float16* output, int size)
                2 x com.inaccel.math.vector.subtraction (float16* input1, float16* input2, float16* output, int size)
```

That's it! You are now ready to move to
[Part 4: Accelerate your app](app.md), to invoke your accelerators from your
applications.
