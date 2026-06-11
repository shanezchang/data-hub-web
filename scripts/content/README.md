# 内容线数据生成脚本

页面数据快照(lib/trends-data.json, lib/insights-data/*, lib/regions-data/*)的生成器。
运行方式:本机执行,经 ssh 在 ECS 回环跑查询(快且稳),key 走 stdin 不落盘:

    scp -q scripts/content/<gen>.py root@120.55.183.188:/tmp/g.py
    cat ~/.config/datahub/test-key | ssh root@120.55.183.188 'read -r K; DH_KEY="$K" python3 /tmp/g.py <args>; rm -f /tmp/g.py' > <输出>

纪律:
- 查询间 0.55s 节流(key 限流 120/min)
- 刷新快照后必须更新页面 as_of;Regions 季度刷一次
- gen_province.py 在本机跑(解析 lib/regions.ts 产出目标清单),gen_batch.py 在服务器跑
