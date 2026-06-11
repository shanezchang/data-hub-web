import json, os, sys, time, urllib.request, urllib.parse

key = os.environ["DH_KEY"]
BASE = "http://localhost:8000"

def get(path, params):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"X-API-Key": key})
    return json.load(urllib.request.urlopen(req, timeout=20))

provinces = json.load(open("/tmp/prov_targets.json"))
result = []
for p in provinces:
    cities = []
    for c in p["cities"]:
        time.sleep(0.55)  # key 限流 120/min,节流到 ~109/min
        agg = get("/v1/news", {"q": c["query"], "group_by": "year"})
        items = get("/v1/news", {"q": c["query"], "fields": "news_date,title,url", "limit": 3})
        cities.append({**c, "total": agg["total"],
                       "by_year": {b["key"]: b["count"] for b in agg["buckets"]},
                       "recent": [{"date": i["news_date"], "title": i["title"], "url": i["url"]} for i in items["items"]]})
    result.append({"as_of": "2026-06-11", "province": {"zh": p["zh"], "en": p["en"], "slug": p["slug"]}, "cities": cities})
    print(f"{p['slug']} done: {len(cities)} cities", file=sys.stderr)
print(json.dumps(result, ensure_ascii=False))
