// My University number is: *** to be filled in ***
#ifndef CLOB_SHARED_HPP
#define CLOB_SHARED_HPP

enum class SellBuyType : unsigned {SELL = 0, BUY = 1};
enum class OrderStatusType : unsigned {
  ACTIVE = 0, FILLED = 1, CANCELLED = 2, EXPIRED = 3
};

// enum string arry.
static const char * SellBuyTypeStrings[] = { "SELL", "BUY" };
static const char * OrderStatusTypeStrings[] = { "ACTIVE", "FILLED", "CANCELLED", "EXPIRED" };

// use enum number to convert it into string
static const char * get_sellbuytype_str( int enumVal )
{
  return SellBuyTypeStrings[enumVal];
}

// use enum number to convert it into string
static const char * get_orderstatustype_str( int enumVal )
{
  return OrderStatusTypeStrings[enumVal];
}

typedef unsigned long OrderIdentifierType;
typedef double PriceType;
typedef unsigned long VolumeType;
typedef unsigned long TimeType;

#endif // CLOB_SHARED_HPP
