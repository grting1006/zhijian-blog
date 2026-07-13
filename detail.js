let articles = window.loadArticles("zhijian-articles");
const article = articles.find(item => item.id === new URLSearchParams(location.search).get("id"));
const favoritesKey = "zhijian-favorites";
const foldersKey = "zhijian-favorite-folders";
let favorites = [];
let folders = ["默认收藏"];
let isAdmin = false;
const escapeHtml = value => value.replace(/[&<>\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
const inlineMarkup = text => escapeHtml(text)
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
const contentKey = value => { let hash = 5381; for (const char of value) hash = (hash * 33) ^ char.charCodeAt(0); return `saved-${hash >>> 0}`; };
const isCollected = (type, content) => favorites.some(item => item.type === type && item.content === content);
const collectButton = (type, title, content) => `<button class="hover-collect ${isCollected(type, content) ? "is-collected" : ""}" type="button" aria-label="收藏" title="收藏" data-collect-type="${type}" data-collect-title="${encodeURIComponent(title)}" data-collect-content="${encodeURIComponent(content)}">${isCollected(type, content) ? "★" : "☆"}</button>`;
const sentenceMarkup = text => (text.match(/[^。！？!?；;]+[。！？!?；;]?/g) || [text]).map(sentence => { const content = sentence.trim(); return content ? `<span class="collectable-sentence" data-content-key="${contentKey(content)}">${inlineMarkup(content)}${collectButton("text", content.slice(0, 38), content)}</span>` : ""; }).join("");
const chartMarkup = (title, labelText, valueText) => { const labels = labelText.split(",").map(item => item.trim()); const values = valueText.split(",").map(Number); if (!labels.length || labels.length !== values.length || values.some(value => !Number.isFinite(value))) return ""; const max = Math.max(...values, 1); const bars = labels.map((label, index) => `<div class="chart-bar-wrap"><span class="chart-value">${values[index]}</span><span class="chart-bar" style="height:${Math.max(8, values[index] / max * 100)}%"></span><span class="chart-label">${escapeHtml(label)}</span></div>`).join(""); const source = `{{chart|${title}|${labelText}|${valueText}}}`; return `<figure class="inline-chart" data-content-key="${contentKey(source)}"><figcaption><span>${escapeHtml(title)}</span>${collectButton("chart", title, source)}</figcaption><div class="chart-bars">${bars}</div></figure>`; };
const markup = text => {
  const output = [];
  let listItems = [];
  const flushList = () => {
    if (!listItems.length) return;
    output.push(`<ul>${listItems.join("")}</ul>`);
    listItems = [];
  };
  text.split("\n").forEach(line => {
    if (line.startsWith("- ")) {
      listItems.push(`<li>${inlineMarkup(line.slice(2))}</li>`);
      return;
    }
    flushList();
    const image = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    const chart = line.match(/^\{\{chart\|([^|]+)\|([^|]+)\|([^|]+)\}\}$/);
    if (chart) output.push(chartMarkup(chart[1], chart[2], chart[3]));
    else if (image) output.push(`<figure class="inline-image" data-content-key="${contentKey(line)}"><img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1])}" /><figcaption>${escapeHtml(image[1])}${collectButton("image", image[1], line)}</figcaption></figure>`);
    else if (line.startsWith("## ")) output.push(`<h3>${inlineMarkup(line.slice(3))}</h3>`);
    else if (line.startsWith("> ")) output.push(`<blockquote>${inlineMarkup(line.slice(2))}</blockquote>`);
    else if (line.trim()) output.push(`<p>${sentenceMarkup(line)}</p>`);
  });
  flushList();
  return output.join("");
};
const dateLabel = date => new Intl.DateTimeFormat("zh-CN", { year:"numeric", month:"long", day:"numeric" }).format(new Date(`${date}T00:00:00`));
document.title = article ? `${article.title} | 纸间` : "文章未找到 | 纸间";
const view = document.querySelector("#articleView");
view.innerHTML = article ? `<div class="article-meta">${escapeHtml(article.category).toUpperCase()} &nbsp;/&nbsp; ${dateLabel(article.date)}</div><div class="article-title-row"><div class="collectable-title" data-content-key="article"><h1>${escapeHtml(article.title)}</h1>${collectButton("article", article.title, article.id)}</div></div><p class="lead">${escapeHtml(article.excerpt)}</p><div class="article-body">${markup(article.content)}</div>` : `<div class="article-meta">NOT FOUND</div><h1>这篇文章不在这里。</h1><p class="lead">它可能已被移除，或链接地址不正确。</p>`;
document.body.insertAdjacentHTML("beforeend", `<dialog id="collectDialog"><section class="favorites-card"><div class="composer-head"><div><p class="eyebrow">CHOOSE A COLLECTION</p><h2>收藏到哪里？</h2></div><button class="icon-button" id="closeCollect" type="button" aria-label="关闭">×</button></div><div class="collection-picker" id="collectionPicker">${folders.map(folder => `<button type="button" data-folder="${escapeHtml(folder)}">${escapeHtml(folder)}</button>`).join("")}</div></section></dialog>`);
const requestedTarget = new URLSearchParams(location.search).get("target");
if (requestedTarget) { const target = [...view.querySelectorAll("[data-content-key]")].find(element => element.dataset.contentKey === requestedTarget); if (target) { target.scrollIntoView({ behavior:"smooth", block:"center" }); target.classList.add("favorite-target"); } }
function persistRepositoryData() { return fetch("/api/local-data", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ articles }) }); }
if (article) { let pendingFavorite; const picker = document.querySelector("#collectDialog"); const refreshStars = () => view.querySelectorAll("[data-collect-type]").forEach(button => { const type = button.dataset.collectType, content = decodeURIComponent(button.dataset.collectContent); const collected = isCollected(type, content); button.classList.toggle("is-collected", collected); button.textContent = collected ? "★" : "☆"; }); const renderPicker = () => { document.querySelector("#collectionPicker").innerHTML = folders.map(folder => `<button type="button" data-folder="${escapeHtml(folder)}">${escapeHtml(folder)}</button>`).join(""); }; const openPicker = (type, title, content) => { if (!window.userStore.requireLogin()) return; pendingFavorite = { type, title, content }; renderPicker(); picker.showModal(); }; const saveFavorite = async folder => { if (!pendingFavorite || favorites.some(item => item.type === pendingFavorite.type && item.content === pendingFavorite.content && item.folder === folder)) return; favorites.push({ id:`${Date.now()}-${Math.random().toString(16).slice(2)}`, ...pendingFavorite, folder, articleId:article.id }); await window.userStore.saveUserData({ favorites, folders, notes:window.userStore.data.notes }); refreshStars(); picker.close(); pendingFavorite = null; }; document.querySelector("#closeCollect").addEventListener("click", () => picker.close()); document.querySelector("#collectionPicker").addEventListener("click", event => { const button = event.target.closest("[data-folder]"); if (button) saveFavorite(button.dataset.folder); }); view.addEventListener("click", event => { const collect = event.target.closest("[data-collect-type]"); if (collect) { event.stopPropagation(); openPicker(collect.dataset.collectType, decodeURIComponent(collect.dataset.collectTitle), decodeURIComponent(collect.dataset.collectContent)); } }); }
function renderAdminActions() { if (!article || !isAdmin || document.querySelector("#deleteArticle")) return; const row = view.querySelector(".article-title-row"); row.insertAdjacentHTML("beforeend", `<div class="article-actions"><a class="edit-link" href="index.html?edit=${encodeURIComponent(article.id)}">编辑</a><button class="delete-button" type="button" id="deleteArticle">删除</button></div>`); document.querySelector("#deleteArticle").addEventListener("click", async () => { if (!confirm(`确定删除《${article.title}》吗？此操作无法撤销。`)) return; try { articles = articles.filter(item => item.id !== article.id); await persistRepositoryData(); localStorage.setItem("zhijian-articles", JSON.stringify(articles)); location.href = "index.html"; } catch { alert("删除失败，请稍后重试。"); } }); }
window.userStore.ready.then(({ user, data }) => { isAdmin = user?.role === "admin"; favorites = data.favorites; folders = data.folders.length ? data.folders : ["默认收藏"]; renderAdminActions(); view.querySelectorAll("[data-collect-type]").forEach(button => { const collected = isCollected(button.dataset.collectType, decodeURIComponent(button.dataset.collectContent)); button.classList.toggle("is-collected", collected); button.textContent = collected ? "★" : "☆"; }); });
document.addEventListener("userchange", event => { isAdmin = event.detail.user?.role === "admin"; favorites = event.detail.data.favorites; folders = event.detail.data.folders.length ? event.detail.data.folders : ["默认收藏"]; renderAdminActions(); });
