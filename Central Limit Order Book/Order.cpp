// My University number is: *** to be filled in ***
#include <iostream>
#include <cstdlib>
#include <cmath>
// #include <cppunit/ui/text/TestRunner.h>

#include "Order.hpp"

Order::Order() {}

Order::Order(OrderIdentifierType id, SellBuyType type, OrderStatusType status,
  VolumeType volume, VolumeType executed_volume, PriceType price,
  PriceType tolerance): _id(id),
  _type(type), _status(status), _volume(volume), _executed_volume(executed_volume),
  _price(price), _tolerance(tolerance) {
    // update time when create a new Order
    _timestamp = ++CLOB_timestamp;
  }

OrderIdentifierType Order::get_id() const {
  return _id;
}

SellBuyType Order::get_type () const {
  return _type;
}

VolumeType Order::get_volume () const {
  return _volume;
}

VolumeType Order::get_executed_volume() const {
  return _executed_volume;
}

OrderStatusType Order::get_status() const {
  return _status;
}

void Order::set_type(SellBuyType type) {
  _type = type;
}

void Order::set_status(OrderStatusType status) {
  _status = status;
}

void Order::set_volume(VolumeType volume) {
  _volume = volume;
}

void Order::set_executed_volume(VolumeType executed_volume) {
  _executed_volume = executed_volume;
}

void Order::set_price(PriceType price) {
  _price = price;
}

PriceType Order::get_price() const {
  return _price;
}

TimeType Order::get_timestamp() const {
  return _timestamp;
}

bool Order::operator<(const Order& order) const {
  if (_type == SellBuyType::SELL) {
    // difference not less then 2 * _tolerance means not equal
    if (std::abs(_price - order.get_price()) >= 2 * _tolerance && _price > order.get_price()) {
      return true;
    }
    if (std::abs(_price - order.get_price()) < 2 * _tolerance && _timestamp > order.get_timestamp()) {
      return true;
    }
  }

  if (_type == SellBuyType::BUY) {
    // difference not less then 2 * _tolerance means not equal
    if (std::abs(_price - order.get_price()) >= 2 * _tolerance && _price < order.get_price()) {
      return true;
    }
    if (std::abs(_price - order.get_price()) < 2 * _tolerance && _timestamp > order.get_timestamp()) {
      return true;
    }
  }

  return false;
}

void Order::deactivate() {
  // unexecuted
  if (_executed_volume == 0) {
    _status = OrderStatusType::EXPIRED;
  }
  // partially executed
  if (_executed_volume != 0) {
    _volume = _executed_volume;
    _status = OrderStatusType::FILLED;
  }
}
