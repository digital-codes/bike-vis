""" lanes2trips.py 
convert geojson to trip data
"""

import geopandas as gp
import datetime as dt
import sys
import random
import json


df = gp.read_file("bikelanes.geojson")
print("CRS:",df.crs)
print("Items read:", len(df))

# we have a number of duplicate geometries. keep latest only 
df.drop_duplicates(subset = "geometry", keep="last", inplace=True)
print("Items remaining:", len(df))


def yrs(x):
    return dt.datetime.strptime(str(x),"%Y-%m-%d %H:%M:%S").date().year

df["year"] = df.VORGANGSZE.apply(yrs)

#df.to_file("lanes.geojson")
#select 20212
year = 2012 # 15 in 2022, 1400 in 2012
df.drop(index=(df[df.year != year]).index,inplace=True)
df.reset_index(inplace=True)
df.to_file("lanes.geojson")

#for c in df.geometry[0].coords:
#	print(c)


trips = []
for i in list(df.index):
    trip = {"waypoints":[]}
    tm = random.randint(100,1000)
    speed = random.randint(100,300)
    for c in df.geometry[i].coords:
        trip["waypoints"].append({
            "coordinates":[c[0],c[1]],
            "timestamp":tm,
            "color":[0,0,200]
            }
        )
        tm += speed
    trips.append(trip)

    
with open("lanes.json","w") as f:
    json.dump(trips,f)

    
    

