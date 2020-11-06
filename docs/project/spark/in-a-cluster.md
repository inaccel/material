*![time/embed](Estimated reading time: {X})*

The following steps can be performed on any machine with a Linux distribution
(inside or outside Amazon EC2).

### 1. Set your AWS Credentials

Assuming that you already have an AWS account set up, one option is to `export`
the following environment variables:

```bash
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### 2. Install Flintrock

Flintrock is a command-line tool for launching Apache Spark clusters. Flintrock
requires Python 3.4 or newer, unless you use one of the standalone packages.
Find more info [here](https://github.com/nchammas/flintrock).

> **Recommended Way**

> To get the latest release of Flintrock, simply run pip:

```bash
pip3 install flintrock
flintrock --version
```

### 3. Configure Flintrock

Flintrock lets you persist your desired configuration to a YAML file so that you
don't have to keep typing out the same options over and over at the command
line.

To setup and edit the default config file, run the following command:

```bash
flintrock configure
```

> **Sample `config.yaml`**:

```yaml
services:
  hdfs:
    version: 2.8.5
  spark:
    version: 2.4.4

provider: ec2

providers:
  ec2:
    key-name: key_name # change accordingly
    identity-file: /path/to/key.pem # change accordingly
    instance-type: f1.2xlarge
    region: us-east-1
    ami: ami-0c706ede1e7f40420 # InAccel's AMI
    user: ec2-user
    min-root-ebs-size-gb: 32 # feel free to change
    ebs-optimized: yes
    instance-initiated-shutdown-behavior: stop
    user-data: /path/to/user-data/script.sh # change accordingly

launch:
  num-slaves: 4 # feel free to change
  spark-executor-instances: 8 # 2xlarge
  install-hdfs: True
  install-spark: True

debug: false
```

Use `user-data` field to configure the
[**InAccel Coral**](https://inaccel.com/coral-fpga-resource-manager) license.
Click [here](https://inaccel.com/license) to automatically generate a new free
license key!

> **Sample `script.sh`**:

```bash
#!/bin/bash

inaccel config license <key>
```

### 4. Create a new cluster

With a config file like that, you can now launch a cluster with just this:

```bash
flintrock launch inaccel-demo-cluster
```

Since AWS performance is highly variable, the exact launch time can not be
predicted. A typical launch of a medium size cluster takes around 10 minutes.
After it finishes, login to the Master node.

```bash
flintrock login inaccel-demo-cluster
```

### 5. Install InAccel release

Clone InAccel repository on the Master node.

```bash
git clone https://bitbucket.org/inaccel/release.git inaccel && source inaccel/setup.sh
```

### 6. Submitting applications

> * **InAccel OFF**:

```text
$ spark-submit [ arguments ]
```

> * **InAccel ON**:

```text
$ spark-submit --inaccel [ arguments ]
```

### 7. Destroy the cluster

Once you're done using the cluster, don't forget to destroy it with:

```bash
flintrock destroy inaccel-demo-cluster
```
