'use strict';

function values(n, m) {
  var val = {};
  for (var i = 0; i < n; i++) {
    if (typeof val[i] === 'undefined') {
      val[i] = [];
    }
    for (var j = 0; j <= m; j++) {
      val[i][j] = j * Math.random();
    }
  }

  return val;
}

function findOptimalPartition(n, m, vals, ignored) {
  var max = [0];
  var optimalAllocation = [];

  findOptimalPartitionHelper(optimalAllocation, [], 0, 0, n, m, vals, max, 0, ignored);
  return [max[0], optimalAllocation[0]];
}

function findOptimalPartitionHelper(optimalAllocation, allocation,
  sum, cur, n, m, vals, max, pos, ignored) {
  if (allocation.length === n) {
    if (max[0] < cur) {
      max[0] = cur;
      optimalAllocation[0] = allocation.slice();
    }
    return;
  }

  for (var i = pos; i < n; i++) {
    var valDelta = 0;
    var sumDelta = 0;
    for (var j = 0; j <= m; j++) {
      if (i === ignored) {
        allocation.push(-1);
      } else {
        if (sum + j <= m) {
          allocation.push(j);
          sumDelta = j;
          valDelta = vals[i][j];
        } else {
          allocation.push(0);
          sumDelta = 0;
          valDelta = vals[i][0];
        }
      }
      findOptimalPartitionHelper(optimalAllocation,
        allocation, sum + sumDelta, cur + valDelta, n, m, vals, max, i + 1, ignored);
      allocation.splice(allocation.length - 1, 1);
    }
  }
}

function VCG(n, m) {
  var vals = values(n, m);
  var optimal = findOptimalPartition(n, m, vals);
  var prices = [];
  var cost = [...Array(n).keys()].map(function(i) {
    return optimal[0] - vals[i][optimal[1][i]];
  });
  for (var i = 0; i < n; i++) {
    var newOptimal = findOptimalPartition(n, m, vals, i);
    prices[i] = newOptimal[0] - cost[i];
  }

  return prices;
}

var n = [6, 6, 6, 6, 6, 6];
var m = [10, 14, 18, 22, 26, 30];
for (var i = 0; i < n.length; i++) {
  console.log("================================");
  console.log("n: " + n[i] + " m: " + m[i]);
  var start = new Date();
  var prices = VCG(n[i], m[i]);
  var diff = new Date() - start;
  console.log("duration: " + diff);
}
