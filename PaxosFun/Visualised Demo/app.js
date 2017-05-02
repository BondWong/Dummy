'use strict';

// utils
var id = 0;
var version = 0;
var processId = 0;
var messageId = 0;

function getId() {
  return id++;
}

function getVersion() {
  return version++;
}

function getProcessId() {
  return processId++;
}

function getMessageId() {
  return messageId++;
}

function wait(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

// network
const EVENTTYPE = {
  WRITE: "write",
  UPDATE: "update",
  PROMISE: "promise",
  COMMIT: "commit",
  CANCEL: "cancel",
  REJECT: "reject",
};

function Message(id, processId, type, from, to, source, target) {
  this.id = id;
  this.processId = processId;
  this.type = type;
  this.from = from;
  this.to = to;
  this.source = source;
  this.target = target;
  this.isPending = false;
  this.isCanceled = false;
  this.isRejected = false;
}

function Request(id, processId, data, type, from, to, source, target) {
  Message.call(this, id, processId, type, from, to, source, target);
  this.data = data;
  this.isPending = false;
}
Request.prototype = Object.create(Message.prototype);
Request.prototype.constructor = Request;

function Response(id, processId, type, from, to, source, target) {
  Message.call(this, id, processId, type, from, to, source, target);
}
Response.prototype = Object.create(Message.prototype);
Response.prototype.constructor = Response;

function Network() {
  this.listeners = {};
  this.visualizer;
  this.latency = 2000;
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
    wait(this.latency).then(() => {
      try {
        var obj = this.listeners[name][message.to][0];
        var func = this.listeners[name][message.to][1];
        obj[func](message);
        console.log(message.type + " processId: " + message.processId + " " + ": from: " + message.from + " to: " + message.to);
        if (obj.constructor.name === 'Server') {
          console.log("Destination: " + obj.constructor.name +
            " state: " + obj.state.constructor.name + " data: " + JSON.stringify(obj.data));
        } else {
          console.log("Destination: " + obj.constructor.name);
        }

        this.visualizer.visualize(message);
      } catch (e) {
        console.error(e);
        console.error(message.type + " processId: " + message.processId + " " + ": from: " + message.from + " to: " + message.to);
        console.log(this.listeners[name]);
      }
    });
  }
}

// state
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
    message.isRejected = true;
    server.network.visualizer.visualize(message);
    server.response(new Response(getMessageId(), message.processId, EVENTTYPE.REJECT,
      message.to, message.from, message.target, message.source));
    return false;
  }
  server.state = new PrepareState();
  server.clientId = message.from;
  server.source = message.source;
  server.pendingMessage = message;
  server.pendingMessage.isPending = true;
  server.neighbors.forEach(function(neighbor) {
    var request = new Request(getMessageId(), message.processId, message.data, EVENTTYPE.UPDATE,
      server.id, neighbor.id, server, neighbor);
    request.isPending = true;
    server.request(request);
  });
};
IdleState.prototype.update = function(server, message) {
  if (message.data.version <= server.data.version) {
    message.isRejected = true;
    server.network.visualizer.visualize(message);
    server.response(new Response(message.processId, EVENTTYPE.REJECT, message.to, message.from, message.target, message.from));
    return false;
  }
  server.state = new ReadyState();
  server.pendingMessage = message;
  server.pendingMessage.isPending = true;
  server.request(new Response(getMessageId(), message.processId, EVENTTYPE.PROMISE,
    message.to, message.from, message.target, message.source));
};

function PrepareState() {
  State.call(this);
}
PrepareState.prototype = Object.create(State.prototype);
PrepareState.prototype.constructor = PrepareState;
PrepareState.prototype.write = function(server, message) {
  message.isRejected = true;
  server.network.visualizer.visualize(message);
  server.response(new Response(getMessageId(), message.processId, EVENTTYPE.REJECT,
    message.to, message.from, message.target, message.source));
  return false;
};
PrepareState.prototype.update = function(server, message) {
  message.isRejected = true;
  server.network.visualizer.visualize(message);
  server.response(new Response(getMessageId(), message.processId, EVENTTYPE.REJECT,
    message.to, message.from, message.target, message.source));
  return false;
};
PrepareState.prototype.handle = function(server, message) {
  if (!server["responses"]) {
    server["responses"] = [];
  }
  message.type === EVENTTYPE.PROMISE ? server["responses"].push(true) : server["responses"].push(false);
  if (server["responses"].length == server.neighbors.length) {
    var promiseCnt = 0;
    server["responses"].forEach(function(response) {
      if (response) {
        promiseCnt++;
      }
    });
    if (promiseCnt == server.neighbors.length) {
      server.neighbors.forEach(function(neighbor) {
        server.request(new Request(getMessageId(), message.processId, message.data,
          EVENTTYPE.COMMIT, server.id, neighbor.id, server, neighbor));
      });
      server.data = server.pendingMessage.data;
      server.pendingMessage.isPending = false;
      server["responses"] = [];
      server.state = new IdleState();
      // make animation make more sense
      wait(server.network.latency).then(() => {
        server.network.visualizer.visualize(server.pendingMessage, server.dbLatency);
        server.response(new Response(getMessageId(), message.processId, EVENTTYPE.PROMISE,
          server.id, server.clientId, server, server.source));
      });
    } else {
      server.neighbors.forEach(function(neighbor) {
        server.request(new Request(getMessageId(), message.processId, message.data,
          EVENTTYPE.CANCEL, server.id, neighbor.id, server, neighbor));
      });
      server.pendingMessage.isPending = false;
      // remove
      server.pendingMessage.isCanceled = true;
      server.network.visualizer.visualize(server.pendingMessage);
      server["responses"] = [];
      server.state = new IdleState();
      server.response(new Response(getMessageId(), message.processId, EVENTTYPE.REJECT,
        server.id, server.clientId, server, server.source));
    }
  }
};

