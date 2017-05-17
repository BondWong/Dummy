// My University number is: *** to be filled in ***
#ifndef ORDER_HPP
#define ORDER_HPP

#include "CLOB_shared.hpp"

// a relative time starts from 0;
static int CLOB_timestamp = 0;

/*
 *  Order class, representing order stored in OrderBook
 */
class Order {
public:
  // constructor
  Order();
  Order(OrderIdentifierType id);
  Order(OrderIdentifierType id, SellBuyType type, OrderStatusType status,
    VolumeType volume, VolumeType executed_volume, PriceType price,
    PriceType _tolerance);

  // getters
  OrderIdentifierType get_id() const;
  SellBuyType get_type() const;
  VolumeType get_volume() const;
  VolumeType get_executed_volume() const;
  OrderStatusType get_status() const;
  void set_type(SellBuyType type);
  void set_status(OrderStatusType status);
  void set_volume(VolumeType volume);
  void set_executed_volume(VolumeType executed_volume);
  void set_price(PriceType price);
  PriceType get_price() const;
  TimeType get_timestamp() const;

  // override < operator. will be used to compare Order
  bool operator<(const Order& order) const;
  // deactivate the order
  void deactivate() ;

private:
  // define private priperties
  OrderIdentifierType _id;
  SellBuyType _type;
  OrderStatusType _status;
  TimeType _timestamp;
  VolumeType _volume;
  VolumeType _executed_volume;
  PriceType _price;
  PriceType _tolerance;
};

#endif // ORDER_HPP
