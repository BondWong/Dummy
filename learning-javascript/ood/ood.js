'use strict';

var obj = {
  hello: 'world'
};
console.log(obj.__proto__); // return prototype
console.log(obj.__proto__.__proto__); // return prototype's property, which is null

var obj1 = {
  a: 1,
  m: function() {
    console.log('hi');
  }
};
// create an object with prototype link to obj1
var p = Object.create(obj1);
console.log(p.a);
p.m();

var obj2 = {
  a: 1
}; // obj2 ---> Object.property ---> null
var obj3 = ['hello', 'word']; // obj3 ---> Array.prototype ---> Object.prototype ---> null
// f ---> Funnction.prototype ---> Object.prototype ---> null
function f() {
  return 1;
}

function Obj() {
  this.a = [];
  this.b = [];
}

Obj.prototype = {
  m: function(num) {
    this.a.push(num);
  }
};

var obj4 = new Obj();
// obj4 is an object with own properties 'a' and 'b'.
// obj4.__proto__ is the value of Obj.prototype when new Obj() is executed.

var obj5 = Object.create(obj4);
// obj5 ---> obj4 ---> Obj.prototype ---> Object.prototype ---> null
