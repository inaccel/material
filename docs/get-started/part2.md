*![time/embed](Estimated reading time: {X})*

Now that we have discussed about the main FPGA world concepts, let’s run a simple vector addition accelerated application. Depending on the deployed environment, we are going to either use Docker or Kubernetes instructions below:

=== "Docker"
	**Step 1**
	&nbsp;&nbsp;&nbsp;Install `docker-compose-plugin`:  
	To run the sample application you will need to have installed the docker compose plugin. If docker compose is not installed in your system please follow the instructions below:

	=== "Apt"
		```bash
		sudo apt docker-compose-plugin
		```

	=== "Yum"
		```bash
		sudo yum docker-compose-plugin
		```

	**Step 2**
	&nbsp;&nbsp;&nbsp;Create a `docker-compose.yml` file:

	The docker-compose file is basically comprised of two services: `inaccel-vadd` and `init` and a volume **shared** among the two services. Init runs first and downloads the right configuration file (bitstream) using` inaccel/cli` docker image and finally stores it in the shared volume. `inaccel-vadd`, that depends on `init` and uses `inaccel/vadd` image, is then able to invoke the accelerated vadd application.

	=== "Intel PAC A10"
		- *38d782e3b6125343b9342433e348ac4c*

			```yaml title="docker-compose.yml"
			services:
			  inaccel-vadd:
			    depends_on:
			      init:
			        condition: service_completed_successfully
			    image: inaccel/vadd
			    volumes:
			    - volume:/var/lib/inaccel
			  init:
			    command:
			    - bitstream
			    - install
			    - https://store.inaccel.com/artifactory/bitstreams/intel/pac_a10/38d782e3b6125343b9342433e348ac4c/vector/1/1addition
			    image: inaccel/cli
			    volumes:
			    - volume:/var/lib/inaccel
			volumes:
			  volume:
			    driver: inaccel
			```

	=== "Xilinx AWS VU9P F1"
		- **AWS** | *shell-v04261818_201920.2*

			```yaml title="docker-compose.yml"
			services:
			  inaccel-vadd:
			    depends_on:
			      init:
			        condition: service_completed_successfully
			    image: inaccel/vadd
			    volumes:
			    - volume:/var/lib/inaccel
			  init:
			    command:
			    - bitstream
			    - install
			    - https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/vector/1/1addition
			    image: inaccel/cli
			    volumes:
			    - volume:/var/lib/inaccel
			volumes:
			  volume:
			    driver: inaccel
			```

	=== "Xilinx U200"
		- *xdma_201830.2*

			```yaml title="docker-compose.yml"
			services:
			  inaccel-vadd:
			    depends_on:
			      init:
			        condition: service_completed_successfully
			    image: inaccel/vadd
			    volumes:
			    - volume:/var/lib/inaccel
			  init:
			    command:
			    - bitstream
			    - install
			    - https://store.inaccel.com/artifactory/bitstreams/xilinx/u200/xdma_201830.2/vector/1/1addition
			    image: inaccel/cli
			    volumes:
			    - volume:/var/lib/inaccel
			volumes:
			  volume:
			    driver: inaccel
			```

	=== "Xilinx U250"
		- **Azure** | *gen3x16_xdma_shell_2.1*

			```yaml title="docker-compose.yml"
			services:
			  inaccel-vadd:
			    depends_on:
			      init:
			        condition: service_completed_successfully
			    image: inaccel/vadd
			    volumes:
			    - volume:/var/lib/inaccel
			  init:
			    command:
			    - bitstream
			    - install
			    - https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/gen3x16_xdma_shell_2.1/azure/vector/1/1addition
			    image: inaccel/cli
			    volumes:
			    - volume:/var/lib/inaccel
			volumes:
			  volume:
			    driver: inaccel
			```

		- *xdma_201830.2*

			```yaml title="docker-compose.yml"
			services:
			  inaccel-vadd:
			    depends_on:
			      init:
			        condition: service_completed_successfully
			    image: inaccel/vadd
			    volumes:
			    - volume:/var/lib/inaccel
			  init:
			    command:
			    - bitstream
			    - install
			    - https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/vector/1/1addition
			    image: inaccel/cli
			    volumes:
			    - volume:/var/lib/inaccel
			volumes:
			  volume:
			    driver: inaccel
			```

	=== "Xilinx U280"
		- *xdma_201920.3*

			```yaml title="docker-compose.yml"
			services:
			  inaccel-vadd:
			    depends_on:
			      init:
			        condition: service_completed_successfully
			    image: inaccel/vadd
			    volumes:
			    - volume:/var/lib/inaccel
			  init:
			    command:
			    - bitstream
			    - install
			    - https://store.inaccel.com/artifactory/bitstreams/xilinx/u280/xdma_201920.3/vector/1/1addition
			    image: inaccel/cli
			    volumes:
			    - volume:/var/lib/inaccel
			volumes:
			  volume:
			    driver: inaccel
			```

	=== "Xilinx U50"
		- *gen3x16_xdma_201920.3*

			```yaml title="docker-compose.yml"
			services:
			  inaccel-vadd:
			    depends_on:
			      init:
			        condition: service_completed_successfully
			    image: inaccel/vadd
			    volumes:
			    - volume:/var/lib/inaccel
			  init:
			    command:
			    - bitstream
			    - install
			    - https://store.inaccel.com/artifactory/bitstreams/xilinx/u50/gen3x16_xdma_201920.3/vector/1/1addition
			    image: inaccel/cli
			    volumes:
			    - volume:/var/lib/inaccel
			volumes:
			  volume:
			    driver: inaccel
			```
	**Step 3**
	&nbsp;&nbsp;&nbsp;Run vector addition example:

	```bash
	docker compose run inaccel-vadd
	```

	**Step 4**
	&nbsp;&nbsp;&nbsp;Clean environment:


	Delete any containers or volumes created as well as `docker-compose.yml` file itself:
	```bash
	docker compose down --volumes
	rm docker-compose.yml
	```

