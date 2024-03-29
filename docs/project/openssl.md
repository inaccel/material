---
title: TLS/SSL and crypto library
---

# TLS/SSL and crypto library

*![time/embed](Estimated reading time: {X})*

[![project](https://img.shields.io/static/v1?logo=OpenSSL&color=721412&label=Project&message=OpenSSL&style=for-the-badge)](https://openssl.org)
[![github](https://img.shields.io/static/v1?logo=GitHub&color=181717&label=GitHub&message=Code&style=for-the-badge)](https://github.com/inaccel/openssl)

## How to install

=== "Debian"

	```bash
	curl -sS https://setup.inaccel.com/repository | sh
	apt install inaccel-openssl
	```

=== "RedHat"

	```bash
	curl -sS https://setup.inaccel.com/repository | sh
	yum install inaccel-openssl
	```

### FPGA Platforms

Get the available accelerators for your platform.

=== "AWS VU9P F1"

	> *xilinx dynamic-shell*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/openssl/crypto/aes/1.0.2/4cbc-decrypt_4cfb128-decrypt_4ctr128-crypt
	```

=== "U200"

	> *xilinx xdma_201830.2*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u200/xdma_201830.2/openssl/crypto/aes/1.0.2/4cbc-decrypt_4cfb128-decrypt_4ctr128-crypt
	```

=== "U250"

	> *xilinx xdma_201830.2*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/openssl/crypto/aes/1.0.2/4cbc-decrypt_4cfb128-decrypt_4ctr128-crypt
	```

=== "U280"

	> *xilinx xdma_201920.3*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u280/xdma_201920.3/openssl/crypto/aes/1.0.2/4cbc-decrypt_4cfb128-decrypt_4ctr128-crypt
	```

=== "U50"

	> *xilinx gen3x16_xdma_201920.3*

	```bash
	inaccel bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u50/gen3x16_xdma_201920.3/openssl/crypto/aes/1.0.2/4cbc-decrypt_4cfb128-decrypt_4ctr128-crypt
	```

## Examples

#### 128-EEA2 decrypt

Pass the following options to the linker: `-lcoral-api -linaccel-crypto`

```c
#include <inaccel/openssl/aes.h>
#include <inaccel/shm.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define LENGTH 200
const unsigned char IN[LENGTH] = {0xB9, 0x67, 0xD5, 0x53, 0x0D, 0xFC, 0x48, 0x37, 0x1E, 0xE0, 0xEA, 0x48, 0xB7, 0x1D, 0xA4, 0x10, 0x6F, 0x6C, 0xC0, 0x54, 0x1F, 0x06, 0xBF, 0x66, 0x40, 0x4E, 0xC3, 0x75, 0x4E, 0x0A, 0x0D, 0xC8, 0xDD, 0x66, 0x2C, 0x0E, 0xFE, 0xE0, 0x95, 0x8D, 0x3F, 0x12, 0xCF, 0x9C, 0xF2, 0xCA, 0xDA, 0xFF, 0xC6, 0x2E, 0xE3, 0xD1, 0x5A, 0x45, 0xB3, 0xF6, 0xAA, 0x4C, 0x6E, 0x78, 0x5B, 0x57, 0x86, 0xFC, 0xA2, 0xCF, 0x4C, 0x36, 0xE3, 0xAA, 0xE6, 0x8C, 0x8D, 0xB7, 0x02, 0xBE, 0x99, 0xD1, 0x88, 0x5A, 0x99, 0xCA, 0x88, 0xE3, 0xBA, 0xCC, 0xA1, 0xFD, 0xB2, 0x83, 0xC4, 0xC4, 0x07, 0x0A, 0xC7, 0x2D, 0x06, 0xCB, 0x2E, 0x5E, 0xC6, 0xBE, 0x0C, 0xA6, 0x27, 0xAA, 0xDA, 0x49, 0x45, 0x81, 0x62, 0x36, 0x0D, 0xEE, 0x93, 0xF9, 0x8D, 0x3A, 0x05, 0xB6, 0xE5, 0xA7, 0x19, 0x08, 0x26, 0xF6, 0x56, 0xF0, 0x1B, 0x2A, 0x58, 0x5B, 0xC7, 0x1B, 0xE9, 0x1A, 0x3B, 0x9D, 0xEF, 0xF1, 0xA7, 0x50, 0x2D, 0x70, 0x9D, 0x6C, 0x8E, 0x60, 0xE0, 0x31, 0xE4, 0xDE, 0x50, 0xE0, 0xF6, 0x80, 0x02, 0x94, 0xD3, 0xEF, 0xA7, 0x5B, 0xC3, 0x66, 0x5D, 0x82, 0x8E, 0xEB, 0x48, 0x68, 0x0B, 0x4B, 0xD4, 0xC9, 0xEE, 0x1F, 0x5F, 0x06, 0xF7, 0xBE, 0xAC, 0x2B, 0x9B, 0x67, 0xF7, 0x43, 0x79, 0xB2, 0xCC, 0xB8, 0xE9, 0x15, 0xCE, 0x5E, 0xD1, 0x1E, 0xB4, 0x8C, 0x12, 0x70};
const unsigned char OUT[LENGTH] = {0xA4, 0x98, 0xA3, 0x56, 0x54, 0xBF, 0xF2, 0xFD, 0xFA, 0x7A, 0x6C, 0x53, 0x15, 0x14, 0xEA, 0xE3, 0x2E, 0x52, 0x8F, 0x20, 0x57, 0x09, 0x58, 0x28, 0xA8, 0x06, 0xD5, 0xD1, 0x53, 0x83, 0x78, 0x76, 0x1C, 0x9A, 0x4B, 0xEE, 0x59, 0x3E, 0x6B, 0x53, 0x37, 0xD6, 0x25, 0x4B, 0x69, 0x8F, 0xAE, 0x96, 0x60, 0x3D, 0x36, 0xB6, 0xC5, 0x8D, 0xDE, 0x6D, 0x12, 0x33, 0x3E, 0xE3, 0xB5, 0xB5, 0x5A, 0xD0, 0xCF, 0x24, 0x3E, 0x28, 0xE0, 0xA8, 0xFA, 0x97, 0xFD, 0x1F, 0xE1, 0x67, 0x2D, 0x0F, 0x7C, 0x8D, 0xCB, 0x31, 0x43, 0x90, 0xBD, 0xA0, 0x7C, 0xCF, 0xD2, 0xB9, 0xB2, 0x88, 0xED, 0x8B, 0xD7, 0xBC, 0x2F, 0x16, 0x64, 0x0F, 0x3D, 0xDD, 0xA5, 0x3B, 0x7B, 0x07, 0x21, 0xA8, 0x94, 0x1C, 0x35, 0xDE, 0x4D, 0xF6, 0xED, 0x89, 0x97, 0x69, 0xD7, 0x69, 0xA1, 0x0A, 0x70, 0x8F, 0x94, 0x48, 0xCA, 0x42, 0xDC, 0xAD, 0xD0, 0x98, 0x8A, 0xF4, 0x52, 0x06, 0x7A, 0x72, 0x2D, 0x0F, 0x0E, 0x61, 0x6C, 0x5A, 0xD6, 0x5A, 0xE2, 0x6D, 0xC2, 0xBA, 0x56, 0x64, 0x43, 0x45, 0x72, 0x56, 0x0C, 0xBB, 0x98, 0xE7, 0x69, 0x68, 0xFF, 0x72, 0x5C, 0x51, 0x77, 0x56, 0xC3, 0x23, 0x64, 0x50, 0x03, 0xCF, 0xA9, 0xD9, 0xA8, 0x0B, 0x46, 0x6B, 0x44, 0x1B, 0x4E, 0x86, 0x60, 0x3F, 0xDC, 0x6B, 0xF9, 0x74, 0xD2, 0x62, 0x5B, 0xD1, 0x54, 0x36, 0x22, 0xCA, 0x8B, 0x64};
const unsigned char USERKEY[16] = {0x0A, 0x8B, 0x6B, 0xD8, 0xD9, 0xB0, 0x8B, 0x08, 0xD6, 0x4E, 0x32, 0xD1, 0x81, 0x77, 0x77, 0xFB};
const unsigned int COUNT = 0x00000000;
const unsigned char BEARER = 0x04;
const unsigned char DIRECTION = 0x00;

int main(int argc, char *argv[]) {
	unsigned char *in = (unsigned char *) inaccel_alloc(LENGTH);
	if (!in) {
		perror("inaccel_alloc");
		return EXIT_FAILURE;
	}
	unsigned char *out = (unsigned char *) inaccel_alloc(LENGTH);
	if (!out) {
		perror("inaccel_alloc");
		return EXIT_FAILURE;
	}

	memcpy(in, IN, LENGTH);

	inaccel_AES_KEY key;
	if (inaccel_AES_set_encrypt_key(USERKEY, 128, &key)) {
		perror("inaccel_AES_set_encrypt_key");
		return EXIT_FAILURE;
	}

	unsigned char ivec[inaccel_AES_BLOCK_SIZE] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
	memcpy(ivec, &COUNT, sizeof(COUNT));
	ivec[sizeof(COUNT)] = (BEARER << 3) | (DIRECTION << 2);

	unsigned char ecount_buf[inaccel_AES_BLOCK_SIZE];
	unsigned int num = 0;
	if (inaccel_AES_ctr128_encrypt(in, out, (((LENGTH - 1) >> 4) + 1) << 4, &key, ivec, ecount_buf, &num)) {
		perror("inaccel_AES_ctr128_encrypt");
		return EXIT_FAILURE;
	}

	if (memcmp(out, OUT, LENGTH)) {
		fprintf(stderr, "bad decrypt\n");
		return EXIT_FAILURE;
	}

	inaccel_free(in);
	inaccel_free(out);

	return EXIT_SUCCESS;
}
```
