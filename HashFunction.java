package org.drexel.cas.domain;
class HashFunction {
    /**
     * @param key: A String you should hash
     * @param HASH_SIZE: An integer
     * @return an integer
     */
    public int hashCode(char[] key,int HASH_SIZE) {
        if (key == null || key.length == 0) {
            return 0;
        }
        
        int res = 0;
        int base = 1;
        // (a * b) % c = (a % c) * (b % c)
        // (a + b) % c = a % c + b % c
        for (int i = key.length - 1; i >= 0; i--) {
            res += modMultiply((int)key[i], base, HASH_SIZE);
            res %= HASH_SIZE;
            base = modMultiply(base, 33, HASH_SIZE);
        }
        return res;
    }
    public int modMultiply(long a, long b, int HASH_SIZE){        
        long temp = a * b % HASH_SIZE;
        return (int) temp;
    }
};