=== "Kubernetes"
	**Step 1**
	&nbsp;&nbsp;&nbsp;Create a `pod.yml` file:

	To deploy FPGA accelerated applications to Kubernetes, we have to first of
	all enable InAccel FPGA Operator. To do so, we use the
	`inaccel/fpga: enabled` label. Apart from that, to target particular FPGA
	types, we add a nodeSelector to our workload specification (e.g.
	`intel/pac_a10: 38d782e3b6125343b9342433e348ac4c`). Additionally, we specify
	a resource limit to configure workloads to consume FPGAs
	(e.g. `intel/pac_a10: 1`). Finally, we are able to pre-fetch any required
	bitstreams, using a simple annotation and the bitstreams' URL.

	=== "Intel PAC A10"
		- *38d782e3b6125343b9342433e348ac4c*

			```yaml title="pod.yml"
			apiVersion: v1
			kind: Pod
			metadata:
			  annotations:
			    inaccel/cli: |
			      bitstream install https://store.inaccel.com/artifactory/bitstreams/intel/pac_a10/38d782e3b6125343b9342433e348ac4c/vector/1/1addition
			  labels:
			    inaccel/fpga: enabled
			  name: inaccel-vadd
			spec:
			  containers:
			  - image: inaccel/vadd
			    name: inaccel-vadd
			    resources:
			      limits:
			        intel/pac_a10: 1
			  nodeSelector:
			    intel/pac_a10: 38d782e3b6125343b9342433e348ac4c
			  restartPolicy: Never
			```

	=== "Xilinx AWS VU9P F1"
		- **AWS** | *shell-v04261818_201920.2*

			```yaml title="pod.yml"
			apiVersion: v1
			kind: Pod
			metadata:
			  annotations:
			    inaccel/cli: |
			      bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/aws-vu9p-f1/dynamic-shell/aws/vector/1/1addition
			  labels:
			    inaccel/fpga: enabled
			  name: inaccel-vadd
			spec:
			  containers:
			  - image: inaccel/vadd
			    name: inaccel-vadd
			    resources:
			      limits:
			        xilinx/aws-vu9p-f1: 1
			  nodeSelector:
			    xilinx/aws-vu9p-f1: dynamic-shell
			  restartPolicy: Never
			```

	=== "Xilinx U200"
		- *xdma_201830.2*

			```yaml title="pod.yml"
			apiVersion: v1
			kind: Pod
			metadata:
			  annotations:
			    inaccel/cli: |
			      bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u200/xdma_201830.2/vector/1/1addition
			  labels:
			    inaccel/fpga: enabled
			  name: inaccel-vadd
			spec:
			  containers:
			  - image: inaccel/vadd
			    name: inaccel-vadd
			    resources:
			      limits:
			        xilinx/u200: 1
			  nodeSelector:
			    xilinx/u200: xdma_201830.2
			  restartPolicy: Never
			```

	=== "Xilinx U250"
		- **Azure** | *gen3x16_xdma_shell_2.1*

			```yaml title="pod.yml"
			apiVersion: v1
			kind: Pod
			metadata:
			  annotations:
			    inaccel/cli: |
			      bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/gen3x16_xdma_shell_2.1/azure/vector/1/1addition
			  labels:
			    inaccel/fpga: enabled
			  name: inaccel-vadd
			spec:
			  containers:
			  - image: inaccel/vadd
			    name: inaccel-vadd
			    resources:
			      limits:
			        xilinx/u250: 1
			  nodeSelector:
			    xilinx/u250: gen3x16_xdma_shell_2.1
			  restartPolicy: Never
			```

		- *xdma_201830.2*

			```yaml title="pod.yml"
			apiVersion: v1
			kind: Pod
			metadata:
			  annotations:
			    inaccel/cli: |
			      bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u250/xdma_201830.2/vector/1/1addition
			  labels:
			    inaccel/fpga: enabled
			  name: inaccel-vadd
			spec:
			  containers:
			  - image: inaccel/vadd
			    name: inaccel-vadd
			    resources:
			      limits:
			        xilinx/u250: 1
			  nodeSelector:
			    xilinx/u250: xdma_201830.2
			  restartPolicy: Never
			```

	=== "Xilinx U280"
		- *xdma_201920.3*

			```yaml title="pod.yml"
			apiVersion: v1
			kind: Pod
			metadata:
			  annotations:
			    inaccel/cli: |
			      bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u280/xdma_201920.3/vector/1/1addition
			  labels:
			    inaccel/fpga: enabled
			  name: inaccel-vadd
			spec:
			  containers:
			  - image: inaccel/vadd
			    name: inaccel-vadd
			    resources:
			      limits:
			        xilinx/u280: 1
			  nodeSelector:
			    xilinx/u280: xdma_201920.3
			  restartPolicy: Never
			```

	=== "Xilinx U50"
		- *gen3x16_xdma_201920.3*

			```yaml title="pod.yml"
			apiVersion: v1
			kind: Pod
			metadata:
			  annotations:
			    inaccel/cli: |
			      bitstream install https://store.inaccel.com/artifactory/bitstreams/xilinx/u50/gen3x16_xdma_201920.3/vector/1/1addition
			  labels:
			    inaccel/fpga: enabled
			  name: inaccel-vadd
			spec:
			  containers:
			  - image: inaccel/vadd
			    name: inaccel-vadd
			    resources:
			      limits:
			        xilinx/u50: 1
			  nodeSelector:
			    xilinx/u50: gen3x16_xdma_201920.3
			  restartPolicy: Never
			```

	**Step 2**
	&nbsp;&nbsp;&nbsp;Deploy `pod.yml` file and inspect the logs:
	```bash
	kubectl apply --filename pod.yml
	kubectl wait --for condition=ready --timeout -1s pod/inaccel-vadd
	kubectl logs --follow pod/inaccel-vadd
	```

	**Step 3**
	&nbsp;&nbsp;&nbsp;Delete the pod created for the accelerated vadd application:
	```bash
	kubectl delete pod/inaccel-vadd
	```

## Recap

In this short section, we learned how we can deploy a simple pre-compiled application targeting datacenter FPGAs through Docker or Kubernetes.  
Next, we are going to package our own accelerator and write an application from scratch to cover all the scenarios of a cloud deployment targeting FPGA resources.
