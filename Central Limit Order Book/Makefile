#
# Makefile
#

CXX = g++
CFLAGS = -c -Wall -Wextra -g -std=c++11 -Wswitch
LDFLAGS = -lm -lpthread -I/usr/X11R6/include -L/usr/X11R6/lib -lm -lpthread -lX11 # for mac
MAIN = CLOB_main

all: clear CLOB_main.o Order.o OrderBook.o visualise.o visualise_helper.o
		$(CXX) $(LDFLAGS) -o $(MAIN) Order.o OrderBook.o visualise.o visualise_helper.o CLOB_main.o

CLOB_main.o: CLOB_main.cpp
		$(CXX) $(CFLAGS) CLOB_main.cpp

Order.o: Order.cpp Order.hpp HashHeap.hpp
		$(CXX) $(CFLAGS) HashHeap.hpp Order.hpp Order.cpp

OrderBook.o: OrderBook.cpp OrderBook.hpp
		$(CXX) $(CFLAGS) OrderBook.hpp OrderBook.cpp

visualise.o: visualise.cpp visualise.hpp
		$(CXX) $(CFLAGS) -I/opt/X11/include visualise.hpp visualise.cpp

visualise_helper.o: visualise_helper.cpp visualise_helper.hpp
		$(CXX) $(CFLAGS) visualise_helper.hpp visualise_helper.cpp

Test.o: Test.cpp catch.hpp
		$(CXX) $(CFLAGS) catch.hpp Test.cpp

unit.test: visualise.o visualise_helper.o Order.o OrderBook.o Test.o
		$(CXX) $(LDFLAGS) -o unit.test visualise.o visualise_helper.o Order.o OrderBook.o Test.o

test: clear unit.test
		./unit.test

clear:
		rm -rf *.o
		rm -rf *.gch*
		rm -rf $(MAIN)
		rm -rf *.test
		rm -rf out.txt
