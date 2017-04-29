'use strict'

var exports = module.exports = {};

var id = 0;
var version = 0;
var processId = 0;
function getId() {
  return id++;
}
function getVersion() {
  return version++;
}
function getProcessId() {
  return processId++;
}
function wait(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

exports.getId = getId;
exports.getVersion = getVersion;
exports.getProcessId = getProcessId;
exports.wait = wait;
