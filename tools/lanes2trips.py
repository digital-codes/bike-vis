""" lanes2trips.py 
convert geojson to trip data
"""

import geopandas as gp
import datetime as dt
import sys
import random
import json

DATADIR = "../public/data"

df = gp.read_file(f"{DATADIR}/bikelanes.geojson")
print("CRS:",df.crs)
print("Items read:", len(df))

# we have a number of duplicate geometries. keep latest only 
df.drop_duplicates(subset = "geometry", keep="last", inplace=True)
print("Items remaining:", len(df))


def yrs(x):
    return dt.datetime.strptime(str(x),"%Y-%m-%d %H:%M:%S").date().year

def doy(x):
    return x.timetuple().tm_yday

def woy(x):
    return x.isocalendar()[1]


df["year"] = df.VORGANGSZE.apply(yrs)

df["day"] = df.VORGANGSZE.apply(doy)
df["week"] = df.VORGANGSZE.apply(woy)

#select 20212
#year = 2012 # 15 in 2022, 1400 in 2012
#df.drop(index=(df[df.year != year]).index,inplace=True)

# drop 1980
df.drop(index=(df[df.year == 1980]).index,inplace=True)


df.reset_index(inplace=True)
df.to_file(f"{DATADIR}/lanes.geojson")

#for c in df.geometry[0].coords:
#	print(c)


trips = []
for i in list(df.index):
    trip = {
        "year":int(df.year[i]),
        "week":int(df.week[i]),
        "day":int(df.day[i]),
        "color":[0,0,200],
        "waypoints":[],
    }
    #tm = random.randint(100,1000)
    #speed = random.randint(100,300)
    tm = int((df.year[i] - df.year.min())*52 + df.week[i])
    segments = len(list(df.geometry[i].coords))
    speed = 4 / segments # 4 weeks per track ...
    for c in df.geometry[i].coords:
        trip["waypoints"].append({
            "coordinates":[c[0],c[1]],
            "timestamp":tm,
            # color can be set for trip also
            #"color":[0,0,200]
            }
        )
        tm += speed
    trips.append(trip)

    
with open(f"{DATADIR}/lanes.json","w") as f:
    json.dump(trips,f)

    
    

