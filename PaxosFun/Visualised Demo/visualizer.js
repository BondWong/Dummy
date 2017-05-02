'use strict';

function Visualizer() {
  this.svg = d3.select("body").append("svg:svg").attr("width", this.width)
    .attr("height", this.height);
  this.serverMargin = this.serverWidth + 60;
  this.serverXScale = d3.scale.linear().domain([-1, 1]).range([this.serverMargin + (this.clientMargin * 2 + 20), this.width - this.serverMargin]);
  this.serverYScale = d3.scale.linear().domain([-1, 1]).range([this.serverMargin, this.height - this.serverMargin]);
  this.clientXScale = this.clientMargin + 20;
  this.clientYScale = d3.scale.linear().domain([0, 1]).range([60 + this.clientMargin, this.height - (60 + this.clientMargin)]);
  this.pendingLinkLength = (this.messageWidth / 2) + (this.serverWidth / 2) * 2;
  this.serverCnt = 0;
  this.clientCnt = 0;
  this.colorIndex = 0;
  this.colors = ["royalblue", "darkmagenta", "darkolivegreen", "darkorange", "lime", "red"]; // write, update, promise, commit, cancel, reject
  this.messageSize = {
    large: 2.5,
    small: 4
  }; // write, update, promise, commit, cancel, reject
  this.latency = 0;
  this.pendingMessages = [];
}
Visualizer.prototype.width = 960;
Visualizer.prototype.height = 680;
Visualizer.prototype.clientMargin = 60;
Visualizer.prototype.serverWidth = 30;
Visualizer.prototype.messageWidth = 20;

Visualizer.prototype.init = function(clients, servers) {
  servers.forEach((function(_this) {
    return function(server) {
      server.angle = server.id * (Math.PI * 2) / servers.length;
      server.x = _this.serverX(server.angle);
      server.y = _this.serverY(server.angle);
      server.radius = _this.serverWidth / 2;
      server.fixed = true;
    }
  })(this));

  clients.forEach((function(_this) {
    return function(client) {
      client.x = _this.clientXScale;
      client.y = _this.clientYScale(-client.id - 1);
      client.radius = _this.serverWidth / 2;
      client.fixed = true;
    }
  })(this));

  this.drawClients(clients);
  this.drawServers(servers);
}

Visualizer.prototype.visualize = function(message, latency) {
  var index = this.pendingMessages.indexOf(message.id);

  if (index == -1) {
    message.x = message.source.x;
    message.y = message.source.y;

    this.drawMessage(message);
    this.drawLink(message);
  } else {
    this.pendingMessages.splice(index, 1);
  }

  // animation
  latency = typeof latency === 'undefined' ? this.latency : latency;
  var msg = this.svg.selectAll("circle.message" + message.id);
  msg.transition().ease('cubic-in-out').duration(latency)
    .attr('cx', (function(_this) {
      return function() {
        if (message.isPending) {
          message.x = message.target.x + _this.pendingLinkLength * Math.sin(message.target.angle);
          return message.x;
        } else if (message.isCanceled || message.isRejected) {
          return message.x;
        } else {
          message.x = message.target.x;
          return message.x;
        }
      }
    })(this))
    .attr('cy', (function(_this) {
      return function() {
        if (message.isPending) {
          message.y = message.target.y + _this.pendingLinkLength * Math.cos(message.target.angle);
          return message.y;
        } else if (message.isCanceled || message.isRejected) {
          return message.y;
        } else {
          message.y = message.target.y;
          return message.y;
        }
      }
    })(this))
    .each("end", (function(_this) {
      return function() {
        if (message.isCanceled || message.isRejected) {
          msg.remove();
          _this.svg.selectAll('circle.remove-message' + message.id)
            .data([1])
            .enter()
            .insert("svg:circle", ":first-child")
            .attr("fill", message.color)
            .attr('class', 'remove-message' + message.id)
            .attr('r', message.r)
            .attr('opacity', 1)
            .attr('cx', message.x)
            .attr('cy', message.y)
            .transition()
            .duration(latency)
            .attr('opacity', 0)
            .attr('cx', function() {
              return message.x + _this.pendingLinkLength * Math.sin(message.target.angle) * 2;
            })
            .attr('cy', function() {
              return message.y + _this.pendingLinkLength * Math.cos(message.target.angle) * 2;
            })
            .remove()
            .ease();
        } else if (!message.isPending) {
          // emit orb
          if (index != -1) {
            _this.svg.selectAll('circle.value-change' + message.id)
              .data([1])
              .enter()
              .insert("svg:circle", ":first-child")
              .attr("fill", "#DE3961")
              .attr('class', 'value-change' + message.id)
              .attr('r', _this.messageWidth)
              .attr('opacity', 0.6)
              .attr('cx', message.target.x)
              .attr('cy', message.target.y)
              .transition()
              .duration(latency * 2)
              .attr('r', _this.serverWidth * 2.5)
              .attr('opacity', 0)
              .remove()
              .ease();
          }
          msg.remove();
        }
      }
    })(this));
  var link = this.svg.selectAll("line.link" + message.id);
  link.transition().ease('cubic-in-out').duration(latency)
    .attr('x1', (function(_this) {
      return function() {
        if (message.isPending) {
          return message.target.x + _this.pendingLinkLength * Math.sin(message.target.angle);
        } else {
          return message.target.x;
        }
      }
    })(this))
    .attr('y1', (function(_this) {
      return function() {
        if (message.isPending) {
          return message.target.y + _this.pendingLinkLength * Math.cos(message.target.angle);
        } else {
          return message.target.y;
        }
      }
    })(this))
    .each("end", (function(_this) {
      return function() {
        if (message.isCanceled || message.isRejected) {
          link.remove()
        } else if (!message.isPending) {
          link.remove();
        }
      }
    })(this));

  if (message.isPending) {
    this.pendingMessages.push(message.id);
  }
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
    .attr("r", (function(_this) {
      return function(d) {
        if (d.type === EVENTTYPE.UPDATE || d.type === EVENTTYPE.WRITE) {
          message.r = _this.messageWidth / _this.messageSize["large"];
          return message.r;
        } else {
          message.r = _this.messageWidth / _this.messageSize["small"];
          return message.r;
        }
      }
    })(this))
    .attr("fill", (function(_this) {
      return function(d) {
        if (d instanceof Request) {
          if ((d.type === EVENTTYPE.WRITE ||
              d.type === EVENTTYPE.UPDATE ||
              d.type === EVENTTYPE.COMMIT)) {
            message.color = _this.colors[message.processId % 4];
            return message.color;
          } else {
            // cancel
            message.color = _this.colors[5];
            return message.color;
          }
        } else {
          if (d.type === EVENTTYPE.PROMISE) {
            message.color = _this.colors[4];
            return message.color;
          } else {
            message.color = _this.colors[5];
            return message.color;
          }
        }
      }
    })(this));
  this.message.exit().remove();
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
  return this.serverXScale(Math.sin(angle));
};

Visualizer.prototype.serverY = function(angle) {
  return this.serverYScale(Math.cos(angle));
};
