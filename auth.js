(() => {
  let user = null;
  let data = { favorites: [], folders: ["默认收藏"], notes: [] };
  const clone = value => JSON.parse(JSON.stringify(value));
  const request = async (url, options = {}) => {
    const response = await fetch(url, options);
    const payload = response.status === 204 ? null : await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || "请求失败");
    return payload;
  };
  const dialog = document.createElement("dialog");
  dialog.id = "loginDialog";
  dialog.innerHTML = `<form class="login-card" id="loginForm"><div class="composer-head"><div><p class="eyebrow">WELCOME BACK</p><h2>登录纸间</h2></div><button class="icon-button" id="closeLogin" type="button" aria-label="关闭">×</button></div><label>账号 ID<input id="loginId" autocomplete="username" required placeholder="输入账号 ID" /></label><label id="passwordRow" hidden>管理员密码<input id="loginPassword" type="password" autocomplete="current-password" placeholder="输入密码" /></label><p class="login-error" id="loginError" role="alert"></p><button class="save-button" type="submit">登录</button></form>`;
  document.body.append(dialog);
  const actions = document.querySelector(".topbar-actions") || document.querySelector(".topbar");
  const account = document.createElement("div");
  account.className = "account-controls";
  actions.append(account);
  const renderAccount = () => {
    account.innerHTML = user ? `<span class="account-label">${user.id}${user.role === "admin" ? " · 管理员" : ""}</span><button class="auth-button" id="logoutButton" type="button">退出</button>` : `<button class="auth-button" id="loginButton" type="button">登录</button>`;
    account.querySelector("#loginButton")?.addEventListener("click", () => dialog.showModal());
    account.querySelector("#logoutButton")?.addEventListener("click", async () => { await request("/api/logout", { method: "POST" }); user = null; data = { favorites: [], folders: ["默认收藏"], notes: [] }; renderAccount(); document.dispatchEvent(new CustomEvent("userchange", { detail: { user, data: clone(data) } })); });
  };
  const idInput = dialog.querySelector("#loginId"), passwordRow = dialog.querySelector("#passwordRow"), passwordInput = dialog.querySelector("#loginPassword"), error = dialog.querySelector("#loginError");
  idInput.addEventListener("input", () => { const admin = idInput.value.trim() === "admin"; passwordRow.hidden = !admin; passwordInput.required = admin; });
  dialog.querySelector("#closeLogin").addEventListener("click", () => dialog.close());
  dialog.querySelector("#loginForm").addEventListener("submit", async event => {
    event.preventDefault(); error.textContent = "";
    try {
      const result = await request("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: idInput.value.trim(), password: passwordInput.value }) });
      user = result.user; data = await request("/api/user-data"); dialog.close(); renderAccount(); document.dispatchEvent(new CustomEvent("userchange", { detail: { user, data: clone(data) } }));
    } catch (issue) { error.textContent = issue.message; }
  });
  const ready = (async () => { try { const result = await request("/api/session"); user = result.user; if (user) data = await request("/api/user-data"); } catch { user = null; } renderAccount(); return { user, data: clone(data) }; })();
  window.userStore = {
    get user() { return user; }, get data() { return clone(data); }, ready,
    requireLogin() { if (user) return true; dialog.showModal(); return false; },
    async saveUserData(next) { if (!user) throw new Error("请先登录"); data = { favorites: Array.isArray(next.favorites) ? next.favorites : [], folders: Array.isArray(next.folders) && next.folders.length ? next.folders : ["默认收藏"], notes: Array.isArray(next.notes) ? next.notes : [] }; await request("/api/user-data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); document.dispatchEvent(new CustomEvent("userchange", { detail: { user, data: clone(data) } })); }
  };
})();
