package drexel.cci.cs576.stable_priority_queue;

import org.junit.Test;

import junit.framework.TestCase;

public class TestStablePriorityQueue extends TestCase {

	@Test
	public void testInsertWithinSize() {
		PriorityQueue queue = new StablePriorityQueue(10);
		assertTrue(queue.insert(1));
		assertTrue(queue.insert(2));
		assertTrue(queue.insert(3));
		assertTrue(queue.insert(4));
		assertTrue(queue.insert(5));
		assertTrue(queue.insert(6));
		assertTrue(queue.insert(7));
		assertTrue(queue.insert(8));
		assertTrue(queue.insert(9));
		assertTrue(queue.insert(10));
	}

	@Test
	public void testInsertExceedSize() {
		PriorityQueue queue = new StablePriorityQueue(5);
		assertTrue(queue.insert(1));
		assertTrue(queue.insert(2));
		assertTrue(queue.insert(3));
		assertTrue(queue.insert(4));
		assertTrue(queue.insert(5));
		assertFalse(queue.insert(6));
		assertFalse(queue.insert(7));
		assertFalse(queue.insert(8));
		assertFalse(queue.insert(9));
		assertFalse(queue.insert(10));
	}

	@Test
	public void testPriorityWithoutDuplicate() {
		PriorityQueue queue = new StablePriorityQueue(10);
		for (int i = 0; i < 10; i++) {
			queue.insert(i);
		}
		for (int i = 9; i >= 0; i--) {
			assertEquals(i, queue.pop());
		}
	}

	// test wether it is stable
	@Test
	public void testPriorityWithDuplicate() {
		StablePriorityQueue queue = new StablePriorityQueue(10);
		for (int i = 0; i < 10; i++) {
			queue.insert(10);
		}
		for (int i = 9; i >= 0; i -= 2) {
			StablePriorityQueue.Node node1 = queue.popNode();
			StablePriorityQueue.Node node2 = queue.popNode();

			assertTrue(node1.age > node2.age);
		}
	}

	@Test
	public void testPeek() {
		PriorityQueue queue = new StablePriorityQueue(10);
		for (int i = 0; i < 10; i++) {
			queue.insert(i);
		}
		for (int i = 9; i >= 0; i--) {
			assertEquals(9, queue.peek());
		}
	}
}
