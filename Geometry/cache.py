#!/usr/bin/env python3
import json

class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class StateCache(metaclass=Singleton):
    def __init__(self):
        self.cache = {} 
        f = open('states.json', 'r')
        for line in f:
            if line is not None:
                jsonData = json.loads(line)
                for geometryData in jsonData["border"]:
                    self.cache[(geometryData[0], geometryData[0])] = jsonData["state"]
        f.close()
        print(self.cache)
    
    def get(self, longitude, latitude):
        longitude = float("{0:.6f}".format(float(longitude)))
        latitude = float("{0:.6f}".format(float(latitude)))
        geometryTuple = (longitude, latitude)
        try:
            state = self.cache[geometryTuple]
            return state
        except KeyError:
            return ''
