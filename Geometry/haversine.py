#!/usr/bin/env python3

# common function from Aaron D

from math import radians, cos, sin, asin, sqrt

def getDistance(longitude1, latitude1, longitude2, latitude2):
    longitude1, latitude1, longitude2, latitude2= map(radians, [longitude1, latitude1, longitude2, latitude2])

    dlongitude = longitude2 - longitude1
    dlatitude = latitude2 - latitude1

    a = sin(dlatitude / 2)**2 + cos(latitude1) * cos(latitude2) * sin(dlongitude / 2)**2
    c = 2 * asin(sqrt(a))
    km = 6367 * c

    return km
