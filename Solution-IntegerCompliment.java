package com.jh.honeb;

public class Solution {
	public int getIntegerComplement(int n) {
		if (n == 0)
			return n;
		int result = 0;
		for (int i = 0; n >> i != 0; i++) {
			if (((n >> i) & 1) == 0)
				result = result | 1 << i;
		}

		return result;
	}

	public int getIntegerComplement2(int n) {
		if (n == 0) {
			return 0;
		}

		int tmp = n, left = 0;
		while (tmp != 0) {
			left = tmp;
			tmp = tmp & (tmp - 1); // eliminate a one every time
		}

		int mask = (left - 1) | left;
		return (~n) & mask;
	}

	public static void main(String args[]) {
		Solution solution = new Solution();
		int result = solution.getIntegerComplement(50);
		System.out.println(result);
	}

}

// A complement of a number is defined as the inversion (if the bit value =
// 0, change it to 1 and vice-versa) of all bits of the number starting from
// the leftmost bit that is set to 1. For example, if N = 5, N is
// represented as 101 in binary. The of N is 010, which is 2 in
// decimal notation. Similarly if N = 50, then the complement of N is 13.
// Complete the function getIntegerComplement(). This function accepts N as
// parameter. The function should return the complement of N.The section of
// the program which parses the input and displays the output will be
// handled by us. Your task is to complete the body of the function or
// method provided, and to return the correct output.
//
//
// Constraints :
// 0 ≤ N ≤ 100000.
//
// Sample Test Cases:
//
// Input #00:
// 50
//
// Output #00:
// 13
//
// Explanation:
//
// 50 in decimal form equals: 110010 when converted to binary.
// Inverting the bit sequence: 001101. This is the binary equivalent of
// decimal 13.
//
// Input #01:
// 100
//
// Output #01:
// 27
//
// Explanation:
//
// The bit sequence for 100 is 1100100. Inverting the sequence gives 0011011
// which is the binary equivalent of decimal 27.