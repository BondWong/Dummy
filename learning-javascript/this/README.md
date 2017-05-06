# This

The `this` keyword works differently in JavaScript compared to other languages. In this note, I focus on this keyword behavior in Node.js. The behavior is under strict mode.

## Global context

`this` equals to global object in Node.js. Global object is the object that contains a set of globally accessible objects in all modules.

`'use strict';
console.log(this === global); // return true`

## Function context

`this` equals to whatever it was set to when entering the execution context.
`
'use strict';
function f() {
  return this;
}
console.log(f() === global); // return true`

When executing the function f, this was set to global, thus, the this inside the function is global.

In arrow functions, `this` is set lexically. It is set to the value of the enclosing execution context's this.

`var f2 = (() => this);
console.log(f2() === this); // return true`

The enclosing execution context in the above code is global context. Therefore, `this` is set to global. However, once the `this` in arrow function is set, it can not be changed anymore.

`var obj = {f2: f2};
console.log(obj.f2() === global); // return true`

The above code shows that we put the arrow function f2 to an object, which means the closest enclosing context is object obj. However, f2's `this` is still what it was before.

A more complicated example.

`var obj = {bar: function() {
	var x = (() => this);
	return x;
}};`

The above arrow function's `this` is set to the `this` of the enclosing function. The enclosing function's `this`, in term, depends on what it was set to when entering its execution context.

`var f3 = obj.bar();
console.log(f3() === obj); // return true`

The above codes calls obj's method. Therefore, `this` of the function is set to obj (will explain later). Since arrow function's `this` is set to the function's `this`, thus the comparison is true.

`var f4 = obj.bar;
console.log(f4()() === global)`

f4 executes in global context, therefore, the enclosing function's `this` is set to global, and so does the arrow function's `this`.

## In a constructor

When you call `new SomeConstructor()`,  what `this` is depends on whether your constructor has a `return`. If it doesn't, the result of `new SomeConstructor()` is `this` the constructor constructs. If it does, the result is the returning object.

`function SomeConstructor() {
	this.a = 37;
}
var o = new SomeConstructor();
console.log(o.a); // 37`

The above constructor has no return statement, therefore, the result is the `this`. Note that when entering the constructor, `this` is set to `{}`. Unlike normal function, `this` is set to what it was set before entering the function.

`function SomeConstructor2() {
	this.a = 37;
	return {a: 38};
}
o = new SomeConstructor2();
console.log(o.a); // 38`

The above constructor has return statement, therefore, the result is the returning object.

## Setting this to a particular object

### call and apply
We can set `this` to particular object by using call and apply.

`function add(c, d) {
	return this.a + this.b + c + d;
}
var o = {a: 1, b: 3};
// `this` is set to o, and the following sequent parameters are passed as arguments
add.call(o, 5, 7); // 1 + 3 + 5 + 7 = 16
// `this` is set to o, and the following list will be destructing to arguments
add.apply(o, [10, 20]); // 1 + 3 + 10 + 20 = 34`

### bind
Different from `call` and `apply`, `bind` set `this` permanently.
`function f() {
	return this.a;
}
var g = f.bind({a: 'hi'});
console.log(g()); // hi`

var h = g.bind({a: 'hey'});
console.log(h()); // hey

var o = {a: 37, f: f, g: g, h: h};
console.log(o.f(), o.g(), o.h()); // 37, hi, hi
