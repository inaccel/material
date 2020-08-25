*![time/embed](Estimated reading time: {X})*

In this section, we will teach you how to create your own simple application to
invoke the accelerators implemented in [Part 3](bitstreams.md).

For the purpose of this tutorial, we will create an application using the
[C++](/api/cpp/annotated.html) API, though you can also check the programming
interfaces for [Java](/api/java), Scala and [Python](/api/python).

## Prerequisites

1. Coral API (`coral-api`) package should be installed in your system. Complete
instructions on how to install it are provided [here](/api/cpp/annotated.html).

## Introduction

Let's assume we are willing to add the respective elements of two arrays and
store their sum in a third array. Afterwards, we want to do element-wise
subtraction of the same arrays and store the result in a forth one. To
accelerate these operations we will invoke the kernels we designed in the
previous part of our tutorial.

## Write your application

Given the above information we can now proceed to write our application code.
The source code presented below accomplishes the objectives described in the
above section. Even though our API was designed to be simple and intuitive,
let's break it up into pieces and analyze them to gain a holistic understanding.

> **`demo_coral.cpp`**:

```cpp
#include <cstdlib>
#include <iostream>

#include <inaccel/coral>

void random(inaccel::vector<float> &vector, int size) {
	for (int i = 0; i < size; i++) {
		vector[i] = (float) rand();
	}
}

int main() {
	int size = 1024 * 1024;

	// Allocate four vectors
	inaccel::vector<float> a(size), b(size), c_add(size), c_sub(size);

	// Initialize input vectors with random values
	random(a, size);
	random(b, size);

	// Send a request for "addition" accelerator to the Coral FPGA Resource Manager
	// Request arguments must comply with the accelerator's specific argument list
	inaccel::request vadd("com.inaccel.math.vector.addition");
	vadd.arg(a).arg(b).arg(c_add).arg(size);
	inaccel::wait(inaccel::submit(vadd));

	// Send a request for "subtraction" accelerator to the Coral FPGA Resource Manager
	// Request arguments must comply with the accelerator's specific argument list
	inaccel::request vsub("com.inaccel.math.vector.subtraction");
	vsub.arg(a).arg(b).arg(c_sub).arg(size);
	inaccel::wait(inaccel::submit(vsub));

	// Check output vectors
	bool valid = true;

	for (int i = 0; i < size; i++) {
		if (c_add[i] != (a[i] + b[i])) valid = false;

		if (c_sub[i] != (a[i] - b[i])) valid = false;
	}

	if (valid) {
		std::cout << "Results: RIGHT!" << std::endl;
		return 0;
	} else {
		std::cout << "Results: WRONG!" << std::endl;
		return 1;
	}
}
```

### What is `inaccel::vector`?

It is simply a *type alias* for `std::vector` with InAccel's custom allocator.
Therefore, both `inaccel::vector` and `std::vector` adhere to same usage
principles. Whenever you must supply a kernel argument whose type contains a
trailing star ('*'), you should use `inaccel::vector`.

### What is `inaccel::request`?

It represents an *accelerator request* that will be later submitted to Coral for
execution. The name of the request (which is passed as constructor argument)
should follow the naming convention explained below.

### What name should I pass to `inaccel::request`?

The name of your request should be identical to the the corresponding
accelerator's function prototype. Be aware that you must have deployed your
bitstream for which you wish to invoke its kernels. If no such valid accelerator
exists the request will be dismissed.

For the sake of completeness, we present again the portion showing the function
prototypes of the available accelerators printed by
`inaccel bitstream list 9053452841f2` command:

```text
PATH            /var/lib/inaccel/repository/518157c44cae492f80c920dc6877deb6/xilinx/aws-vu9p-f1-04261818/dynamic_5.0/com/inaccel/math/vector/0.1/2addition_2subtraction
DESCRIPTION     vector operations
ACCELERATORS    2 x com.inaccel.math.vector.addition (float16* input1, float16* input2, float16* output, int size)
                2 x com.inaccel.math.vector.subtraction (float16* input1, float16* input2, float16* output, int size)
```

Hence, to create requests for those kernels we simply have to invoke the
`inaccel::request` constructor with argument `com.inaccel.math.vector.addition`
for *addition* and `com.inaccel.math.vector.subtraction` for *subtraction*
acceleration respectively.

In case of invoking an accelerator with multiple versions, the latest is the one
to be executed by Coral.

### What arguments should I pass to `inaccel::request`?

The arguments for the request should match the argument list of the target
accelerator as specified in its function prototype. Be aware that the ordering
of arguments, as in any function, should be preserved.

As mentioned above, the types which hold a trailing star represent an
`inaccel::vector` of the specified type. The `inaccel::request` is populated
with arguments through the `inaccel::request::arg` method.

Therefore, based on the prototypes of our accelerators, we should populate the
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
(i.e doesn't block until completion). To ensure completion you have to use
`inaccel::wait`.

!!! hint "Full C++ API documentation is available [here](/api/cpp/annotated.html)."

## Compilation

To generate your application's executable you simply have to link against Coral
API library.

Below you can see an example of compiling the `demo_coral.cpp` application:

```bash
g++ -O2 demo_coral.cpp -lcoral-api -o demo_app
```

## Run your application

You run your application exactly the same way as any other application.

Open up a terminal and execute the following command:

```bash
./demo_app
```

## Conclusion

That's it! After this tutorial we hope you got a grasp of how to deploy
bitstreams and easily access their kernels from within your accelerated
applications by using Coral. Do not forget to follow the links and navigate
through our documentation site to explore more advanced use cases.
