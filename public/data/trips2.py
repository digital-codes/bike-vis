import pandas as pd
import random
import json
import copy

df = pd.read_json("sf-trips.json")
print("Trips: ",df.waypoints.count())

trips = []

# update timestamps
ts = 100 # start time
for i in df.waypoints:
    for s in i:
        s["timestamp"] = ts
        ts += random.randint(10,100)
    trips.append({"waypoints":i})


for i in range(5):
    trip = copy.deepcopy(trips[0])
    tm = trip["waypoints"][0]["timestamp"]
    print("Start :",tm)
    for w in trip["waypoints"]:
        tm += random.randint(100,1000)
        w["timestamp"] += tm + i * 1000
        print(w["timestamp"])
        w["coordinates"][0] += random.randint(-1000,1000)/1000000      
        w["coordinates"][1] += random.randint(-1000,1000)/1000000      

    trips.append(trip)        


with open("trips2.json","w") as f:
    json.dump(trips,f)
    
        
## sf-trips.json
##[
##  {
##    "waypoints": [
##      {
##        "coordinates": [
##          -122.39079879999997,
##          37.7664413
##        ],
##        "timestamp": 1554772579000
##      },
##      {
##        "coordinates": [
##          -122.3908298,
##          37.7667706
##        ],
##        "timestamp": 1554772579009
##      },






