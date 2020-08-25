*![time/embed](Estimated reading time: {X})*

## Installation

The *C++ API* to interact with Coral FPGA resource manager is available as a
package repository. The only requirement to proceed with the instructions below
is to have InAccel as a trusted repository source for your package manager.

The above prerequisite is already met if you have completed `inaccel` package
installation. Otherwise, add InAccel's repository to your package manager by
following the links below:

* For Debian-based installations, follow Step 1-4 from
[here](/install/debian).

* For RPM-based installations, follow Step 1 from
[here](/install/rpm).

To install C++ `coral-api` package simply issue the following command:

=== "Debian"

	```bash
	sudo apt-get update && sudo apt-get install -y coral-api
	```

=== "RPM"

	```bash
	sudo yum install -y coral-api
	```

Upon installing you can easily write your own accelerated applications. Just
include the appropriate header and submit your accelerator request. Check our
[Getting Started ](/tutorial/orientation) guide to leverage the power of
acceleration.

!!! hint "Full C++ API documentation is available [here](/api/cpp/annotated.html)."

---

## Compilation

To generate your application's executable you should link against Coral API
library.

Below you can see an example of compiling the `example.cpp` application:

```bash
g++ example.cpp -lcoral-api -o example
```
