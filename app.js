/* data-hub 控制台前端逻辑(零依赖)。
   所有 API 走 /api/*,由 Vercel rewrites 反代到后端 http://...:8000/*。 */

const API = "/api";
const TOKEN_KEY = "datahub_token";

const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

/* ---------- HTTP ---------- */
async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = `Bearer ${token.get()}`;
  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) {
    const msg = data?.error?.message || data?.detail || `请求失败 (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

/* ---------- UI 辅助 ---------- */
function toast(msg, kind = "") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast " + kind;
  el.hidden = false;
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.hidden = true), 3200);
}

function showView(name) {
  document.querySelectorAll(".view").forEach((v) => {
    v.hidden = v.dataset.view !== name;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderNav(user) {
  const nav = document.getElementById("nav-actions");
  if (user) {
    nav.innerHTML = `<span class="who">${escapeHtml(user.email)}</span>
      <button class="btn btn-ghost btn-sm" data-nav="dashboard">控制台</button>
      <button class="btn btn-ghost btn-sm" data-nav="settings">设置</button>
      <button class="btn btn-ghost btn-sm" id="btn-logout">退出</button>`;
    document.getElementById("btn-logout").onclick = logout;
  } else {
    nav.innerHTML = `<button class="btn btn-ghost btn-sm" data-nav="login">登录</button>
      <button class="btn btn-primary btn-sm" data-nav="register">注册</button>`;
  }
}

/* ---------- 落地/路由 ---------- */
function navTo(name) {
  if (name === "dashboard") return loadDashboard();
  if (name === "settings") return loadSettings();
  if (name === "changelog") return loadChangelog();
  showView(name);
}

/* ---------- 更新日志 ---------- */
const CHANGE_TYPE_LABEL = { added: "新增", changed: "优化", fixed: "修复", removed: "移除", security: "安全" };
let _changelogCache = null;

async function fetchChangelog() {
  if (_changelogCache) return _changelogCache;
  const res = await fetch("/changelog.json", { cache: "no-cache" });
  _changelogCache = await res.json();
  return _changelogCache;
}

async function loadChangelog() {
  showView("changelog");
  const list = document.getElementById("changelog-list");
  if (list.dataset.rendered) return;
  try {
    const data = await fetchChangelog();
    list.innerHTML = data.releases.map((r) => `
      <article class="cl-rel">
        <div class="cl-meta">
          <span class="cl-ver">v${escapeHtml(r.version)}</span>
          <time class="cl-date">${escapeHtml(r.date)}</time>
        </div>
        <div class="cl-body">
          ${r.title ? `<h3 class="cl-title">${escapeHtml(r.title)}</h3>` : ""}
          <ul class="cl-changes">
            ${r.changes.map((c) => `
              <li><span class="cl-tag cl-${escapeHtml(c.type)}">${CHANGE_TYPE_LABEL[c.type] || escapeHtml(c.type)}</span>${escapeHtml(c.text)}</li>
            `).join("")}
          </ul>
        </div>
      </article>`).join("");
    list.dataset.rendered = "1";
  } catch (_) {
    list.innerHTML = `<p class="muted">更新日志加载失败。</p>`;
  }
}

async function syncFooterVersion() {
  try {
    const data = await fetchChangelog();
    const el = document.getElementById("foot-version");
    if (el && data.current) el.textContent = `平台 v${data.current}`;
  } catch (_) { /* 页脚版本保持 HTML 兜底值 */ }
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-nav]");
  if (t) { e.preventDefault(); navTo(t.dataset.nav); }
});

/* ---------- 发送验证码(注册 / 重置共用) ---------- */
function bindSendCode(btnId, formId, endpoint) {
  document.getElementById(btnId).onclick = async (e) => {
    const email = document.getElementById(formId).email.value.trim();
    if (!email) return toast("请先填邮箱", "err");
    const btn = e.target;
    btn.disabled = true; btn.textContent = "发送中…";
    try {
      await api(endpoint, { method: "POST", body: { email } });
      toast("验证码已发送,请查收邮箱", "ok");
      let n = 60;
      btn.textContent = `${n}s 后重发`;
      const iv = setInterval(() => {
        n -= 1;
        btn.textContent = n > 0 ? `${n}s 后重发` : "发送验证码";
        if (n <= 0) { clearInterval(iv); btn.disabled = false; }
      }, 1000);
    } catch (err) {
      toast(err.message, "err");
      btn.disabled = false; btn.textContent = "发送验证码";
    }
  };
}

/* ---------- 注册 ---------- */
bindSendCode("btn-send-code", "form-register", "/portal/send-code");

document.getElementById("form-register").onsubmit = async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = {
    email: f.email.value.trim(),
    code: f.code.value.trim(),
    password: f.password.value,
    name: f.name.value.trim() || null,
  };
  try {
    const res = await api("/portal/register", { method: "POST", body });
    token.set(res.access_token);
    toast("注册成功 🎉", "ok");
    loadDashboard();
  } catch (err) { toast(err.message, "err"); }
};

/* ---------- 登录 ---------- */
document.getElementById("form-login").onsubmit = async (e) => {
  e.preventDefault();
  const f = e.target;
  try {
    const res = await api("/portal/login", {
      method: "POST",
      body: { email: f.email.value.trim(), password: f.password.value },
    });
    token.set(res.access_token);
    loadDashboard();
  } catch (err) { toast(err.message, "err"); }
};

function logout() {
  token.clear();
  renderNav(null);
  showView("landing");
  toast("已退出");
}

/* ---------- 忘记密码 / 重置 ---------- */
bindSendCode("btn-reset-code", "form-reset", "/portal/forgot-password");

document.getElementById("form-reset").onsubmit = async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = {
    email: f.email.value.trim(),
    code: f.code.value.trim(),
    new_password: f.password.value,
  };
  try {
    await api("/portal/reset-password", { method: "POST", body });
    toast("密码已重置,请用新密码登录", "ok");
    f.reset();
    showView("login");
  } catch (err) { toast(err.message, "err"); }
};

/* ---------- 账号设置 ---------- */
async function loadSettings() {
  if (!token.get()) return showView("login");
  try {
    const user = await api("/portal/me", { auth: true });
    renderNav(user);
    document.getElementById("settings-email").textContent = user.email;
    document.getElementById("form-profile").name.value = user.name || "";
    showView("settings");
  } catch (err) {
    token.clear();
    showView("login");
    toast("登录已失效,请重新登录", "err");
  }
}

document.getElementById("form-profile").onsubmit = async (e) => {
  e.preventDefault();
  const name = e.target.name.value.trim();
  try {
    const user = await api("/portal/me", { method: "PATCH", auth: true, body: { name: name || null } });
    renderNav(user);
    toast("昵称已保存", "ok");
  } catch (err) { toast(err.message, "err"); }
};

document.getElementById("form-password").onsubmit = async (e) => {
  e.preventDefault();
  const f = e.target;
  try {
    await api("/portal/change-password", {
      method: "POST", auth: true,
      body: { current_password: f.current_password.value, new_password: f.new_password.value },
    });
    f.reset();
    toast("密码已修改", "ok");
  } catch (err) { toast(err.message, "err"); }
};

/* ---------- 控制台 ---------- */
async function loadDashboard() {
  if (!token.get()) return showView("login");
  try {
    const user = await api("/portal/me", { auth: true });
    renderNav(user);
    document.getElementById("dash-user").textContent =
      `${user.email}${user.name ? " · " + user.name : ""}`;
    document.getElementById("new-key-banner").hidden = true;
    await loadKeys();
    showView("dashboard");
  } catch (err) {
    token.clear();
    showView("login");
    toast("登录已失效,请重新登录", "err");
  }
}

async function loadKeys() {
  const keys = await api("/portal/keys", { auth: true });
  const tbody = document.getElementById("keys-tbody");
  const empty = document.getElementById("keys-empty");
  tbody.innerHTML = "";
  empty.hidden = keys.length > 0;
  for (const k of keys) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(k.name)}</td>
      <td><code>${k.key_prefix}…</code></td>
      <td>${k.scopes.join(", ")}</td>
      <td>${k.rate_limit_per_min}/min</td>
      <td><span class="pill ${k.revoked ? "revoked" : "active"}">${k.revoked ? "已吊销" : "有效"}</span></td>
      <td>${k.revoked ? "" : `<button class="btn-link" data-revoke="${k.id}"><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>吊销</button>`}</td>`;
    tbody.appendChild(tr);
  }
  tbody.querySelectorAll("[data-revoke]").forEach((b) => {
    b.onclick = () => revokeKey(b.dataset.revoke);
  });
}

document.getElementById("btn-new-key").onclick = async () => {
  const name = prompt("给这个 key 起个名字(标记它的用途):", "我的应用");
  if (!name) return;
  try {
    const res = await api("/portal/keys", { method: "POST", auth: true, body: { name } });
    const banner = document.getElementById("new-key-banner");
    document.getElementById("new-key-value").textContent = res.api_key;
    banner.hidden = false;
    document.getElementById("btn-copy-key").onclick = () => {
      navigator.clipboard.writeText(res.api_key).then(() => toast("已复制", "ok"));
    };
    await loadKeys();
    toast("已生成,请立即复制保存", "ok");
  } catch (err) { toast(err.message, "err"); }
};

async function revokeKey(id) {
  if (!confirm("吊销后该 key 立即失效,确定?")) return;
  try {
    await api(`/portal/keys/${id}`, { method: "DELETE", auth: true });
    await loadKeys();
    toast("已吊销", "ok");
  } catch (err) { toast(err.message, "err"); }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- 启动 ---------- */
(async function init() {
  syncFooterVersion();
  if (token.get()) {
    await loadDashboard();
  } else {
    renderNav(null);
    showView("landing");
  }
})();
