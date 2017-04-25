// codes should run in repl

'use strict';

console.log(this === global);

function f() {
	return this;
}
console.log(f() === global);

var f2 = (() => this);
console.log(f2() === global);

var obj = {f2: f2};
console.log(obj.f2() == global);

var obj1 = {bar: function() {
	var x = (() => this);
	return x;
}};
var f3 = obj1.bar();
console.log(f3() === obj1);
var f4 = obj1.bar;
console.log(f4()() === global);