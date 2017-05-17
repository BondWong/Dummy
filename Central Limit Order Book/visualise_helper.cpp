#include "visualise_helper.hpp"
#include "OrderBook.hpp"

//__declspec(dllimport)
void display_aggregate_order_book(const VisualiseData & vd, DisplayType dt);

void display_aggregate_order_book(const OrderBook & ob)
{
	VisualiseData vd(ob);

	// choose any one of (or indeed, any combination of) the following:
	// display_aggregate_order_book(vd, DisplayType::NONE);
	// display_aggregate_order_book(vd, DisplayType::CONSOLE);
	display_aggregate_order_book(vd, DisplayType::GRAPHICS);
}

AggregatedQuoteTypeFormatted::AggregatedQuoteTypeFormatted
	(const OrderBook& ob, const AggregatedQuoteType& a)
	: m_price(ob.format_price(a.m_price)),
	  m_volume(a.m_volume),
      m_number_of_orders(a.m_number_of_orders){}

VisualiseData::VisualiseData(const OrderBook& ob){
	auto b = ob.get_aggregated_order_book(SellBuyType::BUY);
	auto s = ob.get_aggregated_order_book(SellBuyType::SELL);
	m_buy.reserve(b.size());
	for(const auto& i : b)
		m_buy.push_back(AggregatedQuoteTypeFormatted(ob,i));
	m_sell.reserve(s.size());
	for(const auto& i : s)
		m_sell.push_back(AggregatedQuoteTypeFormatted(ob,i));
}
