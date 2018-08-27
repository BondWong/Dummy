# Docker Networking

Docker container technology has become more and more powerful and popular. In this part,
I will talk about container networking based on my own experience of using docker and study.

Before we get started, we need to define the term `docker host`.
> A docker host can either be a physical machine or a VM that has the docker daemon and client running.
> It enables you to interact with a docker registry on the one hand (to pull/push docker image),
> and on the other hand, allows you to start, stop, and inspect containers.

The following image is a high level architecture of a docker host.
![alt text](https://goo.gl/images/qVbV8T)

In this post, single host means that we only have one Docker daemon installed or we only consider containers
inside one single Docker daemon. multiple host means that we are handling network connection managed by more than one
Docker daemons.

Let's categorize them as external networking, and internal networking.

## External Networking

Let's image we have two containers, `A` and `B`, running in a single docker host. External networking means
that the user or application that is not hosted in a docker container connects to either `A` or `B`.
Meanwhile, internal networking means containers talk to each other, e.g `A` connects to `B`.

Before you can connect to a running docker container. You need to published a list of ports using `-p`.
By doing `docker run -p 8080:80 image_name`, we created a container that can be accessed via `localhost:8080`.
`-p 8080:80` means map port 80 in docker container to 8080 on the host.

Note that `--ip` or `--hostname` are only used internally. One doesn't need to specify a hostname or ip to connect
to a docker container from outside.

## Internal Networking

### 1. `--network`
Internal networking means the network interaction between containers. In order to talk to each other, containers need
to be under the same network. We can use `--network` to specify a network for a certain container. Docker daemon
effectively acts as a DHCP server for each container.

### 2. `--ip` and `--hostname`
As a DHCP server, Docker daemon will automatically pick an ip address from the address pool and assign to each container.
We can use `--ip` to specify a certain ip to the container. We can then use a container's hostname to send data.
By default, hostname is the same as the name of the container. Docker daemon will also serve as a DNS server to resolve
hostname internally. We can use `--hostname` to specify a hostname for a container.

### 3. builtin network type -- single Docker daemon
Docker provides us with multiple network connection type. In single Docker daemon environment, the most common ones are `bridge`
and `host`. `bridge` is the default network option used by all containers. If we don't specify a network type, `bridge` is used.
However, we will have to use `--link` option to connect two containers under the `bridge` network. In a self-defined network,
`--link` is not needed. As for `host`, containers with the `host` option will be available both external world or other containers
on the host's ip address. That means it removes the network isolation between docker container and the host.

### 4. builtin network type -- multiple Docker daemon
