# Object-Oriented Programming

Talking about OO language, the first few languages that pop out from our minds are Java and C++. Well, the first thing to clarify is that JavaScript is prototype-based language, even though now JavaScript has keyword `Class`.

## The prototype chain

In JavaScript, each object has a private property `__proto__` that links to another object called prototype.

The object is linked also, in term, has a property `__proto__` that links to other object as prototype, until null is reached. null has no prototype.

`var obj = {
  hello: 'world'
};
console.log(obj.__proto__); // return prototype
console.log(obj.__proto__.__proto__); // return prototype's property, which is null`

## Inheritance with prototype chain

JavaScript objects are dynamic "bags" of properties. When accessing a property of an object, it will be sought on the object first, and if not found, the prototype chain will be followed and searched. And this rule also apply to method.

`var obj1 = {
  a: 1,
  m: function() {
    console.log('hi');
  }
};
// create an object with prototype link to obj1
var p = Object.create(obj1);
console.log(p.a);
p.m();`

## Different ways to create object

Every object's default prototype links to Object.prototype, which has a prototype links to null.

### With object creation syntax

`var obj2 = {a: 1}; // obj2 ---> Object.property ---> null
var obj3 = ['hello', 'word']; // obj3 ---> Array.prototype ---> Object.prototype ---> null
// f ---> Funnction.prototype ---> Object.prototype ---> null
function f() {
  return 1;
}`

### With a constructor

From syntax standpoint, a constructor is just a function that happens to be called with `new`. It works like a blueprint that is used to create object. The constructor's properties will be new object's properties and its prototype will also be new object's prototype.

`function Obj() {
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
`
### With Object.create

Calling this method creates a new object. The prototype of this object is the first argument of this method.

`var obj5 = Object.create(obj4);
// obj5 ---> obj4 ---> Obj.prototype ---> Object.prototype ---> null`
