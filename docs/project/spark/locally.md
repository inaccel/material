*![time/embed](Estimated reading time: {X})*

### 1. Launch InAccel's AMI

You will find InAccel's
"[FPGA-Accelerated ML Suite](https://aws.amazon.com/marketplace/pp/B07TTNMFZ5)"
on AWS Marketplace.

Use `User data` field to configure the InAccel Coral license. Click
[here](https://inaccel.com/license) to automatically generate a new free license
key!

![license-key-locally](/img/license-key-locally.png){: .center}

### 2. Install InAccel release

Clone InAccel repository on the Master node.

```bash
git clone https://bitbucket.org/inaccel/release.git inaccel && source inaccel/setup.sh
```

If not present, the setup will download and configure Apache Spark using a
public mirror.

### 3. Submitting applications

> * **InAccel OFF**:

```text
$ spark-submit [ arguments ]
```

> * **InAccel ON**:

```text
$ spark-submit --inaccel [ arguments ]
```
