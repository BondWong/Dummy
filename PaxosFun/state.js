'use strict';

const network = require('./network.js');
var exports = module.exports = {};

function State() {}
State.prototype.write = function() {};
State.prototype.update = function() {};
State.prototype.commit = function() {};
State.prototype.cancel = function() {};
State.prototype.handle = function() {};

function IdleState() {
  State.call(this);
}
IdleState.prototype = Object.create(State.prototype);
IdleState.prototype.constructor = IdleState;
IdleState.prototype.write = function(server, message) {
  if (message.data.version <= server.data.version) {
    server.response(new network.Response(message.processId, network.EVENTTYPE.FAIL, message.to, message.from));
    return false;
  }
  server.state = new PrepareState();
  server.clientId = message.from;
  server.localData = message.data;
  server.neighbors.forEach(function(neighbor) {
    server.request(new network.Request(message.processId, message.data, network.EVENTTYPE.UPDATE,
      server.id, neighbor.id));
  });
};
IdleState.prototype.update = function(server, message) {
  if (message.data.version <= server.data.version) {
    server.response(new network.Response(message.processId, network.EVENTTYPE.REJECT, message.to, message.from));
    return false;
  }
  server.state = new ReadyState();
  server.localData = message.data;
  server.request(new network.Response(message.processId, network.EVENTTYPE.PROMISE, message.to, message.from));
};

function PrepareState() {
  State.call(this);
}
PrepareState.prototype = Object.create(State.prototype);
PrepareState.prototype.constructor = PrepareState;
PrepareState.prototype.write = function(server, message) {
  server.response(new network.Response(message.processId, network.EVENTTYPE.FAIL, message.to, message.from));
  return false;
};
PrepareState.prototype.update = function(server, message) {
  server.response(new network.Response(message.processId, network.EVENTTYPE.FAIL, message.to, message.from));
  return false;
};
PrepareState.prototype.handle = function(server, message) {
  if (!server["responses"]) {
    server["responses"] = [];
  }
  message.type === "promise" ? server["responses"].push(true) : server["responses"].push(false);
  if (server["responses"].length == server.neighbors.length) {
    var promiseCnt = 0;
    server["responses"].forEach(function(response) {
      if (response) {
        promiseCnt++;
      }
    });
    if (promiseCnt == server.neighbors.length) {
      server.data = server.localData;
      server.neighbors.forEach(function(neighbor) {
        server.request(new network.Request(message.processId, message.data, network.EVENTTYPE.COMMIT, server.id, neighbor.id));
      });
      server["responses"] = [];
      server.state = new IdleState();
      server.response(new network.Response(message.processId, network.EVENTTYPE.SUCCESS, server.id, server.clientId));
    } else {
      server.neighbors.forEach(function(neighbor) {
        server.request(new network.Request(message.processId, message.data, network.EVENTTYPE.CANCEL, server.id, neighbor.id));
      });
      server["responses"] = [];
      server.state = new IdleState();
      server.response(new network.Response(message.processId, network.EVENTTYPE.FAIL, server.id, server.clientId));
    }
  }
};

function ReadyState() {
  State.call(this);
}
ReadyState.prototype = Object.create(State.prototype);
ReadyState.prototype.constructor = ReadyState;
ReadyState.prototype.write = function(server, message) {
  server.response(new network.Response(message.processId, network.EVENTTYPE.FAIL, message.to, message.from));
  return false;
};
ReadyState.prototype.update = function(server, message) {
  server.response(new network.Response(message.processId, network.EVENTTYPE.FAIL, message.to, message.from));
  return false;
};
ReadyState.prototype.commit = function(server, message) {
  server.data = server.localData;
  server.state = new IdleState();
};
ReadyState.prototype.cancel = function(server, message) {
  server.state = new IdleState();
}

exports.State = State;
exports.IdleState = IdleState;
exports.PrepareState = PrepareState;
exports.ReadyState = ReadyState;
