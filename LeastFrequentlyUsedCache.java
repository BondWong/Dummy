public class LeastFrequentlyUsedCache {
    private static class Node {
        int key;
        int val;
        int times;
        int age;
        public Node(int key, int val, int times, int age) {
            this.key = key;
            this.val = val;
            this.times = times;
            this.age = age;
        }
    }

    private Map<Integer, Node> map;
    private int capacity;
    private int age;
    // @param capacity, an integer
    public LFUCache(int capacity) {
        // Write your code here
        map = new LeastFrequentlyUsedCache<>();
        this.capacity = capacity;
        age = Integer.MAX_VALUE;
    }

    // @param key, an integer
    // @param value, an integer
    // @return nothing
    public void set(int key, int value) {
        // Write your code here
        if(map.containsKey(key)) {
            map.get(key).times++;
            map.get(key).age = age--;
            map.get(key).val = value;
        } else {
            // kick out first in case the newly added is kicked out
            if(map.size() == capacity) {
                // kick out
                Queue<Node> priorityQueue = new PriorityQueue<>(map.size(), new Comparator<Node>() {
                    public int compare(Node n1, Node n2) {
                        if(n1.times == n2.times) return -(n1.age - n2.age);
                        return n1.times - n2.times;
                    }
                });
                for(Node node: map.values()) {
                    priorityQueue.offer(node);
                }
                map.remove(priorityQueue.peek().key);
            }
            
            map.put(key, new Node(key, value, 1, age--));
        }
    }

    public int get(int key) {
        // Write your code here
        if(!map.containsKey(key)) return -1;
        map.get(key).times++;
        map.get(key).age = age--;
        return map.get(key).val;
    }
}