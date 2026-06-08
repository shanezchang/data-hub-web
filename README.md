# data-hub-web

data-hub 的控制台前端 —— 用户注册 / 登录 / API key 自助生成与吊销。

**零依赖、零构建**:纯静态 `index.html` + `styles.css` + `app.js`。部署到 Vercel,
用 `vercel.json` 的 rewrites 把 `/api/*` 服务端反代到后端(避开 mixed-content,免备案 HTTPS)。

## 结构
```
index.html    页面(落地 / 注册 / 登录 / 控制台,单页切换)
styles.css    样式(Fraunces + Inter,赤陶配色)
app.js        逻辑(调 /api/portal/*,JWT 存 localStorage)
vercel.json   /api/* → 反代到 http://120.55.183.188:8000/*
```

## 后端
data-hub 后端在 `shanezchang/data-hub`,门户接口 `/portal/*`,数据接口 `/v1/*`。
当前后端公网地址:`http://120.55.183.188:8000`(域名 `api.lumina-core.cn:8000`)。

## 部署到 Vercel
1. 在 Vercel 新建项目,Import 这个仓库(`shanezchang/data-hub-web`)。
2. Framework Preset 选 **Other**(纯静态,无需构建命令)。
3. Deploy。Vercel 自动给 HTTPS。
4. (可选)绑定自定义域名,如 `console.lumina-core.cn` / `www.lumina-core.cn`。

> 后端若以后换地址(或上了 HTTPS),改 `vercel.json` 里的 destination 即可。

## 本地预览
纯静态,但 `/api` 反代依赖 Vercel,本地直接开 `index.html` 调接口会跨域。
本地联调可用 `vercel dev`,或临时把 `app.js` 的 `API` 指向后端绝对地址。
