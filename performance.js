'use strict';

var obj = {
  prop1: {
    prop1_1: {
      prop1_1_1: 'hi'
    }
  }
};

var start = new Date();
for (var i = 0; i < 1000000; i++) {
  obj["prop1"]["prop1_1"]["prop1_1_1 "];
}
var duration1 = new Date() - start;

function getProperty(obj, path) {
  if (path.length == 1)
    return obj[path[0]];
  return getProperty(obj[path[0]], path.slice(1));
}

var start = new Date();
for (var i = 0; i < 1000000; i++) {
  getProperty(obj, ["prop1", "prop1_1", "prop1_1_1"]);
}
var duration2 = new Date() - start;

console.log(duration1);
console.log(duration2);
