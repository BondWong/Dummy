package drexel.cci.cs576.stable_priority_queue;

public class StablePriorityQueue implements PriorityQueue {
	public static class Node {
		int val;
		long age;

		public Node(int val, long age) {
			this.val = val;
			this.age = age;
		}
	}

	private long MAXAGE = Long.MAX_VALUE;
	private Node[] heap;
	private int length;

	public StablePriorityQueue(int capacity) {
		heap = new Node[capacity];
		length = 0;
	}

	public boolean insert(int val) {
		if (length == heap.length)
			return false;
		Node node = new Node(val, MAXAGE--);
		heap[length++] = node;

		for (int i = length / 2; i >= 0; i--) {
			maxHeapify(heap, i, length);
		}

		return true;
	}

	public int pop() {
		int val = heap[0].val;
		swap(heap, 0, --length);
		maxHeapify(heap, 0, length);

		return val;
	}

	public Node popNode() {
		Node node = heap[0];
		swap(heap, 0, --length);
		maxHeapify(heap, 0, length);

		return node;
	}

	public int peek() {
		return heap[0].val;
	}

	private void maxHeapify(Node[] heap, int i, int heapSize) {
		while (i < heapSize) {
			int left = i * 2 + 1;
			int right = i * 2 + 2;
			int max = i;

			if (left < heapSize && heap[left].val > heap[max].val) {
				max = left;
			} else if (left < heapSize && heap[left].val == heap[max].val && heap[left].age > heap[max].age) {
				max = left;
			}

			if (right < heapSize && heap[right].val > heap[max].val) {
				max = right;
			} else if (right < heapSize && heap[right].val == heap[max].val && heap[right].age > heap[max].age) {
				max = right;
			}

			if (max != i) {
				swap(heap, max, i);
				i = max;
			} else {
				break;
			}

		}
	}

	private void swap(Node[] queue, int i, int j) {
		Node temp = queue[i];
		queue[i] = queue[j];
		queue[j] = temp;
	}
}
