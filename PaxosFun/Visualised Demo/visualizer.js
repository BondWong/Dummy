'use strict';

function Visualizer() {
  this.svg = d3.select("body").append("svg:svg").attr("width", this.width)
    .attr("height", this.height);
  this.serverMargin = this.serverWidth + 60;
  this.serverXScale = d3.scale.linear().domain([-1, 1]).range([this.serverMargin + (this.clientMargin * 2 + 20), this.width - this.serverMargin]);
  this.serverYScale = d3.scale.linear().domain([-1, 1]).range([this.serverMargin, this.height - this.serverMargin]);
  this.clientXScale = this.clientMargin + 20;
  this.clientYScale = d3.scale.linear().domain([0, 1]).range([60 + this.clientMargin, this.height - (60 + this.clientMargin)]);
  this.pendingLinkLength = (this.requestWidth / 2) + (this.serverWidth / 2) * 1.07;
  this.serverCnt = 0;
  this.clientCnt = 0;
  this.colors = ["#B3EECC", "#ecb3ee"];
}
Visualizer.prototype.width = 960;
Visualizer.prototype.height = 680;
Visualizer.prototype.clientMargin = 60;
Visualizer.prototype.serverWidth = 30;
Visualizer.prototype.messageWidth = 20;

Visualizer.prototype.init = function(clients, servers) {
  servers.forEach((function(_this) {
    return function(server) {
      server.x = _this.serverX(server.id * (Math.PI * 2) / servers.length);
      server.y = _this.serverY(server.id * (Math.PI * 2) / servers.length);
      server.radius = _this.serverWidth / 2;
      server.fixed = true;
    }
  })(this));

  clients.forEach((function(_this) {
    return function(client) {
      client.x = _this.clientXScale;
      client.y = _this.clientYScale(client.id);
      client.radius = _this.serverWidth / 2;
      client.fixed = true;
    }
  })(this));

  this.drawClients(clients);
  this.drawServers(servers);
  // this.setupForceLayout();
}

Visualizer.prototype.visualize = function(message) {
  message.x = message.source.x;
  message.y = message.source.y;
  message.r = this.messageWidth / 2;

  this.drawMessage(message);
  this.drawLink(message);

  // animation
  var msg = this.svg.selectAll("circle.message" + message.id);
  msg.transition().ease('cubic-in-out').duration(1000)
    .attr('cx', message.target.x).attr('cy', message.target.y)
    .each("end", (function(_this) {
      return function() {
        if (message.type !== EVENTTYPE.WRITE && message.type !== EVENTTYPE.UPDATE) {
          msg.remove();
        }
      }
    })(this));
  var link = this.svg.selectAll("line.link" + message.id);
  link.transition().ease('cubic-in-out').duration(1000)
    .attr('x1', message.target.x)
    .attr('y1', message.target.y)
    .each("end", (function(_this) {
      return function() {
        link.remove();
      }
    })(this));
}

Visualizer.prototype.drawLink = function(message) {
  this.link = this.svg.selectAll("line.link" + message.id)
    .data([message]);
  this.link.enter().append("svg:line")
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    })
    .attr("class", function(d) {
      return "link" + d.id + " " + d.type;
    });

  return this.link.exit().remove();
}

Visualizer.prototype.drawMessage = function(message) {
  this.message = this.svg.selectAll("circle.message" + message.id)
    .data([message]);
  this.message.enter()
    .append("svg:circle")
    .attr("cx", function(d) {
      return d.source.x;
    })
    .attr("cy", function(d) {
      return d.source.y;
    })
    .attr("class", "message" + message.id)
    .attr("r", function(d) {
      return d.r;
    })
    .attr("fill", (function(_this) {
      return function(d) {
        if (d instanceof Request) {
          return _this.colors[1];
        } else {
          return _this.colors[0];
        }
      }
    })(this));
  return this.message.exit().remove();
}

Visualizer.prototype.drawServers = function(servers) {
  return this.serverCircles = this.svg.selectAll("circle.server")
    .data(servers).enter().append("svg:circle").attr("fill", "#00ADA7")
    .attr("class", "server").attr("r", function(server) {
      return server.radius;
    }).attr("cx", function(server) {
      return server.x;
    }).attr("cy", function(server) {
      return server.y;
    });
}

Visualizer.prototype.drawClients = function(clients) {
  return this.clientCircles = this.svg.selectAll("circle.client")
    .data(clients)
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
