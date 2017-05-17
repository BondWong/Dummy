// My University number is: *** to be filled in ***
#include <cstdio>
#include <iostream>
#include <cmath>
#include <string>

#include "OrderBook.hpp"

int OrderBook::_price_cmp(PriceType p1, PriceType p2) const {
	// equals
	if (std::abs(p1 - p2) < 2 * _tolerance) {
		return 0;
	}
	// smaller
	else if (p1 < p2) {
		return -1;
	}
	// larger
	else {
		return 1;
	}
}

// deactivate orders
void OrderBook::_deactivate_orders(HashHeap<OrderIdentifierType, Order>& hashheap) {
	// deactivate orders
	while (!hashheap.empty()) {
		Order& order = hashheap.top();
		// order deactivate
		order.deactivate();
		// move into hashheap's storage
		hashheap.remove(order.get_id());
	}
}

// execute order
void OrderBook::_execute(Order &order) {
		int cmp_criteria = 1;
		HashHeap<OrderIdentifierType, Order>* hashheap = NULL;
		SellBuyType matching_type = SellBuyType::SELL;
		// specify hashheap
		if (order.get_type() == SellBuyType::SELL) {
			cmp_criteria = 1;
			matching_type = SellBuyType::BUY;
			hashheap = &_hashheap_buy;
		} else {
			cmp_criteria = -1;
			matching_type = SellBuyType::SELL;
			hashheap = &_hashheap_sell;
		}


		HashHeap<OrderIdentifierType, Order> temp;
		// finding the best waiting order to consume
		while (!hashheap->empty()
			&& _price_cmp(order.get_price(), hashheap->top().get_price()) == cmp_criteria) {
			temp.push(hashheap->pop());
		}

		// execute if available pending orders are found
		while (!hashheap->empty() && order.get_status() == OrderStatusType::ACTIVE
			&& _price_cmp(order.get_price(), hashheap->top().get_price()) != cmp_criteria) {

			_logger << "Transaction: " << get_sellbuytype_str(static_cast<unsigned>(matching_type))
			<< "=" << hashheap->top().get_id()
			<< ", " << get_sellbuytype_str(static_cast<unsigned>(order.get_type())) << "=" << order.get_id()
			<< ", price=" << format_price(hashheap->top().get_price())
			<< ", volume=";

			// if order volume larger than executable pending volume, remove the pending order from hashheap
			VolumeType ava_order_vol = order.get_volume() - order.get_executed_volume();
			VolumeType ava_matching_vol = hashheap->top().get_volume() - hashheap->top().get_executed_volume();
			if (ava_order_vol > ava_matching_vol) {
				_logger << ava_matching_vol  << "." << std::endl;

				order.set_executed_volume(order.get_executed_volume() + ava_matching_vol);
				hashheap->top().set_executed_volume(hashheap->top().get_volume());
				hashheap->top().set_status(OrderStatusType::FILLED);
				hashheap->remove(hashheap->top().get_id());
			}
			// if smaller, order status changed and never go to hashheap
			else if (ava_order_vol < ava_matching_vol) {
					_logger << ava_order_vol  << "." << std::endl;
					hashheap->top().set_executed_volume(hashheap->top().get_executed_volume() + ava_order_vol);
					order.set_executed_volume(order.get_volume());
					order.set_status(OrderStatusType::FILLED);

			}
			// if equals, remove corresponding order from hashheap, and order never go to hashheap
			else {
					_logger << ava_order_vol << "." << std::endl;

					hashheap->top().set_executed_volume(hashheap->top().get_volume());
					order.set_executed_volume(order.get_volume());
					order.set_status(OrderStatusType::FILLED);
					hashheap->top().set_status(OrderStatusType::FILLED);
					hashheap->remove(hashheap->top().get_id());

			}

		}

		// push order back
		while (!temp.empty()) {
			hashheap->push(temp.pop());
		}

}

