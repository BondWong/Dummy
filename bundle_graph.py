#!/usr/bin/python3

import random

class Student:
    def __init__(self, id):
        self.id = id
        self.papers = []
    def assign_paper(self, paper):
        self.papers.append(paper)
    def __str__(self):
        return str(self.id) + ": " + str(self.papers)

class Paper:
    def __init__(self, id):
        self.id = id

def create_bundle_graph(n, k):
    students = [Student(x + 1) for x in range(n)]
    papers = [Paper(x + 1) for x in range(n)]
    for i in range(k):
        inavai_pap = set()
        for j in range(len(students)):
            paper = None
            while True:
                paper = papers[random.randint(0, len(papers) - 1)]
                if paper.id == students[j].id:
                    continue
                if paper.id not in inavai_pap and paper.id not in students[j].papers:
                    inavai_pap.add(paper.id)
                    break
            students[j].assign_paper(paper.id)
    return students

create_bundle_graph(100, 5)
