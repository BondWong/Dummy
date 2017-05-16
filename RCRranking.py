#!/usr/bin/python3

from random import randint, shuffle

class Vertex:
    def __init__(self, id):
        self.id = id
        self.neighbors = set()
    def add_neighbor(self, neighbor):
        self.neighbors.add(neighbor)
    def __eq__(self, other):
        return other and isinstance(other, Vertex) and other.id == self.id
    def __ne__(self, other):
        return not self.__eq__(other)
    def __hash__(self):
        return hash(self.id)

def create_graph(rankings):
    graph = {}
    shuffle(rankings)
    for i in range(len(rankings)):
        create_graph(rankings[i], graph)
    return graph

def create_graph(ranking, graph):
    for i in len(ranking):
        id = ranking[i]
        if id not in graph:
            vertex = Vertex(id)
            graph[id] = vertex
        if i != 0:
            neighbor = graph(ranking[i - 1])
            cur = graph[id]
            if not has_circle(cur, neighbor, graph[neighbor]):
                cur.add_neighbor(neighbor)

def has_circle(root, descendant, graph):
    if root == descendant:
        return True
    for neighbor in descendant.neighbors:
        if has_circle(root, neighbor, graph):
            return True
    return False
