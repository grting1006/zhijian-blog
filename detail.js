const articles = window.loadArticles("zhijian-articles");
const article = articles.find(item => item.id === new URLSearchParams(location.search).get("id"));
const favoritesKey = "zhijian-favorites";
const foldersKey = "zhijian-favorite-folders";
const favorites = window.loadBlogCollection(favoritesKey);
const folders = window.loadBlogCollection(foldersKey, ["默认收藏"]);
const isLocalAdmin = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:";
const escapeHtml = value => value.replace(/[&<>\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
const inlineMarkup = text => escapeHtml(text)
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
const collectButton = (type, title, content) => `<button class="hover-collect" type="button" data-collect-type="${type}" data-collect-title="${encodeURIComponent(title)}" data-collect-content="${encodeURIComponent(content)}">收藏</button>`;
const chartMarkup = (title, labelText, valueText) => { const labels = labelText.split(",").map(item => item.trim()); const values = valueText.split(",").map(Number); if (!labels.length || labels.length !== values.length || values.some(value => !Number.isFinite(value))) return ""; const max = Math.max(...values, 1); const bars = labels.map((label, index) => `<div class="chart-bar-wrap"><span class="chart-value">${values[index]}</span><span class="chart-bar" style="height:${Math.max(8, values[index] / max * 100)}%"></span><span class="chart-label">${escapeHtml(label)}</span></div>`).join(""); const source = `{{chart|${title}|${labelText}|${valueText}}}`; return `<figure class="inline-chart zoomable"><figcaption><span>${escapeHtml(title)}</span>${collectButton("chart", title, source)}</figcaption><div class="chart-bars">${bars}</div></figure>`; };
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
    else if (image) output.push(`<figure class="inline-image zoomable"><img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1])}" /><figcaption>${escapeHtml(image[1])}${collectButton("image", image[1], line)}</figcaption></figure>`);
    else if (line.startsWith("## ")) output.push(`<h3>${inlineMarkup(line.slice(3))}</h3>`);
    else if (line.startsWith("> ")) output.push(`<blockquote>${inlineMarkup(line.slice(2))}</blockquote>`);
    else if (line.trim()) output.push(`<p>${inlineMarkup(line)}</p>`);
  });
  flushList();
  return output.join("");
};
const dateLabel = date => new Intl.DateTimeFormat("zh-CN", { year:"numeric", month:"long", day:"numeric" }).format(new Date(`${date}T00:00:00`));
document.title = article ? `${article.title} | 纸间` : "文章未找到 | 纸间";
const view = document.querySelector("#articleView");
view.innerHTML = article ? `<div class="article-meta">${escapeHtml(article.category).toUpperCase()} &nbsp;/&nbsp; ${dateLabel(article.date)}</div><div class="article-title-row"><div class="collectable-title"><h1>${escapeHtml(article.title)}</h1>${collectButton("article", article.title, article.id)}</div>${isLocalAdmin ? `<div class="article-actions"><a class="edit-link" href="index.html?edit=${encodeURIComponent(article.id)}">编辑</a><button class="delete-button" type="button" id="deleteArticle">删除</button></div>` : ""}</div><p class="lead">${escapeHtml(article.excerpt)}</p><div class="article-body">${markup(article.content)}</div>` : `<div class="article-meta">NOT FOUND</div><h1>这篇文章不在这里。</h1><p class="lead">它可能已被移除，或链接地址不正确。</p>`;
document.body.insertAdjacentHTML("beforeend", `<dialog id="collectDialog"><section class="favorites-card"><div class="composer-head"><div><p class="eyebrow">CHOOSE A COLLECTION</p><h2>收藏到哪里？</h2></div><button class="icon-button" id="closeCollect" type="button" aria-label="关闭">×</button></div><div class="collection-picker" id="collectionPicker">${folders.map(folder => `<button type="button" data-folder="${escapeHtml(folder)}">${escapeHtml(folder)}</button>`).join("")}</div></section></dialog><button class="selection-collect" id="selectionCollect" type="button" hidden>收藏选中文字</button>`);
function persistRepositoryData() { fetch("/api/local-data", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ articles:JSON.parse(localStorage.getItem("zhijian-articles") || "[]"), favorites, folders, notes:JSON.parse(localStorage.getItem("zhijian-reader-notes") || "[]") }) }).catch(() => {}); }
if (article && isLocalAdmin) document.querySelector("#deleteArticle").addEventListener("click", () => { if (!confirm(`确定删除《${article.title}》吗？此操作无法撤销。`)) return; localStorage.setItem("zhijian-articles", JSON.stringify(articles.filter(item => item.id !== article.id))); persistRepositoryData(); location.href = "index.html"; });
if (article) { let pendingFavorite; const picker = document.querySelector("#collectDialog"); const selectionButton = document.querySelector("#selectionCollect"); const openPicker = (type, title, content) => { pendingFavorite = { type, title, content }; picker.showModal(); }; const saveFavorite = folder => { if (!pendingFavorite || favorites.some(item => item.type === pendingFavorite.type && item.content === pendingFavorite.content && item.folder === folder)) return; favorites.push({ id:`${Date.now()}-${Math.random().toString(16).slice(2)}`, ...pendingFavorite, folder, articleId:article.id }); localStorage.setItem(favoritesKey, JSON.stringify(favorites)); persistRepositoryData(); picker.close(); pendingFavorite = null; }; document.querySelector("#closeCollect").addEventListener("click", () => picker.close()); document.querySelector("#collectionPicker").addEventListener("click", event => { const button = event.target.closest("[data-folder]"); if (button) saveFavorite(button.dataset.folder); }); view.addEventListener("click", event => { const collect = event.target.closest("[data-collect-type]"); if (collect) { event.stopPropagation(); openPicker(collect.dataset.collectType, decodeURIComponent(collect.dataset.collectTitle), decodeURIComponent(collect.dataset.collectContent)); return; } const figure = event.target.closest(".zoomable"); if (figure) figure.classList.toggle("expanded"); }); document.addEventListener("selectionchange", () => { const selection = getSelection(); const text = selection?.toString().trim(); const range = selection?.rangeCount ? selection.getRangeAt(0) : null; if (!text || !range || !view.querySelector(".article-body")?.contains(range.commonAncestorContainer)) { selectionButton.hidden = true; return; } const rect = range.getBoundingClientRect(); selectionButton.hidden = false; selectionButton.style.left = `${Math.max(12, rect.left)}px`; selectionButton.style.top = `${Math.max(12, rect.bottom + 8)}px`; selectionButton.dataset.text = text; }); selectionButton.addEventListener("click", () => { openPicker("text", selectionButton.dataset.text.slice(0, 38), selectionButton.dataset.text); selectionButton.hidden = true; getSelection().removeAllRanges(); }); }
