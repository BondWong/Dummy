import java.util.Stack;

public class MaxTree {
	private static class TreeNode {
	     public int val;
	     public TreeNode left, right;
	     public TreeNode(int val) {
	         this.val = val;
	         this.left = this.right = null;
	     }
	 }
	
    /**
     * @param A: Given an integer array with no duplicates.
     * @return: The root of max tree.
     */
    public TreeNode maxTree(int[] A) {
        // write your code here
        if(A == null || A.length == 0) {
            return null;
        }
        
        Stack<TreeNode> stack = new Stack<>();
        for(int i = 0; i < A.length; i++) {
            TreeNode node = new TreeNode(A[i]);
            while(!stack.isEmpty() && node.val > stack.peek().val) {
                node.left = stack.pop();
            }
            if(!stack.isEmpty()) {
                stack.peek().right = node;
            }
            stack.push(node);
        }
        
        TreeNode max = null;
        while(!stack.isEmpty()) {
            max = stack.pop();
        }
        
        return max;
        
    }
    
}