'use strict';

const utils = require('./utils.js');
const nw = require('./network.js');
const node = require('./node.js');

var network = new nw.Network();
network.register(nw.EVENTTYPE.WRITE);
network.register(nw.EVENTTYPE.UPDATE);
network.register(nw.EVENTTYPE.PROMISE);
network.register(nw.EVENTTYPE.COMMIT);
network.register(nw.EVENTTYPE.CANCEL);
network.register(nw.EVENTTYPE.REJECT);
network.register(nw.EVENTTYPE.SUCCESS);
network.register(nw.EVENTTYPE.FAIL);

var servers = [...Array(10).keys()].map(function() {
  var server = new node.Server(utils.getId(), network);
  server.listen(nw.EVENTTYPE.WRITE, "handleRequest");
  server.listen(nw.EVENTTYPE.UPDATE, "handleRequest");
  server.listen(nw.EVENTTYPE.PROMISE, "handleResponse");
  server.listen(nw.EVENTTYPE.REJECT, "handleResponse");
  server.listen(nw.EVENTTYPE.COMMIT, "handleRequest");
  server.listen(nw.EVENTTYPE.CANCEL, "handleRequest");
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
  client.listen(nw.EVENTTYPE.SUCCESS, "handleResponse");
  client.listen(nw.EVENTTYPE.FAIL, "handleResponse");
  return client;
})(), (function() {
  var client = new node.Client(utils.getId(), network);
  client.listen(nw.EVENTTYPE.SUCCESS, "handleResponse");
  client.listen(nw.EVENTTYPE.FAIL, "handleResponse");
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
    clients[cindex].request(new nw.Request(utils.getProcessId(), {
        version: utils.getVersion(),
        value: i
      }, nw.EVENTTYPE.WRITE,
      clients[cindex].id, servers[sindex].id));
  }, parseInt(Math.random() * 1000));
}
