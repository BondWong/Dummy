package edu.upenn.eCommerceCrawler;

import java.util.ArrayList;
import java.util.HashMap;

public class HashHeap {
	ArrayList<Integer> heap;
	String mode;
	int size;
	HashMap<Integer, Node> hash;

	class Node {
		// index in heap
		public Integer index;
		public Integer count;

		Node(Node node) {
			index = node.index;
			count = node.count;
		}

		Node(Integer index, Integer count) {

			this.index = index;
			this.count = count;
		}
	}

	public HashHeap(String mod) { // 传入min 表示最小堆，max 表示最大堆
		// TODO Auto-generated constructor stub
		heap = new ArrayList<Integer>();
		mode = mod;
		hash = new HashMap<Integer, Node>();
		size = 0;
	}

	public int peak() {
		return heap.get(0);
	}

	public int size() {
		return size;
	}

	public Boolean empty() {
		return (heap.size() == 0);
	}

	private int parent(int index) {
		if (index == 0) {
			return -1;
		}
		return (index - 1) / 2;
	}

	private int left(int index) {
		return index * 2 + 1;
	}

	private int right(int index) {
		return index * 2 + 2;
	}

	private boolean needSwap(int a, int b) {
		if (a <= b) {
			if (mode == "min")
				return false;
			else
				return true;
		} else {
			if (mode == "min")
				return true;
			else
				return false;
		}

	}

	private void swap(int indexA, int indexB) {
		int valA = heap.get(indexA);
		int valB = heap.get(indexB);

		int countA = hash.get(valA).count;
		int countB = hash.get(valB).count;
		hash.put(valB, new Node(indexA, countB));
		hash.put(valA, new Node(indexB, countA));
		heap.set(indexA, valB);
		heap.set(indexB, valA);
	}

	public Integer poll() {
		size--;
		Integer val = heap.get(0);
		Node hashnow = hash.get(val);
		if (hashnow.count == 1) {
			swap(0, heap.size() - 1);
			hash.remove(val);
			heap.remove(heap.size() - 1);
			if (heap.size() > 0) {
				downHeapify(0);
			}
		} else {
			hash.put(val, new Node(0, hashnow.count - 1));
		}
		return val;
	}

	public void add(int val) {
		size++;
		if (hash.containsKey(val)) {
			Node hashnow = hash.get(val);
			hash.put(val, new Node(hashnow.index, hashnow.count + 1));
		} else {
			heap.add(val);
			hash.put(val, new Node(heap.size() - 1, 1));
		}

		upHeapify(heap.size() - 1);
	}

	// hashmap makes it O(logn) to delete element
	public void delete(int val) {
		size--;
		Node node = hash.get(val);
		int index = node.index;
		int count = node.count;
		if (node.count == 1) {

			swap(index, heap.size() - 1);
			hash.remove(val);
			heap.remove(heap.size() - 1);
			if (heap.size() > index) {
				upHeapify(index);
				downHeapify(index);
			}
		} else {
			hash.put(val, new Node(index, count - 1));
		}
	}

	private void upHeapify(int index) {
		while (parent(index) > -1) {
			int parent = parent(index);
			if (!needSwap(heap.get(parent), heap.get(index))) {
				break;
			} else {
				swap(index, parent);
			}
			index = parent;
		}
	}

	private void downHeapify(int index) {
		while (index < heap.size()) {
			int left = left(index);
			int right = right(index);
			int son = index;
			if (left < heap.size() && needSwap(heap.get(son), heap.get(left))) {
				son = left;
			}
			if (right < heap.size() && needSwap(heap.get(son), heap.get(right))) {
				son = right;
			}
			if (son != index) {
				swap(index, son);
				index = son;
			} else {
				break;
			}
		}
	}

}