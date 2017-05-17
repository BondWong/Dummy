#ifndef AGGREGATED_QUOTE_TYPE_HPP
#define AGGREGATED_QUOTE_TYPE_HPP

#include "CLOB_shared.hpp"

class AggregatedQuoteType
{
public:
	PriceType m_price;
	VolumeType m_volume;
	unsigned long m_number_of_orders;

	AggregatedQuoteType()
		:m_price(0), m_volume(0),
			m_number_of_orders(0){}
};

#endif // AGGREGATED_QUOTE_TYPE_HPP
