import re
import json
file = open("a.txt", "r", encoding="utf-8")
dic={"nodes":[],"links":[]}
for line in file:
    a=file.readline()
    mark="";
    if "&" in a:
        b=a.split("&")
        mark="and"
    elif "/" in a:
        b = a.split("/")
        mark = "or"
    if len(b)>2:
        continue
    b[1]=b[1].strip()
    c=re.sub('^.*\((.*?)\)[^\(]*$', '\g<1>', b[1])
    if int(c)<25:
        continue
    b[1]=b[1][:-(len(c)+2)].strip()
    b[1]=b[1].strip('\u200e')
    x=0
    source=0
    target=0
    while x<len(b):
        has=False
        i=0
        while i<len(dic["nodes"]):
            if b[x] in dic["nodes"][i]["name"]:
                has=True
                if x==0:
                    source=i
                else:
                    target=i
            i=i+1
        if has==False:
            dic["nodes"].append({"name":b[x],"group":1})
            if x == 0:
                source = len(dic["nodes"])-1
            else:
                target = len(dic["nodes"])-1
        x=x+1
    if mark=="and":
        dic["links"].append({"source":source,"target":target,"weight":c})
        dic["links"].append({"source": target, "target": source, "weight": c})

    elif mark=="or":
        dic["links"].append({"source":source,"target":target,"weight":c})
    print(dic["links"])
    print(dic["nodes"])
with open('data.json', 'w') as outfile:
    json.dump(dic, outfile,indent=4)

