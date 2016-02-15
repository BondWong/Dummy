import java.util.*;
// you can also use imports, for example:
// import java.util.*;

// you can write to stdout for debugging purposes, e.g.
// System.out.println("this is a debug message");

class Solution {

    public int solution(String S) {
        // write your code in Java SE 
        if(S == null || S.length() == 0 || S.isEmpty()) {
            return -1;
        }
        int[] max = new int[S.length() + 1];
        for(int i = 0; i < max.length; i++) {
            max[i] = -1;
        }

        int lowerCount = 0;
        int upperCount = 0;
        boolean isValid = false;

        for(int i = 0; i < S.length(); i++) {
            if(isUpper(S.charAt(i)) {
                upperCount++;
                max[i + 1] = Math.max(max[i], lowerCount + upperCount);
                isValid = true;
            } else if(isNumber(S.charAt(i))) {
                lowerCount = 0;
                upperCount = 0;
                isValid = false;
                max[i + 1] = max[i];
            } else if(isLower(S.charAt(i)) && !isValid) {
                lowerCount++;
                max[i + 1] = max[i];
            } else if(isLower(S.charAt(i)) && isValid) {
                lowerCount++;
                max[i + 1] = Math.max(max[i], lowerCount + upperCount);
            }
        }

        return max[S.length()];
    }

    private boolean isUpper(char c) {
        return c >= 'A' && c <= 'Z';
    }

    private boolean isLower(char c) {
        return c >= 'a' && c <= 'z';
    }

    private boolean isNumber(char c) {
        return c >= '0' && c <= '9';
    }
}