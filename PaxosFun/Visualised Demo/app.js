'use strict';

// utils
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

// network
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
    wait(100).then(() => {
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
      } catch (e) {
        console.error("Internal Error");
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
    server.response(new Response(message.processId, "fail", message.to, message.from));
    return false;
  }
  server.state = new PrepareState();
  server.clientId = message.from;
  server.localData = message.data;
  server.neighbors.forEach(function(neighbor) {
    server.request(new Request(message.processId, message.data, "update",
      server.id, neighbor.id));
  });
};
IdleState.prototype.update = function(server, message) {
  if (message.data.version <= server.data.version) {
    server.response(new Response(message.processId, "reject", message.to, message.from));
    return false;
  }
  server.state = new ReadyState();
  server.localData = message.data;
  server.request(new Response(message.processId, "promise", message.to, message.from));
};

function PrepareState() {
  State.call(this);
}
PrepareState.prototype = Object.create(State.prototype);
PrepareState.prototype.constructor = PrepareState;
PrepareState.prototype.write = function(server, message) {
  server.response(new Response(message.processId, "fail", message.to, message.from));
  return false;
};
PrepareState.prototype.update = function(server, message) {
  server.response(new Response(message.processId, "fail", message.to, message.from));
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
        server.request(new Request(message.processId, message.data, "commit", server.id, neighbor.id));
      });
      server["responses"] = [];
      server.state = new IdleState();
      server.response(new Response(message.processId, "success", server.id, server.clientId));
    } else {
      server.neighbors.forEach(function(neighbor) {
        server.request(new Request(message.processId, message.data, "cancel", server.id, neighbor.id));
      });
      server["responses"] = [];
      server.state = new IdleState();
      server.response(new Response(message.processId, "faile", server.id, server.clientId));
    }
  }
};

function ReadyState() {
  State.call(this);
}
ReadyState.prototype = Object.create(State.prototype);
ReadyState.prototype.constructor = ReadyState;
ReadyState.prototype.write = function(server, message) {
  server.response(new Response(message.processId, "fail", message.to, message.from));
  return false;
};
ReadyState.prototype.update = function(server, message) {
  server.response(new Response(message.processId, "fail", message.to, message.from));
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
    case "success":
      console.log(message);
      break;
    case "fail":
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
    case "write":
      this.state.write(this, message);
      break;
    case "update":
      this.state.update(this, message);
      break;
    case "commit":
      this.state.commit(this, message);
      break;
    case "cancel":
      this.state.cancel(this, message);
      break;
  }
};
Server.prototype.handleResponse = function(message) {
  switch (message.type) {
    case "promise":
    case "reject":
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
network.register("write");
network.register("update");
network.register("promise");
network.register("commit");
network.register("cancel");
network.register("reject");
network.register("success");
network.register("fail");

var servers = [...Array(serverCnt).keys()].map(function() {
  var server = new Server(getId(), network);
  server.listen("write", "handleRequest");
  server.listen("update", "handleRequest");
  server.listen("promise", "handleResponse");
  server.listen("reject", "handleResponse");
  server.listen("commit", "handleRequest");
  server.listen("cancel", "handleRequest");
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
  client.listen("success", "handleResponse");
  client.listen("fail", "handleResponse");
  return client;
})(), (function() {
  var client = new Client(1, network);
  client.listen("success", "handleResponse");
  client.listen("fail", "handleResponse");
  return client;
})()];

var visualizer = new Visualizer();
visualizer.drawServers(servers);
visualizer.drawClients(clients);

for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    var cindex;
    if (Math.random() > 0.5) {
      cindex = 1;
    } else {
      cindex = 0;
    }

    var sindex = parseInt(Math.random() * (serverCnt - 1));
    clients[cindex].request(new Request(getProcessId(), {
        version: getVersion(),
        value: 1
      }, "write",
      clients[cindex].id, servers[sindex].id));
  }, parseInt(Math.random() * 1000));
}
