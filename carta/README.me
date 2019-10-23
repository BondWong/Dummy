## To run it
0. cd into carta folder
1. run docker build
```
build -t carta:0.0.1 .
```
2. run the server
```
docker run -p 5000:5000 carta:0.0.1
```
3.1. run the main.py with date
```
python3 main.py -i test.txt -d 2019-10-01
```
3.2 run the main.py without date
```
python3 main.py -i test.txt
```
4. to run it with customized file
4.1. move your csv file to carta/input
4.2. follow 1~3 to rebuild image and restart the server

## Detail
This is a simple client server architecture, we have docker running the server to 
make things simple. 

### server.py 
This is a simple flask server that expose localhost:5000/aggregator endpoint
### aggregator.py 
The main thing happens in the `src/aggregator.py` file, where pandas is used to process
csv data. 
### models.py 
Two python classes that represent the data models.
### The main.py 
It serves as a client that takes two parameter: input and date(optional). 
It makes a request to the server and print the result in json format.

## Important decision making
### Is Spark a Good Idea
My first try is to use a standalone spark running in docker container. This type of aggregatoin (map-reduce)
is what spark best at doing. However, spark is really meant to run a script that does its job, which means
using spark will break the OOP principle which required by this assignment. Therefore, I go with cient server style.
