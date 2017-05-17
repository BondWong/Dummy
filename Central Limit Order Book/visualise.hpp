#ifndef VISUALISE_HPP
#define VISUALISE_HPP

#include "AggregatedQuoteType.hpp"
#include <vector>
#include <string>

class OrderBook;
enum class DisplayType{CONSOLE,GRAPHICS,NONE,TEX};

class AggregatedQuoteTypeFormatted{
public:
	std::string m_price;
	VolumeType m_volume;
	unsigned long m_number_of_orders;
	AggregatedQuoteTypeFormatted(const OrderBook& ob,
								const AggregatedQuoteType& a);

};

class VisualiseData{
public:
	std::vector<AggregatedQuoteTypeFormatted> m_buy, m_sell;
	VisualiseData(const OrderBook& ob);
};

//void display_aggregate_order_book(const VisualiseData & vd, DisplayType dt);

#endif
