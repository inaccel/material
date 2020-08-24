*<small id="time">Estimated reading time: X</small>*

The **bitstream kernels** are the core component of every FPGA accelerated
application. In order to allow automation pipelines, InAccel introduces the
**bitstream** specification that can be used to automatically deploy FPGA
binaries on any cluster of FPGAs. It is the single source of information about
user's repository of accelerators, that enables Coral to explicitly manage all
the supported multi-FPGA platforms through a uniform interface, transforming any
set of FPGA bitstreams/kernels to a single pool of hardware accelerators.

## What is a bitstream repository?

A bitstream repository manages your end-to-end bitstream lifecycle while
providing consistency to your CI/CD workflow. A bitstream repository is both a
source for bitstream artifacts needed by an accelerated application, and a
target to deploy bitstreams generated in the build process. The bitstream
repository is crucial for the software development process. Multiple developers
from different sites use artifacts and 3rd party components from different
sources, causing testing problems to arise and thus slowing down your release
process. Add to all the above, the complexity of handling dozens of different
types of technologies and your software development process will be brought to a
halt.

InAccel’s universal bitstream packaging format supports the requirements of both
FPGA vendors (Intel, Xilinx) and is also integrated with all major repository
managers currently available (including
[JFrog Artifactory](https://jfrog.com/artifactory) and
[Sonatype Nexus](https://sonatype.com/nexus-repository-sonatype)).

## What is a bitstream artifact?

### bitstream

| Field name    | Type      | Required/Optional | Description                                                                  |
| :-----------: | :-------: | :---------------: | :--------------------------------------------------------------------------- |
| *name*        | string    | required          | The actual name of the FPGA bitstream.                                       |
| *bitstreamId* | string    | required          | The desired package name (recommended layout is `[organisation].[package]`). |
| *version*     | string    | required          | The artifact version.                                                        |
| *description* | string    | optional          | Short description that may include hardware design notes.                    |
| *platform*    | *platform | required          | Defines platform specific information.                                       |
| *kernels*     | []kernel  | required          | Describes the available kernels (inside the bitstream) and their properties. |

> Sample:

=== "JSON"

	```json
	{
		"name": "bitstream.bin",
		"bitstreamId": "com.inaccel.math.vector",
		"version": "0.1",
		"description": "vector operations",
		"platform": {
			...
		},
		"kernels": [
			...
		]
	}
	```

=== "XML"

	```xml
	<bitstream>
		<name>bitstream.bin</name>
		<bitstreamId>com.inaccel.math.vector</name>
		<version>0.1</version>
		<description>vector operations</description>
		<platform>
			...
		</platform>
		<kernels>
			...
		</kernels>
	</bitstream>
	```

### platform

| Field name | Type   | Required/Optional | Description                                      |
| :--------: | :----: | :---------------: | :----------------------------------------------- |
| *vendor*   | string | required          | The FPGA vendor (`intel` or `xilinx`).           |
| *name*     | string | required          | The FPGA board identifier.                       |
| *version*  | string | required          | The DSA (for Xilinx) or SDK (for Intel) version. |

> Sample:

=== "JSON"

	```json
		"platform": {
			"vendor": "intel / xilinx",
			"name": "cool-fpga-platform-name",
			"version": "cool-fpga-platform-version"
		},
	```

=== "XML"

	```xml
		<platform>
			<vendor>intel / xilinx</vendor>
			<name>cool-fpga-platform-name</name>
			<version>cool-fpga-platform-version</version>
		</platform>
	```

### kernel

| Field name  | Type       | Required/Optional | Description                               |
| :---------: | :--------: | :---------------: | :---------------------------------------- |
| *name*      | []string   | required          | The actual name list of the FPGA kernels. |
| *kernelId*  | string     | required          | The desired accelerator name.             |
| *arguments* | []argument | required          | The list of the accelerator arguments.    |

> Sample:

=== "JSON"

	```json
		"kernels": [
			...
			{
				"name": ["vadd_kernel_1"],
				"kernelId": "addition",
				"arguments": [
					...
				]
			},
			{
				"name": ["vsub_kernel_0"],
				"kernelId": "subtraction",
				"arguments": [
					...
				]
			},
			...
		]
	```

=== "XML"

	```xml
		<kernels>
			...
			<kernel>
				<name>vadd_kernel_1</name>
				<kernelId>addition</kernelId>
				<arguments>
					...
				</arguments>
			</kernel>
			<kernel>
				<name>vsub_kernel_0</name>
				<kernelId>subtraction</kernelId>
				<arguments>
					...
				</arguments>
			</kernel>
			...
		</kernels>
	```

### argument

| Field name | Type     | Required/Optional | Description                                         |
| :--------: | :------: | :---------------: | :-------------------------------------------------- |
| *index*    | []string | optional          | Used to modify the default argument sequence.       |
| *type*     | string   | required          | The argument type.                                  |
| *name*     | string   | optional          | The argument name.                                  |
| *size*     | string   | optional          | Used to define the size of unknown argument types.  |
| *memory*   | []string | optional          | Defines the memory bank connections. (default: `0`) |
| *access*   | string   | optional          | Defines the access modifier. (default: `rw`)        |

> Sample:

=== "JSON"

	```json
				"arguments": [
					{
						"type": "float*",
						"name": "input1",
						"memory": ["0"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "input2",
						"memory": ["0"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "output",
						"memory": ["0"],
						"access": "w"
					},
					{
						"type": "int",
						"name": "size"
					}
				]
	```

=== "XML"

	```xml
				<arguments>
					<argument>
						<type>float*</type>
						<name>input1</name>
						<memory>0</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>input2</name>
						<memory>0</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>output</name>
						<memory>0</memory>
						<access>w</access>
					</argument>
					<argument>
						<type>int</type>
						<name>size</name>
					</argument>
				</arguments>
	```

## Full Sample

Let's suppose that we have built a new bitstream binary (with name
`bitstream.bin`) for our `cool-fpga-platform`. Our bitstream contains four
kernels and we want to describe it in a specification file in order to deploy it
as a package.

=== "JSON"

	```json
	{
		"name": "bitstream.bin",
		"bitstreamId": "com.inaccel.math.vector",
		"version": "0.1",
		"description": "vector operations",
		"platform": {
			"vendor": "intel / xilinx",
			"name": "cool-fpga-fpga-platform-name",
			"version": "cool-fpga-platform-version"
		},
		"kernels": [
			{
				"name": ["vadd_kernel_0"],
				"kernelId": "addition",
				"arguments": [
					{
						"type": "float*",
						"name": "input1",
						"memory": ["0"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "input2",
						"memory": ["0"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "output",
						"memory": ["0"],
						"access": "w"
					},
					{
						"type": "int",
						"name": "size"
					}
				]
			},
			{
				"name": ["vadd_kernel_1"],
				"kernelId": "addition",
				"arguments": [
					{
						"type": "float*",
						"name": "input1",
						"memory": ["1"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "input2",
						"memory": ["1"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "output",
						"memory": ["1"],
						"access": "w"
					},
					{
						"type": "int",
						"name": "size"
					}
				]
			},
			{
				"name": ["vsub_kernel_0"],
				"kernelId": "subtraction",
				"arguments": [
					{
						"type": "float*",
						"name": "input1",
						"memory": ["2"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "input2",
						"memory": ["2"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "output",
						"memory": ["2"],
						"access": "w"
					},
					{
						"type": "int",
						"name": "size"
					}
				]
			},
			{
				"name": ["vsub_kernel_1"],
				"kernelId": "subtraction",
				"arguments": [
					{
						"type": "float*",
						"name": "input1",
						"memory": ["3"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "input2",
						"memory": ["3"],
						"access": "r"
					},
					{
						"type": "float*",
						"name": "output",
						"memory": ["3"],
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

=== "XML"

	```xml
	<bitstream>
		<name>bitstream.bin</name>
		<bitstreamId>com.inaccel.math.vector</bitstreamId>
		<version>0.1</version>
		<description>vector operations</description>
		<platform>
			<vendor>intel / xilinx</vendor>
			<name>cool-fpga-fpga-platform-name</name>
			<version>cool-fpga-platform-version</version>
		</platform>
		<kernels>
			<kernel>
				<name>vadd_kernel_0</name>
				<kernelId>addition</kernelId>
				<arguments>
					<argument>
						<type>float*</type>
						<name>input1</name>
						<memory>0</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>input2</name>
						<memory>0</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>output</name>
						<memory>0</memory>
						<access>w</access>
					</argument>
					<argument>
						<type>int</type>
						<name>size</name>
					</argument>
				</arguments>
			</kernel>
			<kernel>
				<name>vadd_kernel_1</name>
				<kernelId>addition</kernelId>
				<arguments>
					<argument>
						<type>float*</type>
						<name>input1</name>
						<memory>1</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>input2</name>
						<memory>1</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>output</name>
						<memory>1</memory>
						<access>w</access>
					</argument>
					<argument>
						<type>int</type>
						<name>size</name>
					</argument>
				</arguments>
			</kernel>
			<kernel>
				<name>vsub_kernel_0</name>
				<kernelId>subtraction</kernelId>
				<arguments>
					<argument>
						<type>float*</type>
						<name>input1</name>
						<memory>2</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>input2</name>
						<memory>2</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>output</name>
						<memory>2</memory>
						<access>w</access>
					</argument>
					<argument>
						<type>int</type>
						<name>size</name>
					</argument>
				</arguments>
			</kernel>
			<kernel>
				<name>vsub_kernel_1</name>
				<kernelId>subtraction</kernelId>
				<arguments>
					<argument>
						<type>float*</type>
						<name>input1</name>
						<memory>3</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>input2</name>
						<memory>3</memory>
						<access>r</access>
					</argument>
					<argument>
						<type>float*</type>
						<name>output</name>
						<memory>3</memory>
						<access>w</access>
					</argument>
					<argument>
						<type>int</type>
						<name>size</name>
					</argument>
				</arguments>
			</kernel>
		</kernels>
	</bitstream>
	```
