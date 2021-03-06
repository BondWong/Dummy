'use strict';

const network = require('./network.js');
const state = require('./state.js');

function Node(id, network) {
  this.id = id;
  this.network = network;
}
Node.prototype.handleRequest = function() {};
Node.prototype.request = function(message) {
  this.network.broadcast(message.type, message);
};
Node.prototype.handleResponse = function() {};
Node.prototype.response = function() {};
Node.prototype.listen = function(name, func) {
  this.network.listen(name, this, func);
};

function Client(id, network) {
  Node.call(this, id, network);
}
Client.prototype = Object.create(Node.prototype);
Client.prototype.constructor = Client;
Client.prototype.handleResponse = function(message) {
  switch (message.type) {
    case network.EVENTTYPE.PROMISE:
      console.log(message);
      break;
    case network.EVENTTYPE.REJECT:
      console.log(message);
      break;
  }
};

function Server(id, network, quorum) {
  Node.call(this, id, network);
  this.data = {
    version: -1,
    value: 0
  };
  this.localData = {};
  this.neighbors = [];
  this.quorum = quorum;
  this.state = new state.IdleState();
}
Server.prototype = Object.create(Node.prototype);
Server.prototype.constructor = Server;
Server.prototype.handleRequest = function(message) {
  switch (message.type) {
    case network.EVENTTYPE.WRITE:
      this.state.write(this, message);
      break;
    case network.EVENTTYPE.UPDATE:
      this.state.update(this, message);
      break;
    case network.EVENTTYPE.COMMIT:
      this.state.commit(this, message);
      break;
    case network.EVENTTYPE.CANCEL:
      this.state.cancel(this, message);
      break;
  }
};
Server.prototype.handleResponse = function(message) {
  switch (message.type) {
    case network.EVENTTYPE.PROMISE:
    case network.EVENTTYPE.REJECT:
      this.state.handle(this, message);
      break;
  }
};
Server.prototype.response = function(message) {
  this.network.broadcast(message.type, message);
};

var exports = module.exports = {};
exports.Node = Node;
exports.Client = Client;
exports.Server = Server;