function ReadyState() {
  State.call(this);
}
ReadyState.prototype = Object.create(State.prototype);
ReadyState.prototype.constructor = ReadyState;
ReadyState.prototype.write = function(server, message) {
  message.isRejected = true;
  server.network.visualizer.visualize(message);
  server.response(new Response(getMessageId(), message.processId, EVENTTYPE.REJECT,
    message.to, message.from, message.target, message.source));
  return false;
};
ReadyState.prototype.update = function(server, message) {
  message.isRejected = true;
  server.network.visualizer.visualize(message);
  server.response(new Response(getMessageId(), message.processId, EVENTTYPE.REJECT,
    message.to, message.from, message.target, message.source));
  return false;
};
ReadyState.prototype.commit = function(server, message) {
  server.data = server.pendingMessage.data;
  server.pendingMessage.isPending = false;
  server.state = new IdleState();
  // make the animation make more sense
  wait(server.network.latency).then(() => {
    server.network.visualizer.visualize(server.pendingMessage, server.dbLatency);
  })
};
ReadyState.prototype.cancel = function(server, message) {
  server.pendingMessage.isPending = false;
  // remove
  server.pendingMessage.isCanceled = true;
  server.network.visualizer.visualize(server.pendingMessage);
  server.state = new IdleState();
}

// node
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
    case EVENTTYPE.PROMISE:
      console.log(message);
      break;
    case EVENTTYPE.REJECT:
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
  this.pendingMessage;
  this.neighbors = [];
  this.quorum = quorum;
  this.state = new IdleState();
  this.dbLatency = 500;
}
Server.prototype = Object.create(Node.prototype);
Server.prototype.constructor = Server;
Server.prototype.handleRequest = function(message) {
  switch (message.type) {
    case EVENTTYPE.WRITE:
      this.state.write(this, message);
      break;
    case EVENTTYPE.UPDATE:
      this.state.update(this, message);
      break;
    case EVENTTYPE.COMMIT:
      this.state.commit(this, message);
      break;
    case EVENTTYPE.CANCEL:
      this.state.cancel(this, message);
      break;
  }
};
Server.prototype.handleResponse = function(message) {
  switch (message.type) {
    case EVENTTYPE.PROMISE:
    case EVENTTYPE.REJECT:
      this.state.handle(this, message);
      break;
  }
};
Server.prototype.response = function(message) {
  this.network.broadcast(message.type, message);
};

// demo start
var serverCnt = 10;
var clientCnt = 2;
var network = new Network();
network.register(EVENTTYPE.WRITE);
network.register(EVENTTYPE.UPDATE);
network.register(EVENTTYPE.PROMISE);
network.register(EVENTTYPE.COMMIT);
network.register(EVENTTYPE.CANCEL);
network.register(EVENTTYPE.REJECT);

var servers = [...Array(serverCnt).keys()].map(function() {
  var server = new Server(getId(), network);
  server.listen(EVENTTYPE.WRITE, "handleRequest");
  server.listen(EVENTTYPE.UPDATE, "handleRequest");
  server.listen(EVENTTYPE.PROMISE, "handleResponse");
  server.listen(EVENTTYPE.REJECT, "handleResponse");
  server.listen(EVENTTYPE.COMMIT, "handleRequest");
  server.listen(EVENTTYPE.CANCEL, "handleRequest");
  return server
});

servers.forEach(function(server) {
  var neighbors = [...servers];
  var index = neighbors.indexOf(server);
  neighbors.splice(index, 1);
  server.neighbors = neighbors;
});

var clients = [(function() {
  var client = new Client(-1, network);
  client.listen(EVENTTYPE.PROMISE, "handleResponse");
  client.listen(EVENTTYPE.REJECT, "handleResponse");
  return client;
})(), (function() {
  var client = new Client(-2, network);
  client.listen(EVENTTYPE.PROMISE, "handleResponse");
  client.listen(EVENTTYPE.REJECT, "handleResponse");
  return client;
})()];

var visualizer = new Visualizer();
visualizer.init(clients, servers);
visualizer.latency = network.latency;
network.visualizer = visualizer;

servers = servers.reduce(function(acc, server) {
  acc[server.id] = server;
  return acc;
}, {});
clients = clients.reduce(function(acc, client) {
  acc[client.id] = client;
  return acc;
}, {});

var action = () => {
  var cindex;
  if (Math.random() > 0.5) {
    cindex = -1;
  } else {
    cindex = -2;
  }

  var sindex = parseInt(Math.random() * (serverCnt - 1));
  var request = new Request(getMessageId(), getProcessId(), {
      version: getVersion(),
      value: i
    }, EVENTTYPE.WRITE,
    clients[cindex].id, servers[sindex].id, clients[cindex], servers[sindex]);
  request.isPending = true;
  clients[cindex].request(request);
};

var time = 0;
for (var i = 0; i < 10; i++) {
  time += Math.random() * 1000 + 3000;
  wait(time).then(action);
}