// change order helper function
bool OrderBook::_change_order (Order order, PriceType price, VolumeType volume) {
	if (order.get_status() == OrderStatusType::CANCELLED) {
		// _logger << "Error: [change_order] Order is alread cancelled" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	if (order.get_status() == OrderStatusType::EXPIRED) {
		// _logger << "Error: [change_order] Order is already expired" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	if (order.get_status() == OrderStatusType::FILLED) {
		// _logger << "Error: [change_order] Order is already filled" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	// since volume is unsigned type
	if (volume == 0) {
		// _logger << "Error: [change_order] Invalid volume" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	if (order.get_executed_volume() > volume) {
		// _logger << "Error: [change_order] Volume can not be less than executed volume" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	if (order.get_volume() < volume) {
		// _logger << "Error: [change_order] Volume can not be greated than existed volume" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	if (price <= 0) {
		// _logger << "Error: [change_order] Invalide price" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	if (fmod(price * 10, _tick_size * 10) > _tolerance) {
		// _logger << "Error: [change_order] Invalid price" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	_logger << "Order changed: ID=" << order.get_id()
	<< ", type=" << get_sellbuytype_str(static_cast<unsigned>(order.get_type()))
	<< ", price=" << format_price(price)
	<< ", volume=" << volume << "." << std::endl;

	// same old, not need to update
	if (order.get_volume() == volume && order.get_price() == price) {
		return true;
	}

	HashHeap<OrderIdentifierType, Order>* hashheap = NULL;
	if (order.get_type() == SellBuyType::SELL) {
		hashheap = &_hashheap_sell;
	} else {
		hashheap = &_hashheap_buy;
	}

	 // erase it
	 hashheap->erase(order);
	 //update, and push back
	 order.set_price(price);
	 order.set_volume(volume);

	 // if the order is filled. move to storage
	 if (order.get_volume() == order.get_executed_volume()) {
		 order.set_status(OrderStatusType::FILLED);
		 hashheap->push(order);
		 hashheap->remove(order.get_id());
		 return true;
	 }

	 // try to execute the newly updated order
	 _execute(order);
	 if (order.get_status() == OrderStatusType::FILLED) {
		 hashheap->push(order);
		 hashheap->remove(order.get_id());
	 } else {
		 hashheap->push(order);
	 }

	 return true;
}

// cancel order helper function
bool OrderBook::_cancel_order (Order& order) {
	if (order.get_status() == OrderStatusType::CANCELLED) {
		// _logger << "Error: [cancel_order] Order is alread cancelled" << std::endl;
		_logger << "Order " << order.get_id() << " cannot be cancelled." << std::endl;
		return false;
	}

	if (order.get_status() == OrderStatusType::EXPIRED) {
		// _logger << "Error: [cancel_order] Order is already expired" << std::endl;
		_logger << "Order " << order.get_id() << " cannot be cancelled." << std::endl;
		return false;
	}

	if (order.get_status() == OrderStatusType::FILLED) {
		// _logger << "Error: [cancel_order] Order is already filled" << std::endl;
		_logger << "Order " << order.get_id() << " cannot be cancelled." << std::endl;
		return false;
	}

	// cancel order
	HashHeap<OrderIdentifierType, Order>* hashheap = NULL;
	if (order.get_type() == SellBuyType::SELL) {
		hashheap = &_hashheap_sell;
	} else {
		hashheap = &_hashheap_buy;
	}

	// cancel non executed order
	if (order.get_executed_volume() == 0) {
		order.set_status(OrderStatusType::CANCELLED);
		hashheap->remove(order.get_id());
	}
	// cancel partially executed order
	else {
		order.set_volume(order.get_executed_volume());
		order.set_status(OrderStatusType::FILLED);
		hashheap->remove(order.get_id());
	}

	_logger << "Order " << order.get_id() << " cancelled." << std::endl;
	return true;
}

OrderBook::OrderBook () : _tick_size(4), _tolerance(0),_is_close(true), _logger(NULL)
{
	// set default output
	_logger.rdbuf(std::cerr.rdbuf());
}

OrderBook::~OrderBook() {
	// cleaning
	_hashheap_buy.clear();
	_hashheap_sell.clear();
	_logger.clear();
	// reset default output
	_logger.rdbuf(std::cerr.rdbuf());
}

bool OrderBook::open (PriceType tick_size, PriceType tolerance, std::ostream &log)
{

	if (!_is_close) {
		// _logger << "Error: [open] Order book is already opened" << std::endl;
		return false;
	}
	if (tick_size < 0){
		// _logger << "Error: [open] Invalid tick size argument"<< std::endl;
		return false;
	}
	if (tolerance > tick_size / 10) {
		// _logger << "Error: [open] Invalid tolerance argument" << std::endl;
		return false;
	}
	if (!log.good()) {
		// _logger << "Error: [open] Log stream is bad" << std::endl;
		return false;
	}

	_is_close = false;
	_tick_size = tick_size;
	_tolerance = tolerance;
	// set output to log
	_logger.rdbuf(log.rdbuf());

	_logger << "Order book open." << std::endl;

	return true;
}

bool OrderBook::close ()
{
	if (_is_close) {
		// _logger << "Error: [close] Order book is already closed" << std::endl;
		return false;
	}

	_is_close = true;

	// deactivate orders
	_deactivate_orders(_hashheap_buy);
	_deactivate_orders(_hashheap_sell);

	_logger << "Order book closed." << std::endl;
	return true;
}

int OrderBook::get_buy_queue_size() const {
	return _hashheap_buy.size();
}

int OrderBook::get_sell_queue_size() const {
	return _hashheap_sell.size();
}

bool OrderBook::submit_order (OrderIdentifierType order_id, SellBuyType sb, PriceType price,
	VolumeType volume)
{
	if (_is_close) {
		// _logger << "Error: [submit_order] Order book is closed" << std::endl;
		_logger << "Order not accepted." << std::endl;
		return false;
	}

	if (volume == 0) {
		// _logger << "Error: [submit_order] Invalid volume" << std::endl;
		_logger << "Order not accepted." << std::endl;
		return false;
	}

	if (price <= 0) {
		// _logger << "Error: [submit_order] Price must be greater than zero" << std::endl;
		_logger << "Order not accepted." << std::endl;
		return false;
	}

	// avoid floating point inpreception problem by multiplying 10
	if (fmod(price * 10, _tick_size * 10) > _tolerance) {
		// _logger << "Error: [submit_order] Invalid price" << std::endl;
		_logger << "Order not accepted." << std::endl;
		return false;
	}

	if (_hashheap_sell.contains(order_id) || _hashheap_buy.contains(order_id)) {
		// _logger << "Error: [submit_order] Order is alread existed" << std::endl;
		_logger << "Order not accepted." << std::endl;
		return false;
	}

	_logger << "Order submitted: ID=" << order_id << ", type="
	<< get_sellbuytype_str(static_cast<unsigned>(sb)) << ", price="
	<< format_price(price) << ", volume=" << volume << "." << std::endl;

	Order order = Order(order_id, sb, OrderStatusType::ACTIVE, volume, 0u, price, _tolerance);
	// execute
	_execute(order);
	// put into order book if the order is still active
	if (order.get_status() == OrderStatusType::ACTIVE
		&& order.get_type() == SellBuyType::SELL) {
		_hashheap_sell.push(order);
	}
	if (order.get_status() == OrderStatusType::ACTIVE
		&& order.get_type() == SellBuyType::BUY) {
		_hashheap_buy.push(order);
	}

	return true;
}

bool OrderBook::change_order (OrderIdentifierType order_id, PriceType price, VolumeType volume)
{
	if (_is_close) {
		// _logger << "Error: [change_order] Order book is closed" << std::endl;
		_logger << "Order change rejected." << std::endl;
		return false;
	}

	if (_hashheap_buy.contains(order_id)) {
		return _change_order(_hashheap_buy.get(order_id), price, volume);
	}
	if (_hashheap_sell.contains(order_id)) {
		return _change_order(_hashheap_sell.get(order_id), price, volume);
	}

	_logger << "Order " << order_id << " not found." << std::endl;
	// _logger << "Error: [change_order] Order not found" << std::endl;
	return false;
}

bool OrderBook::cancel_order (OrderIdentifierType order_id)
{
	if (_is_close) {
		// _logger << "Error: [cancel_order] Order book is closed" << std::endl;
		_logger << "Order " << order_id << " cannot be cancelled." << std::endl;
		return false;
	}

	if (_hashheap_buy.contains(order_id)) {
		return _cancel_order(_hashheap_buy.get(order_id));
	}
	if (_hashheap_sell.contains(order_id)) {
		return _cancel_order(_hashheap_sell.get(order_id));
	}

	_logger << "Order " << order_id << " not found." << std::endl;
	// _logger << "Error: [cancel_order] Order not found" << std::endl;
	return false;
}

void OrderBook::print_order_info (std::ostream & where, OrderIdentifierType order_id) const
{
	if (!_hashheap_buy.contains(order_id) && !_hashheap_sell.contains(order_id)) {
		where << "Order " << order_id << " not found." << std::endl;
		return;
	}

	Order order;
	if (_hashheap_buy.contains(order_id)) {
		order = _hashheap_buy.get(order_id);
	}
	if (_hashheap_sell.contains(order_id)) {
		order = _hashheap_sell.get(order_id);
	}

	where << "Order information: ID=" << order.get_id()
		<< ", type=" << get_sellbuytype_str(static_cast<unsigned>(order.get_type()))
		<< ", price=" << format_price(order.get_price())
		<< ", total volume=" << order.get_volume()
		<< ", executed volume=" << order.get_executed_volume()
		<< ", status=" << get_orderstatustype_str(static_cast<unsigned>(order.get_status()))
		<< "." << std::endl;
}

std::string OrderBook::format_price (PriceType price) const
{
	// calculating fractional part length
	int length = 1 + -std::log10(_tick_size);
	// convert PriceType to string
	char str[1024] = "";
	memset(str, 0, 1024);
	std::sprintf(str, "%0.*f", length, price);
	return str;
}

std::vector<AggregatedQuoteType> OrderBook::get_aggregated_order_book(SellBuyType which_side) const
{
	std::vector<AggregatedQuoteType> ret;
	// specify hashheap
	std::vector<Order> temp;
	if (which_side == SellBuyType::SELL) {
		temp = _hashheap_sell.get_all();
	} else {
		temp = _hashheap_buy.get_all();
	}

	// aggregate
	std::unordered_map<PriceType, AggregatedQuoteType> map;
	for (auto order: temp) {
		// found new order with new price
		if (map.find(order.get_price()) == map.end()) {
			//initializing by putting new AggregatedQuoteType into hash table
			AggregatedQuoteType apt;
			apt.m_price = order.get_price();
			apt.m_volume = order.get_volume() - order.get_executed_volume();
			apt.m_number_of_orders = 1;
			map[order.get_price()] = apt;
		}
		// if order is in hash table, aggreate
		else {
			map[order.get_price()].m_volume += order.get_volume() - order.get_executed_volume();
			map[order.get_price()].m_number_of_orders++;
		}
	}

	// generate result
	for (auto order: temp) {
		if (map.find(order.get_price()) != map.end()) {
			ret.push_back(map[order.get_price()]);
			// remove from hash table to avoid duplicate
			map.erase(order.get_price());
		}

	}

	return ret;
}
