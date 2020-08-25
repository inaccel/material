*![time/embed](Estimated reading time: {X})*

## Coral 1.8

* Kubernetes FPGA plugin. InAccel Coral device plugin for Kubernetes allows you
	to automatically expose the number of FPGAs on each node of your cluster,
	keep track of the health of your FPGAs and run Coral enabled containers in
	Kubernetes.

* Custom platforms/runtimes. Without customizing the code for InAccel Coral
	itself, vendors can implement a custom runtime that you deploy as a
	platform, using InAccel container-runtime. The targeted cases include custom
	(non-OpenCL) implementations, new FPGA families, and other similar computing
	resources that may require vendor specific initialization and setup.

## Coral 1.7

* Native Python API that allows accelerator invocation using common numpy
	arrays as input/output. Acceleration requests can now be submitted from
	python cells, in 2 lines of code equivalent to the C/C++ and Java APIs.

* Support for Xilinx inter-kernel streaming communication. Kernels that
	communicate with HLS streams and need to be launched together can be merged
	inside the bitstream specification, in order to be treated as one.

* Bitstream repository isolation. In a multi-tenant system, each distinct user
	(either on host or inside a container) can specify the "execute" permissions
	of the FPGA binaries during bitstrteam installation.

## Coral 1.6

* Introduced software Pipelining technique. Now requests from any process or
	thread are processed in a pipeline manner (read - execute - write)
	overlapping memory transfers with kernel execution and hiding PCIe overhead.

* Modified InAccel Monitor to track down the performance of the accelerator
	pipelines, show the detailed status of each stage and report the outcome of
	each request.

* Optimized the runtime backend for Xilinx devices, by using the
	vendor-recommended memory migration API.

## Coral 1.5

* Enabled Statsd monitoring service for Enterprise Edition licenses. You can now
	monitor accelerator execution, FPGA utilization and system effectiveness
	through an analytical Web UI (alpha).

## Coral 1.4

* Refined and optimized C++ API - Reimplemented from scratch to provide native
	C++ performance and easy to use APIs to interact with Coral. By offering our
	custom allocator, kernel arguments can now be populated by simply
	interacting with std::vector.

* Facilitated the deployment process of new bitstreams and eliminated the
	up-to-now prerequisite of restarting Coral for any bitstream modifications.
	From now on, you can register your bitstreams to Coral through an
	easy-to-use CLI and invoke requests on those kernels without additional
	operations.

* Added a rich set of options for bitstream configuration file. Those options
	allow better organization granularity and versioning of your bitstreams.
	Additionally, the arguments of each kernel along with their types and access
	permissions are explicitly specified.

* Added support for bitstream repository management to organize your bitstream
	portfolio based on target vendor, tooling version and many other options.
	All this functionality is supported out-of-the-box with a simple, yet
	intuitive bitstream configuration file (JSON/XML).
