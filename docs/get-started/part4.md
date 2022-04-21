*![time/embed](Estimated reading time: {X})*

In this section, we will teach you how to create your own simple application to
invoke the accelerator implemented in [Part 3](part3.md).

For the purpose of this tutorial, we provide the instructions to create an application using the
[C++](https://setup.inaccel.com/coral-api/?cpp#introduction-to-coral) and [Python](https://setup.inaccel.com/coral-api/?python#introduction-to-coral) APIs, though you can also check the programming interface for [Java](https://setup.inaccel.com/coral-api/?java#introduction-to-coral).

## Prerequisites

=== "C++"
	> Coral API (`coral-api`) package should be installed in your system.

	> === "Apt"
		```shell
		apt install coral-api
		```
	> === "Yum"
		```shell
		yum install coral-api
		```

=== "Python"
	> You can install `coral-api` package from PyPI using pip for python3. I.e:  
	```shell
	pip3 install coral-api
	```

## Introduction

Let's assume we are willing to add the respective elements of two arrays and
store their sum in a third array. To accelerate this operation we will invoke
the kernel we designed in the previous part of our tutorial.

## Write your application

Given the above information we can now proceed to write our application code.
The source code presented below accomplishes the objectives described in the
above section. Even though our API was designed to be simple and intuitive,
let's break it up into pieces and analyze them to gain a holistic understanding.

=== "C++"

	```cpp title="vadd.cpp"

	#include <algorithm>
	#include <cassert>
	#include <inaccel/coral>
	#include <iostream>

	int main() {
		int size = 1024;

		// Allocate vectors
		inaccel::vector<float> a(size), b(size), c(size);

		std::generate(a.begin(), a.end(), std::rand);
		std::generate(b.begin(), b.end(), std::rand);

		// Send a request for "addition" accelerator to the Coral FPGA Resource Manager
		// Request arguments must comply with the accelerator's specific argument list
		inaccel::request vadd("vector.addition");
		vadd.arg(a).arg(b).arg(c).arg(size);
		inaccel::submit(vadd).get();

		for (int i = 0; i < size; i++) {
			assert(a[i] + b[i] == c[i]);
		}

		std::cout << "Test PASSED" << std::endl;
	}
	```

	### What is `inaccel::vector`?

	It is simply a *type alias* for `std::vector` with `inaccel::allocator`.
	Therefore, both `inaccel::vector` and `std::vector` adhere to same usage
	principles. Whenever you must supply a kernel argument whose type contains a
	trailing star ('*'), you should use `inaccel::vector`.

	### What is `inaccel::request`?

	It represents an *accelerator request* that will be later submitted to Coral for
	execution. The name of the request (which is passed as constructor argument)
	should follow the naming convention explained below.

	### What name should I pass to `inaccel::request`?

	The name of your request should be identical to the corresponding
	accelerator's function prototype. Be aware that you must have deployed your
	bitstream for which you wish to invoke its kernels. If no such valid accelerator
	exists the request will be dismissed.

	For the sake of completeness, we present again the portion showing the function
	prototype of the available accelerator printed by
	`inaccel bitstream list da24cad466c6` command:

	```text
	PATH            /var/lib/inaccel/repository/.../xilinx/aws-vu9p-f1/shell-v04261818_201920.2/aws/vector/1/1addition
	DESCRIPTION     https://github.com/inaccel/vadd
	ACCELERATORS    1 x vector.addition (float* a, float* b, float* c, int size)
	```

	Hence, to create a request for this kernel we simply have to invoke the
	`inaccel::request` constructor with argument `vector.addition`
	for *addition*.

	In case of invoking an accelerator with multiple versions, the latest is the one
	to be executed by Coral.

	### What arguments should I pass to `inaccel::request`?

	The arguments for the request should match the argument list of the target
	accelerator as specified in its function prototype. Be aware that the ordering
	of arguments, as in any function, should be preserved.

	As mentioned above, the types which hold a trailing star represent an
	`inaccel::vector` of the specified type. The `inaccel::request` is populated
	with arguments through the `inaccel::request::arg` method.

	Therefore, based on the prototype of our accelerator, we should populate the
	request with arguments of the following types:

	1. `inaccel::vector<float>`
	2. `inaccel::vector<float>`
	3. `inaccel::vector<float>`
	4. `int`

	### How to execute an `inaccel::request`?

	Through the API call `inaccel::submit` with your request as argument. By
	invoking that function you transmit your accelerator request to Coral for
	scheduling and execution.

	The `inaccel::submit` executes the accelerator request in an asynchronous manner
	(i.e doesn't block until completion) and return a std::future. To ensure completion you have wait on that future using `get()` method.

	!!! hint "Full C++ API documentation is available [here](https://setup.inaccel.com/coral-api/?cpp#introduction-to-coral)."

	## Compilation

	To generate your application's executable you simply have to link against Coral
	API library.

	Below you can see an example of compiling `vadd.cpp` application:

	```bash
	g++ vadd.cpp --std=c++17 -lcoral-api -pthread -o vadd
	```

	## Run your application

	You run your application exactly the same way as any other application.

	Open up a terminal and execute the following command:

	```bash
	./vadd
	```
=== "Python"

	```python title="vadd.py"

	import numpy as np
	import inaccel.coral as inaccel

	size = np.int32(1024)

	with inaccel.allocator:
	    a = np.random.rand(size).astype(np.float32)
	    b = np.random.rand(size).astype(np.float32)

	    c = np.ndarray(size, dtype = np.float32)

	vadd = inaccel.request("vector.addition")
	vadd.arg(a).arg(b).arg(c).arg(size)

	inaccel.submit(vadd).result()

	np.array_equal(c, a + b)
	```

	### What is `inaccel.allocator`?
	`inaccel.allocator` is a Numpy allocator implementation that serves as a
	mechanishm to override the memory management strategy used for Numpy array
	data.

	### What is `inaccel.request`?
	It represents an *accelerator request* that will be later submitted to Coral for
	execution. The name of the request (which is passed as constructor argument)
	should follow the naming convention explained below.

	### What name should I pass to `inaccel.request`?

	The name of your request should be identical to the corresponding
	accelerator's function prototype. Be aware that you must have deployed your
	bitstream for which you wish to invoke its kernels. If no such valid accelerator
	exists the request will be dismissed.

	For the sake of completeness, we present again the portion showing the function
	prototype of the available accelerator printed by
	`inaccel bitstream list da24cad466c6` command:

	```text
	PATH            /var/lib/inaccel/repository/.../xilinx/aws-vu9p-f1/shell-v04261818_201920.2/aws/vector/1/1addition
	DESCRIPTION     https://github.com/inaccel/vadd
	ACCELERATORS    1 x vector.addition (float* a, float* b, float* c, int size)
	```

	Hence, to create a request for this kernel we simply have to invoke the
	`inaccel.request` constructor with argument `vector.addition`
	for *addition*.

	In case of invoking an accelerator with multiple versions, the latest is the one
	to be executed by Coral.

	### What arguments should I pass to `inaccel.request`?

	The arguments for the request should match the argument list of the target
	accelerator as specified in its function prototype. Be aware that the ordering
	of arguments, as in any function, should be preserved.

	As mentioned above, the types which hold a trailing star represent a
	numpy array of the specified type allocated with `inaccel allocator`. `inaccel.request` is populated
	with arguments using request's `arg` method.

	Therefore, based on the prototype of our accelerator, we should populate the
	request with arguments of the following types:

	1. `numpy.ndarray` of type `float32`
	2. `numpy.ndarray` of type `float32`
	3. `numpy.ndarray` of type `float32`
	4. `numpy int32`

	### How to execute an `inaccel.request`?

	Through the API call `inaccel.submit` with your request as argument. By
	invoking that function you transmit your accelerator request to Coral for
	scheduling and execution.

	`inaccel.submit` executes the accelerator request in an asynchronous manner
	(i.e doesn't block until completion) and returns a Python future. To ensure completion you have to wait on that future using `result()` method.

	!!! hint "Full Python API documentation is available [here](https://setup.inaccel.com/coral-api/?python#introduction-to-coral)."

	## Run your application

	You run your application exactly the same way as any other application.

	Open up a terminal and execute the following command:

	```bash
	python3 vadd.py
	```

## Conclusion

That's it! After this tutorial we hope you got a grasp of how to deploy
bitstreams and easily access their kernels from within your accelerated
applications by using Coral. Do not forget to follow the links and navigate
through our documentation site to explore more advanced use cases.
