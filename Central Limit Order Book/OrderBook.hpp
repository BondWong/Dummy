// My University number is: *** to be filled in ***
#ifndef ORDER_BOOK_HPP
#define ORDER_BOOK_HPP

#include <vector>
#include <ostream>

#include "CLOB_shared.hpp"
#include "AggregatedQuoteType.hpp"
#include "HashHeap.hpp"
#include "Order.hpp"

class OrderBook
{
	public:

		OrderBook ();
		~OrderBook();

		bool open (PriceType tick_size, PriceType tolerance, std::ostream &log);

		bool close ();

		bool submit_order (OrderIdentifierType order_id, SellBuyType sb, PriceType price,
							VolumeType volume);

		bool change_order (OrderIdentifierType order_id, PriceType price, VolumeType volume);

		bool cancel_order (OrderIdentifierType order_id);

		void print_order_info (std::ostream & where, OrderIdentifierType order_id) const;

		std::string format_price (PriceType price) const;

		std::vector<AggregatedQuoteType> get_aggregated_order_book(SellBuyType which_side) const;

		// for testing
		int get_buy_queue_size() const;
		int get_sell_queue_size() const;

	private:

		PriceType _tick_size;
		PriceType _tolerance;
		bool _is_close;
		std::ostream _logger;
		// hashheap for buy orders and sell orders
		HashHeap<OrderIdentifierType, Order> _hashheap_buy;
		HashHeap<OrderIdentifierType, Order> _hashheap_sell;

		void _execute(Order &order);
		int _price_cmp(PriceType p1, PriceType p2) const;
		void _deactivate_orders(HashHeap<OrderIdentifierType, Order>& hashheap);
		bool _change_order (Order order, PriceType price, VolumeType volume);
		bool _cancel_order (Order& order);

};



#endif // ORDER_BOOK_HPP
