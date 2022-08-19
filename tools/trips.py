import pandas as pd
import random

df = pd.read_json("bike-vis-trails.json")
print(df.describe())

df1 = df[:10].segments.copy()
print(df1.describe())

ts = 100 # start time
ln = 0
for i in df1:
    ln += len(i)
    print(len(i))

ln = round(ln/len(df1))
print("Mean len: ",ln)


# update timestamps
for i in df1:
    for s in i:
        s[2] = ts
        ts += random.randint(10,100)
        


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
                
df1.to_json("trips.json",index=False,orient="split")

