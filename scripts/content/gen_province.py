"""解析 lib/regions.ts -> 对指定省批量查询 -> 写 lib/regions-data/<slug>.json(在服务器上跑查询部分)"""
import json, re, sys

src = open('/Users/shanechang/Documents/Code/GitProjects/github.com/shanezchang/data-hub-web/lib/regions.ts').read()
provinces = []
for pm in re.finditer(r'slug:\s*"([^"]+)",\s*zh:\s*"([^"]+)",\s*en:\s*"([^"]+)"', src):
    provinces.append({"slug": pm.group(1), "zh": pm.group(2), "en": pm.group(3), "start": pm.start()})
# 城市归属:按位置切片
blocks = []
for i, p in enumerate(provinces):
    end = provinces[i+1]["start"] if i+1 < len(provinces) else len(src)
    seg = src[p["start"]:end]
    cities = [{"zh": m.group(1), "pinyin": m.group(2), "query": m.group(3)}
              for m in re.finditer(r'\{\s*zh:\s*"([^"]+)",\s*pinyin:\s*"([^"]+)",\s*query:\s*"([^"]+)"\s*\}', seg)]
    blocks.append({**{k: p[k] for k in ("slug","zh","en")}, "cities": cities})

targets = sys.argv[1].split(",")
out = [b for b in blocks if b["slug"] in targets]
assert len(out) == len(targets), f"未找齐: {[b['slug'] for b in out]}"
print(json.dumps(out, ensure_ascii=False))
