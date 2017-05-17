// My University number is: *** to be filled in ***

#ifndef HASHHEAP
#define HASHHEAP

#include <vector>
#include <unordered_map>
#include <algorithm>
#include <iostream>

#include "CLOB_shared.hpp"

/*
 *  HashHeap class. It is a data structure combines hash table and heap
 *  Important methods performace: push(logn), top(1), pop(logn), erase(logn), get(1), get_all(nlogn);
 */
template<class K, class V>
class HashHeap {

private:
  struct cmp {
    // in c++, smaller has higher priority
    // but in our case, larger has higher priority
    bool operator() (V i, V j) { return !(i < j);}
  } cmpobj;
  std::vector<V> _heap;
  // hash table to storage active element index in heap
  std::unordered_map<K, int> _hashmap;
  // extra hash table to storage inactive element
  std::unordered_map<K, V> _storeage;

  int _parent(int index) {
    return (index - 1) / 2;
  }
  int _left_child(int index) {
    return index * 2 + 1;
  }
  int _right_child(int index) {
    return index * 2 + 2;
  }
  bool _comp(const V &obj1, const V &obj2) {
    return obj1 < obj2;
  }
  // swap place between two element
  void _swap(int index1, int index2) {
    std::swap(_heap[index1], _heap[index2]);
    // only need to swap id, since we swap elements in heap alread
    std::swap(_hashmap[_heap[index1].get_id()], _hashmap[_heap[index2].get_id()]);
  }
  // maintaining heap by floating element up
  void _heapify_up(int index) {
    // if element has higher priority, sawp it up with its parent
    while(_parent(index) >= 0 && _comp(_heap[_parent(index)], _heap[index])) {
      _swap(index, _parent(index));
      index = _parent(index);
    }
  }
  // maintaining heap by floating element down
  void _heapify_down(int index) {
    // if element has lower priority, swap it down with its largest child
    int size = _heap.size();
    while (index < size) {
      int left = _left_child(index);
      int right = _right_child(index);
      int temp = index;
      if (left < size && _comp(_heap[temp], _heap[left])) {
        temp = left;
      }
      if (right < size && _comp(_heap[temp], _heap[right])) {
        temp = right;
      }
      if (temp != index) {
        _swap(temp, index);
        index = temp;
      } else {
        break;
      }
    }
  }

public:
  HashHeap() {}

  int size() const {
    return _heap.size();
  }

  bool empty() const {
    return size() == 0;
  }

  bool contains(K k) const {
    if (_hashmap.find(k) != _hashmap.end()) {
      return true;
    }
    if (_storeage.find(k) != _storeage.end()) {
      return true;
    }

    return false;
  }

  std::vector<V> get_all() const {
    std::vector<V> vec;
    vec = _heap;
    // sort
    std::sort(vec.begin(), vec.end(), cmpobj);

    return vec;
  }

  // Note: check contains before use
  V get(const K k) const {
    // if it is an active element
    if (_hashmap.find(k) != _hashmap.end()) {
      auto it = _hashmap.find(k);
      return _heap[it->second];
    }

    // if it is an inactive element
    auto it = _storeage.find(k);
    return it->second;
  }

  // Note: check contains before use.
  V& get(K k) {
    if (_hashmap.find(k) != _hashmap.end()) {
      return _heap[_hashmap[k]];
    }

    return _storeage[k];
  }

  // adding element to the data structure
  void push(V v) {
    _heap.push_back(v);
    _hashmap[v.get_id()] = _heap.size() - 1;

    // maintain the heap
    _heapify_up(_heap.size() - 1);
  }

  // return the first element and remove it
  V pop() {
    V v = top();
    erase(v);
    return v;
  }

  // return the first element
  V& top() {
    return _heap[0];
  }

  // remove element
  void erase(V v) {
    int index = _hashmap[v.get_id()];
    _swap(index, _heap.size() - 1);

    _heap.pop_back();
    _hashmap.erase(v.get_id());

    // no element left or remove the last one
    if (_heap.size() == 0 || index == _heap.size()) {
      return;
    }

    // maintain heap
    if (_parent(index) >= 0 && _comp(_heap[_parent(index)], _heap[index])) {
      _heapify_up(index);
    } else {
      _heapify_down(index);
    }
  }

  // remove element into storeage
  void remove(K k) {
    V v = get(k);
    erase(v);

    // everything is removed will be stored in _storeage
    _storeage[k] = v;
  }

  void clear() {
    _heap.clear();
    _hashmap.clear();
    _storeage.clear();
  }
};

#endif
