# Docker Networking -- Basis

Docker container technology has become more and more powerful and popular. In this part,
I will talk about docker single host deployment networking basis based on my own experience of using docker and study.

Before we get started, we need to define the term `docker host`.
> A docker host can either be a physical machine or a VM that has the docker daemon and client running.
> It enables you to interact with a docker registry on the one hand (to pull/push docker image),
> and on the other hand, allows you to start, stop, and inspect containers.

The following image is a high level architecture of a docker host.
![alt text](https://goo.gl/images/qVbV8T)

In a host, we usually more than one containers. We can connect them with each other either with shared volume
or networking. In terms of networking, we have external networking and internal networking.

## External Networking

Let's image we have two containers, `A` and `B`, running in a single host. External networking means
that the user or application that is not hosted in a docker container connects to either `A` or `B`.
Meanwhile, internal networking means containers talk to each other, e.g `A` connects to `B`.

Before you can connect to a running docker container. You need to published a list of ports using `-p`.
By doing `docker run -p 8080:80 image_name`, we created a container that can be accessed via `localhost:8080`.
`-p 8080:80` means map port 80 in docker container to 8080 on the host. 

## Internal Networking
