# Ethereum Smart Contract Bug from Real Life Development

### uint256 Overflow

In smart contract development, number are usually of type uint256. When a number is larger than what a uint256 can represent, it overflows and becomes a number smaller. The effects is similar to this `100 + 100 = 2`, which should be 200.

### decimals
In solidity (the language uses to write smart contract), there is no float number. So the way to represent a float number is to store its decimals. For example: `number = 100.01` will become `value = 10001` and `decimals = 2`. Frontend will do this: `number = value / decimals` to present number.
Because of this, when we do calculation, we should keep decimals in mind. The following is a transfer function of a standard ERC20 token:
```
function transfer(address _to, uint _value) returns (bool success) {
  balances[msg.sender] = safeSub(balances[msg.sender], _value);
  balances[_to] = safeAdd(balances[_to], _value);
  Transfer(msg.sender, _to, _value);
  return true;
}
```
To make thing simple, let's assume this token has 8 decimals. In this case, if we want to transfer 10 tokens to someone, the input `_value` here should be `10 * 10 ** 8 = 1000000000`. 
