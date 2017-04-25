# This

The `this` keyword works differently in JavaScript compared to other languages. In this note, I focus on this keyword behavior in Node.js. The behavior is under strict mode.

## Global context

`this` equals to global object in Node.js. Global object is the object that contains a set of globally accessible objects in all modules. 

`'use strict';
console.log(this === global); \\ return true`


