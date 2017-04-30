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
  SUCCESS: "success",
  FAIL: "fail"
};

function Message(id, processId, type, from, to, source, target) {
  this.id = id;
  this.processId = processId;
  this.type = type;
  this.from = from;
  this.to = to;
  this.source = source;
  this.target = target;
}

function Request(id, processId, data, type, from, to, source, target) {
  Message.call(this, id, processId, type, from, to, source, target);
  this.data = data;
}
Request.prototype = Object.create(Message);
Request.prototype.constructor = Request;

function Response(id, processId, type, from, to, source, target) {
  Message.call(this, id, processId, type, from, to, source, target);
}
Response.prototype = Object.create(Message);
Response.prototype.constructor = Response;

function Network() {
  this.listeners = {};
  this.visualizer;
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
    wait(this.latency).then(() => {
      try {
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

        this.visualizer.visualize(name, message);
      } catch (e) {
        console.error(e);
        console.error(message.type + " processId: " + message.processId + " " + ": from: " + message.from + " to: " + message.to);
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
    server.response(new Response(getMessageId(), message.processId, EVENTTYPE.FAIL,
      message.to, message.from, message.source, message.target));
    return false;
  }
  server.state = new PrepareState();
  server.clientId = message.from;
  server.source = message.source;
  server.localData = message.data;
  server.neighbors.forEach(function(neighbor) {
    server.request(new Request(getMessageId(), message.processId, message.data, EVENTTYPE.UPDATE,
      server.id, neighbor.id, server, neighbor));
  });
};
IdleState.prototype.update = function(server, message) {
  if (message.data.version <= server.data.version) {
    server.response(new Response(message.processId, EVENTTYPE.REJECT, message.to, message.from, message.source, message.target));
    return false;
  }
  server.state = new ReadyState();
  server.localData = message.data;
  server.request(new Response(getMessageId(), message.processId, EVENTTYPE.PROMISE,
    message.to, message.from, message.source, message.target));
};

function PrepareState() {
  State.call(this);
}
PrepareState.prototype = Object.create(State.prototype);
PrepareState.prototype.constructor = PrepareState;
PrepareState.prototype.write = function(server, message) {
  server.response(new Response(getMessageId(), message.processId, EVENTTYPE.FAIL,
    message.to, message.from, message.source, message.target));
  return false;
};
PrepareState.prototype.update = function(server, message) {
  server.response(new Response(getMessageId(), message.processId, EVENTTYPE.FAIL,
    message.to, message.from, message.source, message.target));
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
      server.data = server.localData;
      server.neighbors.forEach(function(neighbor) {
        server.request(new Request(getMessageId(), message.processId, message.data,
          EVENTTYPE.COMMIT, server.id, neighbor.id, server, neighbor));
      });
      server["responses"] = [];
      server.state = new IdleState();
      server.response(new Response(getMessageId(), message.processId, EVENTTYPE.SUCCESS,
        server.id, server.clientId, server, server.source));
    } else {
      server.neighbors.forEach(function(neighbor) {
        server.request(new Request(getMessageId(), message.processId, message.data,
          EVENTTYPE.CANCEL, server.id, neighbor.id, server, neighbor));
      });
      server["responses"] = [];
      server.state = new IdleState();
      server.response(new Response(getMessageId(), message.processId, "faile",
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
  server.response(new Response(getMessageId(), message.processId, EVENTTYPE.FAIL,
    message.to, message.from, message.source, message.target));
  return false;
};
ReadyState.prototype.update = function(server, message) {
  server.response(new Response(getMessageId(), message.processId, EVENTTYPE.FAIL,
    message.to, message.from, message.source, message.target));
  return false;
};
ReadyState.prototype.commit = function(server, message) {
  server.data = server.localData;
  server.state = new IdleState();
};
ReadyState.prototype.cancel = function(server, message) {
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
    case EVENTTYPE.SUCCESS:
      console.log(message);
      break;
    case EVENTTYPE.FAIL:
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
  this.state = new IdleState();
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
network.register(EVENTTYPE.SUCCESS);
network.register(EVENTTYPE.FAIL);

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
  var client = new Client(0, network);
  client.listen(EVENTTYPE.SUCCESS, "handleResponse");
  client.listen(EVENTTYPE.FAIL, "handleResponse");
  return client;
})(), (function() {
  var client = new Client(1, network);
  client.listen(EVENTTYPE.SUCCESS, "handleResponse");
  client.listen(EVENTTYPE.FAIL, "handleResponse");
  return client;
})()];

var visualizer = new Visualizer();
visualizer.drawServers(servers);
visualizer.drawClients(clients);
network.visualizer = visualizer;

servers = servers.reduce(function(acc, server) {
  acc[server.id] = server;
  return acc;
}, {});
clients = clients.reduce(function(acc, client) {
  acc[client.id] = client;
  return acc;
}, {});

for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    var cindex;
    if (Math.random() > 0.5) {
      cindex = 1;
    } else {
      cindex = 0;
    }

    var sindex = parseInt(Math.random() * (serverCnt - 1));
    clients[cindex].request(new Request(getMessageId(), getProcessId(), {
        version: getVersion(),
        value: i
      }, EVENTTYPE.WRITE,
      clients[cindex].id, servers[sindex].id, clients[cindex], servers[sindex]));
  }, parseInt(Math.random() * 1000) + 500);
}
