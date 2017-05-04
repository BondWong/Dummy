nodes = [{
    "id": 0,
    "x": 1509.9862,
    "y": -609.1013
  },
  {
    "id": 1,
    "x": 1645.9578,
    "y": -85.06705
  },
  {
    "id": 2,
    "x": 1948.1533,
    "y": -469.3646
  },
  {
    "id": 3,
    "x": 348.1533,
    "y": -669.3646
  },
  {
    "id": 4,
    "x": 1448.1533,
    "y": -1469.3646
  }
];

links = [{
    "from": 0,
    "to": 1
  },
  {
    "from": 1,
    "to": 2
  },
  {
    "from": 3,
    "to": 4
  }
];

// union-find is a data structure that can union two sets and check
// whether two element in the same set.

var father = {};

function group(nodes, links) {
  // create n set with each set has the node as its only element
  nodes.forEach(function(node, i) {
    father[node.id] = node.id;
  });

  // union each set that has a link between them
  links.forEach(function(link, i) {
    union(link.from, link.to);
  });

  // for each unioned set, group nodes together
  var cnt = 1;
  var groups = {};
  nodes = nodes.forEach(function(node, i) {
    var f = find(node.id);
    if (typeof group[f] === 'undefined') {
      group[f] = cnt++;
    }
    node['group'] = group[f];
  });

  return Object.values(groups);
}

// find father of each set
function find(node) {
  // if it is the root, return
  if (father[node] === node) {
    return node;
  }
  // if not, find the father and point to it
  father[node] = find(father[node]);
  return father[node];
}

// update the father of set which includes node1 to the father of set which includes node 2
function union(node1, node2) {
  father[find(node1)] = find(node2);
}

// O(n), since we visit each node once
group(nodes, links);
console.log(nodes);
