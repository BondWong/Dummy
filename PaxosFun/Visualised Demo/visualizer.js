'use strict';

function Visualizer() {
  this.svg = d3.select("body").append("svg:svg").attr("width", this.width)
    .attr("height", this.height);
  this.serverRadiusSetp = (Math.PI * 2) / servers.length;
  this.serverMargin = this.serverWidth + 60;
  this.serverXScale = d3.scale.linear().domain([-1, 1]).range([this.serverMargin + (this.clientMargin * 2 + 20), this.width - this.serverMargin]);
  this.serverYScale = d3.scale.linear().domain([-1, 1]).range([this.serverMargin, this.height - this.serverMargin]);
  this.clientXScale = this.clientMargin + 20;
  this.clientYScale = d3.scale.linear().domain([0, 1]).range([60 + this.clientMargin, this.height - (60 + this.clientMargin)]);
  this.requestColor = "#B3EECC";
  this.responseColor = "#ecb3ee";
  this.pendingLinkLength = (this.requestWidth / 2) + (this.serverWidth / 2) * 1.07;
}
Visualizer.prototype.width = 960;
Visualizer.prototype.height = 680;
Visualizer.prototype.clientMargin = 60;
Visualizer.prototype.serverWidth = 30;
Visualizer.prototype.responseWidth = 6;
Visualizer.prototype.requestWidth = 20;
Visualizer.prototype.drawServers = function(servers) {
  for (var i = 0, len = servers.length; i < len; i++) {
    servers[i].x = this.serverX(servers[i].id * (Math.PI * 2) / servers.length);
    servers[i].y = this.serverY(servers[i].id * (Math.PI * 2) / servers.length);
    servers[i].radius = this.serverWidth / 2;
    servers[i].fixed = true;
  }
  return this.serverCircles = this.svg.selectAll("circle.server")
    .data(servers).enter().append("svg:circle").attr("fill", "#00ADA7")
    .attr("class", "server").attr("r", function(server) {
      return server.radius;
    }).attr("cx", function(server) {
      return server.x;
    }).attr("cy", function(server) {
      return server.y;
    });
};

Visualizer.prototype.drawClients = function(clients) {
  for (var i = 0, len = clients.length; i < len; i++) {
    clients[i].x = this.clientXScale;
    clients[i].y = this.clientYScale(clients[i].id);
    clients[i].radius = this.serverWidth / 2;
    clients[i].fixed = true;
  }
  return this.clientCircles = this.svg.selectAll("circle.client").data(clients)
    .enter().append("svg:circle").attr("fill", "#DE3961")
    .attr("class", "client").attr("r", function(client) {
      return client.radius;
    }).attr("cx", function(client) {
      return client.x;
    }).attr("cy", function(client) {
      return client.y;
    });
};
Visualizer.prototype.serverX = function(angle) {
  return this.serverXScale(Math.sin(Math.PI + angle));
};

Visualizer.prototype.serverY = function(angle) {
  return this.serverYScale(Math.cos(angle));
};
