import json, os, urllib.request, urllib.parse

key = os.environ["DH_KEY"]
BASE = "http://localhost:8000"

def get(path, params=None, body=None):
    url = BASE + path + ("?" + urllib.parse.urlencode(params) if params else "")
    req = urllib.request.Request(url, headers={"X-API-Key": key, "Content-Type": "application/json"},
                                 data=json.dumps(body).encode() if body else None,
                                 method="POST" if body else "GET")
    return json.load(urllib.request.urlopen(req, timeout=20))

TERMS = [
    ("人工智能", "Artificial intelligence (AI)"),
    ("新能源", "New energy"),
    ("房地产", "Real estate"),
    ("数字经济", "Digital economy"),
    ("乡村振兴", "Rural revitalization"),
    ("一带一路", "Belt and Road"),
    ("高质量发展", "High-quality development"),
    ("半导体", "Semiconductor"),
]
keywords = []
for zh, en in TERMS:
    d = get("/v1/news", {"q": zh, "group_by": "year"})
    keywords.append({"zh": zh, "en": en, "total": d["total"],
                     "by_year": {b["key"]: b["count"] for b in d["buckets"]}})

yc = get("/v1/yc/companies/search", body={"group_by": ["batch_year", "status"]})
out = {"as_of": "2026-06-11", "keywords": keywords, "yc_survival": yc["buckets"], "yc_total": yc["total"]}
print(json.dumps(out, ensure_ascii=False))
