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

function SomeConstructor() {
	this.a = 37;
}
var o = new SomeConstructor();
console.log(o.a);

function SomeConstructor2() {
	this.a = 37;
	return {a: 38};
}
o = new SomeConstructor2();
console.log(o.a);

function add(c, d) {
	return this.a + this.b + c + d;
}
var o = {a: 1, b: 3};
add.call(o, 5, 7);
add.apply(o, [10, 20]);

function f() {
	return this.a;
}
var g = f.bind({a: 'hi'});
console.log(g());
var h = g.bind({a: 'hey'});
console.log(h());
var o = {a: 37, f:f, g:g, h:h};
console.log(o.f(), o.g(), o.h());