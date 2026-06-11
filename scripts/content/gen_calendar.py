import json, os, time, urllib.request, urllib.parse
from collections import Counter

key = os.environ["DH_KEY"]
TERMS = [("春运","Spring Festival travel rush"),("两会","The Two Sessions"),("高考","Gaokao college entrance exam"),
         ("防汛","Flood control"),("丰收","Harvest"),("供暖","Winter heating"),("寒潮","Cold waves"),("植树","Tree planting")]
out = {"as_of": "2026-06-11", "terms": []}
for zh, en in TERMS:
    url = "http://localhost:8000/v1/news?" + urllib.parse.urlencode({"q": zh, "group_by": "month"})
    d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"X-API-Key": key}), timeout=20))
    m = Counter()
    for b in d["buckets"]:
        m[int(b["key"][5:7])] += b["count"]
    out["terms"].append({"zh": zh, "en": en, "total": d["total"],
                         "by_month": {str(i): m.get(i, 0) for i in range(1, 13)},
                         "peak_month": m.most_common(1)[0][0]})
    time.sleep(0.6)
print(json.dumps(out, ensure_ascii=False))
