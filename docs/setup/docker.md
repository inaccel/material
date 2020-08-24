---
title: in a Docker image
---

# in a Docker image

*<small id="time">Estimated reading time: X</small>*

#### **FROM** debian / ubuntu

```dockerfile
ENV CORAL_CLIENT 1

# Setup InAccel repository
RUN apt-get update && \
	apt-get install -y \
		apt-transport-https \
		ca-certificates \
		curl \
		gnupg-agent \
		software-properties-common && \
	curl -fsSL https://jfrog.inaccel.com/artifactory/generic/packages/gpg | apt-key add - && \
	add-apt-repository \
		"deb [arch=amd64] https://jfrog.inaccel.com/artifactory/generic/packages/debian /" && \
	rm -rf /var/lib/apt/lists/*
```

#### **FROM** amazonlinux / centos

```dockerfile
ENV CORAL_CLIENT 1

# Setup InAccel repository
RUN yum install -y yum-utils && \
	yum-config-manager \
		--add-repo \
		https://jfrog.inaccel.com/artifactory/generic/packages/inaccel.repo && \
	yum clean all
```

#### **FROM** fedora

```dockerfile
ENV CORAL_CLIENT 1

# Setup InAccel repository
RUN dnf install -y dnf-plugins-core && \
	dnf config-manager \
		--add-repo \
		https://jfrog.inaccel.com/artifactory/generic/packages/inaccel.repo && \
	dnf clean all
```
