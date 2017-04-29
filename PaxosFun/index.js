'use strict';

const utils = require('./utils.js');
const nw = require('./network.js');
const node = require('./node.js');

var network = new nw.Network();
network.register("write");
network.register("update");
network.register("promise");
network.register("commit");
network.register("cancel");
network.register("reject");
network.register("success");
network.register("fail");

var servers = [...Array(10).keys()].map(function() {
  var server = new node.Server(utils.getId(), network);
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
  var client = new node.Client(utils.getId(), network);
  client.listen("success", "handleResponse");
  client.listen("fail", "handleResponse");
  return client;
})(), (function() {
  var client = new node.Client(utils.getId(), network);
  client.listen("success", "handleResponse");
  client.listen("fail", "handleResponse");
  return client;
})()];

for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    var cindex;
    if (Math.random() > 0.5) {
      cindex = 1;
    } else {
      cindex = 0;
    }

    var sindex = parseInt(Math.random() * 9); // [1~9]
    clients[cindex].request(new nw.Request(utils.getProcessId(), {version: utils.getVersion(), value: 1}, "write",
      clients[cindex].id, servers[sindex].id));
  }, parseInt(Math.random() * 1000));
}
