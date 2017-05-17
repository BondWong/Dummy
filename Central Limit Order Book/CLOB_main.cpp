// My University number is: *** to be filled in ***
#include <cstdlib>
#include <iostream>
#include <fstream>

#include "CLOB_shared.hpp"
#include "AggregatedQuoteType.hpp"
#include "OrderBook.hpp"
#include "visualise_helper.hpp"

void CLOB_simple_test()
{
	OrderBook book;
	display_aggregate_order_book(book);

	// redirect std out to out.txt
	// std::ofstream out("out.txt");
  // std::streambuf *coutbuf = std::cout.rdbuf(); //save old buf
  // std::cout.rdbuf(out.rdbuf()); //redirect std::cout to out.txt!

	book.open(0.1, 0.01, std::cout); // return values ignored in this example
	display_aggregate_order_book(book);

	std::cerr << "*********************\n";
	std::cerr << "Block A - there should be no matches yet\n";
	std::cerr << "*********************\n";
	book.submit_order(1u, SellBuyType::SELL, 10.1, 100u);
	display_aggregate_order_book(book);
	book.submit_order(2u, SellBuyType::SELL, 10.3, 75u);
	display_aggregate_order_book(book);
	book.submit_order(3u, SellBuyType::BUY, 9.8, 200u);
	display_aggregate_order_book(book);
	book.submit_order(4u, SellBuyType::BUY, 10.0, 150u);
	display_aggregate_order_book(book);
	book.submit_order(5u, SellBuyType::BUY, 9.9, 100u);
	display_aggregate_order_book(book);
	book.submit_order(6u, SellBuyType::SELL, 10.1, 50u); // this entry shares the same price as a previous entry
	display_aggregate_order_book(book);
	book.print_order_info(std::cout, 1u);

	std::cerr << "*********************\n";
	std::cerr << "Block B - there should be a match\n";
	std::cerr << "*********************\n";
	book.submit_order(9u, SellBuyType::BUY, 10.2, 200u);
	book.print_order_info(std::cout, 1u);
	book.print_order_info(std::cout, 9u);
	display_aggregate_order_book(book);

	std::cerr << "*********************\n";
	std::cerr << "Block C - manipulating existing orders\n";
	std::cerr << "*********************\n";
	book.cancel_order(5u);
	book.print_order_info(std::cout, 5u);
	display_aggregate_order_book(book);

	book.change_order(3u, 9.8, 175u);
	display_aggregate_order_book(book);
	book.change_order(2u, 9.9, 75u);
	display_aggregate_order_book(book);

	std::cerr << "*********************\n";
	std::cerr << "Block D - invalid orders/actions\n";
	std::cerr << "*********************\n";
	book.cancel_order(5u);
	book.cancel_order(9u);
	book.cancel_order(50u);
	book.print_order_info(std::cout, 50u);
	book.submit_order(15u, SellBuyType::SELL, 10.15, 50u);

	book.change_order(50u, 10.1, 50u);
	book.change_order(3u, 9.8, 180u);

	std::cerr << "*********************\n";
	std::cerr << "Block E - end of the first day's trading\n";
	std::cerr << "*********************\n";
	book.close();
	book.print_order_info(std::cout, 3u);
	display_aggregate_order_book(book);

	std::cerr << "*********************\n";
	std::cerr << "End\n";
	std::cerr << "*********************\n";

	// std::cout.rdbuf(coutbuf); // reset
}

int main()
{
	CLOB_simple_test();
	return EXIT_SUCCESS;
}
