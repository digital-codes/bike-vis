import pandas as pd
import random

df = pd.read_json("sf-trips.json")
print(df.describe())

df1 = df[:10].waypoints.copy()
print(df1.describe())

ts = 100 # start time
ln = 0
for i in df1:
    ln += len(i)
    print(len(i))

ln = round(ln/len(df1))
print("Mean len: ",ln)


trips = []

# update timestamps
for i in df1:
    for s in i:
        s["timestamp"] = ts
        ts += random.randint(10,100)
    trips.append({"waypoints":i})
        


##{
##    "name": "segments",
##    "data": [
##        [
##            [
##                13.417385,
##                52.510078,
##                100
##            ],
##            [
                
# df1.to_json("trips2.json",index=False,orient="split")

import json
with open("trips2.json","w") as f:
    json.dump(trips,f)
    




