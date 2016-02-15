import java.util.ArrayList;
import java.util.LinkedList;

public class HashTable<K, V> {
	private static final int FILLINGRATE = 2;

	private static class Entry<K, V> {
		private K key;
		private V value;

		public Entry(K key, V value) {
			this.key = key;
			this.value = value;
		}

		public void setValue(V value) {
			this.value = value;
		}

		public V getValue() {
			return this.value;
		}

		public K getKey() {
			return this.key;
		}
	}

	private int capacity = 200;
	private int size = 0;
	private ArrayList<LinkedList<Entry<K, V>>> array;

	public HashTable() {
		this.array = new ArrayList<>();
		fill(this.array, this.capacity);
	}

	public void put(K key, V value) {
		int index = key == null ? 0 : key.hashCode() % this.capacity;
		Entry<K, V> entry = new Entry<>(key, value);
		put(index, entry);
	}

	public V get(V key) {
		int index = key == null ? 0 : key.hashCode() % this.capacity;

		for (Entry<K, V> entry : this.array.get(index))
			if (entry.getKey() == null || entry.getKey().equals(key))
				return entry.getValue();

		return null;
	}

	private void put(int index, Entry<K, V> entry) {
		if (this.size == this.capacity * FILLINGRATE)
			rehash();

		for (Entry<K, V> e : this.array.get(index))
			if (e.getKey() == null || e.getKey().equals(entry.getKey())) {
				e.setValue(entry.getValue());
				return;
			}

		this.array.get(index).add(entry);
		this.size++;
	}

	private void rehash() {
		this.size = 0;
		this.capacity *= 2;

		ArrayList<LinkedList<Entry<K, V>>> newArray = new ArrayList<>();
		fill(newArray, this.capacity);
		ArrayList<LinkedList<Entry<K, V>>> oldArray = new ArrayList<>(this.array);
		this.array = newArray;

		for (LinkedList<Entry<K, V>> entries : oldArray)
			for (Entry<K, V> entry : entries)
				put(entry.getKey(), entry.getValue());

	}

	private void fill(ArrayList<LinkedList<Entry<K, V>>> array, int length) {
		for (int i = 0; i < length; i++)
			array.add(new LinkedList<Entry<K, V>>());
	}
}
