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
  this.links = [];
  this.nodes = [];
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
  this.nodes = servers.concat(clients);
  this.serverCnt = servers.length;
  this.clientCnt = clients.length;
  this.drawClients();
  this.drawServers();
  this.setupForceLayout();
}

Visualizer.prototype.visualize = function(message) {
  message.x = message.source.x;
  message.y = message.source.y;
  message.r = this.messageWidth / 2;
  this.links.push({
    source: message,
    target: this.nodes.find(function(node) {
      return node.constructor.name === message.target.constructor.name &&
        node.id === message.target.id;
    })
  });
  this.nodes.push(message);
}

Visualizer.prototype.setupForceLayout = function() {
  if (this.force != null) {
    this.force.stop();
    delete this.force;
  }
  this.force = d3.layout.force().size([this.width, this.height])
    .gravity(-0.005).charge(function(d, i) {
      if (d instanceof Server) {
        return 0;
      } else {
        return -10;
      }
    })
    .friction(0.89)
    .linkDistance((function(_this) {
      return function(d, i) {
        if (d instanceof Response) {
          return 0;
        } else if (d instanceof Request) {
          if (d.isPending) {
            return this.pendingLinkLength;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      }
    })(this))
    .nodes(this.nodes)
    .links(this.links)
    .on('tick', (function(_this) {
      return function() {
        _this.drawCommunication();
      }
    })(this));

  return this.force.start();
}

Visualizer.prototype.drawCommunication = function() {
  this.drawMessage();
  return this.drawLinks();
}

Visualizer.prototype.drawLinks = function() {
  this.link = this.svg.selectAll("line.link")
    .data(this.nodes.filter(function(n) {
      return n instanceof Message;
    }));
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
      return "link " + d.type;
    });

  return this.link.exit().remove();
}

Visualizer.prototype.drawMessage = function() {
  this.messageCircles = this.svg.selectAll("circle.message")
    .data(this.nodes.filter(function(n) {
      return n instanceof Message;
    }));
  this.messageCircles.enter()
    .append("svg:circle")
    .attr("cx", function(d) {
      return d.source.x;
    })
    .attr("cy", function(d) {
      return d.source.y;
    })
    .attr("class", "message")
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
  return this.messageCircles.exit().remove();
}

Visualizer.prototype.drawServers = function() {
  this.nodes.forEach((function(_this) {
    return function(node) {
      if (node instanceof Server) {
        node.x = _this.serverX(node.id * (Math.PI * 2) / _this.serverCnt);
        node.y = _this.serverY(node.id * (Math.PI * 2) / _this.serverCnt);
        node.radius = _this.serverWidth / 2;
        node.fixed = true;
      }
    }
  })(this));
  return this.serverCircles = this.svg.selectAll("circle.server")
    .data(this.nodes.filter(function(n) {
      return n instanceof Server;
    })).enter().append("svg:circle").attr("fill", "#00ADA7")
    .attr("class", "server").attr("r", function(server) {
      return server.radius;
    }).attr("cx", function(server) {
      return server.x;
    }).attr("cy", function(server) {
      return server.y;
    });
}

Visualizer.prototype.drawClients = function() {
  this.nodes.forEach((function(_this) {
    return function(node) {
      if (node instanceof Client) {
        node.x = _this.clientXScale;
        node.y = _this.clientYScale(node.id);
        node.radius = _this.serverWidth / 2;
        node.fixed = true;
      }
    }
  })(this));
  return this.clientCircles = this.svg.selectAll("circle.client")
    .data(this.nodes.filter(function(n) {
      return n instanceof Client;
    }))
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
