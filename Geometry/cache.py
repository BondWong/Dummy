#!/usr/bin/env python3
import json
import math
from haversine import getDistance

# state cache is a singleton, every threads share the same cache

class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class StateCache(metaclass=Singleton):
    def __init__(self):
    	# read data from file
        self.cache = {} 
        f = open('states.json', 'r')
        for line in f:
            if line is not None:
                jsonData = json.loads(line)
                self.cache[jsonData["state"]] = jsonData["border"]
        f.close()
    
    def get(self, longitude, latitude):
        longitude = float("{0:.6f}".format(float(longitude)))
        latitude = float("{0:.6f}".format(float(latitude)))
        target = [longitude, latitude]
        try:
            for state, border in self.cache.items():
                if(self.isInside(border, target)):
                    return state 
        except KeyError:
            return ''

    # the idea is to use sum of angles to decide whther the target is inside or outside
    # if target is inside a state, sum of angle form by target and every two border points will be 360
    # if target is outside, the sum will not be 360
    # ignore the case when the point is on the border because it can be on more than one states
    def isInside(self, border, target):
        degree = 0
        for i in range(len(border) - 1):
            a = border[i]
            b = border[i + 1]

            # calculate distance of vector
            A = getDistance(a[0], a[1], b[0], b[1]);
            B = getDistance(target[0], target[1], a[0], a[1])
            C = getDistance(target[0], target[1], b[0], b[1])

            # calculate direction of vector
            ta_x = a[0] - target[0]
            ta_y = a[1] - target[1]
            tb_x = b[0] - target[0]
            tb_y = b[1] - target[1]

            cross = tb_y * ta_x - tb_x * ta_y
            clockwise = cross < 0
            
            # calculate sum of angles
            if(clockwise):
                degree = degree + math.degrees(math.acos((B * B + C * C - A * A) / (2.0 * B * C)))
            else:
                degree = degree - math.degrees(math.acos((B * B + C * C - A * A) / (2.0 * B * C)))

        if(abs(round(degree) - 360) <= 3):
            return True
        return False
