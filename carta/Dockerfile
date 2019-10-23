FROM ubuntu:18.04

RUN apt-get update -y && \
    apt-get install -y python3-dev python3-pip

RUN mkdir server
WORKDIR server
COPY input input
COPY src src
COPY env env

RUN pip3 install --upgrade pip
RUN pip3 install -r env/requirements.txt
CMD python3 src/server.py