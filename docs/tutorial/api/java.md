*![time/embed](Estimated reading time: {X})*

## Installation

Coral API Java artifacts are hosted in InAccel Repository.

```xml
<repository>
	<id>inaccel</id>
	<name>InAccel Repository</name>
	<url>http://jfrog.inaccel.com/artifactory/libs-release</url>
</repository>
```

You can add a Maven dependency with the following coordinates:

```xml
<dependency>
	<groupId>com.inaccel</groupId>
	<artifactId>coral-api</artifactId>
	<version>1.8</version>
</dependency>
```

!!! hint "Full Java API documentation is available [here](https://docs.inaccel.com/api/java)."

---

## Compilation

If you are not familiar with Maven you can still compile your applications by
manually resolving Coral API dependency. For that reason you should include in
the classpath the `coral-api-1..jar`.

Below you can see an example of compiling the `Example.java` application:

```bash
$ javac -cp .:/path/to/coral-api-1.8.jar Example.java
```
