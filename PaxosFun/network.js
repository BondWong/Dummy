'use strict';

const utils = require("./utils.js");

var exports = module.exports = {};

const EVENTTYPE = {
  WRITE: "write",
  UPDATE: "update",
  PROMISE: "promise",
  COMMIT: "commit",
  CANCEL: "cancel",
  REJECT: "reject",
  SUCCESS: "success",
  FAIL: "fail"
};

function Message(processId, type, from, to) {
  this.processId = processId;
  this.type = type;
  this.from = from;
  this.to = to;
}

function Request(processId, data, type, from, to) {
  Message.call(this, processId, type, from, to);
  this.data = data;
}
Request.prototype = Object.create(Message);
Request.prototype.constructor = Request;

function Response(processId, type, from, to) {
  Message.call(this, processId, type, from, to);
}
Response.prototype = Object.create(Message);
Response.prototype.constructor = Response;

function Network() {
  this.listeners = {};
  this.latency = 100;
}

Network.prototype.listen = function(name, obj, func) {
  if (this.listeners[name]) {
    this.listeners[name][obj.id] = [obj, func];
  }
}

Network.prototype.register = function(name) {
  if (!this.listeners[name]) {
    this.listeners[name] = {};
  }
}

Network.prototype.broadcast = function(name, message) {
  if (this.listeners[name]) {
    utils.wait(this.latency).then(() => {
      var obj = this.listeners[name][message.to][0];
      console.log(message.type + " processId: " + message.processId + " " + ": from: " + message.from + " to: " + message.to);
      if (obj.constructor.name === 'Server') {
        console.log("Destination: " + obj.constructor.name +
          " state: " + obj.state.constructor.name + " data: " + JSON.stringify(obj.data));
      } else {
        console.log("Destination: " + obj.constructor.name);
      }
      var func = this.listeners[name][message.to][1];
      obj[func](message);
    });
  }
}

exports.Message = Message;
exports.Request = Request;
exports.Response = Response;
exports.Network = Network;
exports.EVENTTYPE = EVENTTYPE;
