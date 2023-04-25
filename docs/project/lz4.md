---
title: Extremely Fast Compression algorithm
---

# Extremely Fast Compression algorithm

*![time/embed](Estimated reading time: {X})*

[![project](https://img.shields.io/static/v1?label=Project&message=LZ4&style=for-the-badge)](http://lz4.org)
[![github](https://img.shields.io/static/v1?logo=GitHub&color=181717&label=GitHub&message=Code&style=for-the-badge)](https://github.com/inaccel/lz4)

## How to install

=== "Debian"

	```bash
	curl -sS https://setup.inaccel.com/repository | sh
	apt install coral-api
	git clone https://github.com/inaccel/lz4
	make install -C lz4/programs
	```

=== "RedHat"

	```bash
	curl -sS https://setup.inaccel.com/repository | sh
	yum install coral-api
	git clone https://github.com/inaccel/lz4
	make install -C lz4/programs
	```

### FPGA Platforms

Get the available accelerators for your platform.

=== "AWS VU9P F1"

	> *xilinx dynamic-shell*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/com/xilinx/vitis/dataCompression/lz4/1.1/8compress
	```

=== "U280"

	> *xilinx xdma_201920.3*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u280/xdma_201920.3/com/xilinx/vitis/dataCompression/lz4/1.1/8compress
	```

=== "U50"

	> *xilinx gen3x16_xdma_201920.3*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u50/gen3x16_xdma_201920.3/com/xilinx/vitis/dataCompression/lz4/1.1/7compress
	```

## Examples

#### Enable Acceleration

Usage:

```bash
lz4 -F [arg] [input] [output]
```
