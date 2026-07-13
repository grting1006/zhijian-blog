const seedArticles = [
  { id: "paper", title: "给生活留一张白纸", date: "2026-07-08", category: "随笔", excerpt: "不是所有空白都需要立刻填满。", content: "有一阵子，我把日程排得很满。每一个小时都要有名字，每一次停顿都像一种浪费。\n\n直到某个傍晚，我在窗边坐了很久。没有读书，也没有打开任何一份文件。街上的光一点点暗下来，我才发现，原来留白不是无所事事，而是给感受留下入口。\n\n## 练习留白\n\n现在我会在周末留出一个下午，不安排目的地。走到哪儿算哪儿，看到一家没有去过的店就进去。那些没有被计划捕捉的时刻，常常比完成清单更让我记得。\n\n> 生活不是一份等待勾选的任务列表。\n\n也许我们需要的不是更高效，而是偶尔允许自己，像一张还没落笔的白纸。" },
  { id: "rain", title: "雨后去了一趟旧书店", date: "2026-06-21", category: "城市", excerpt: "潮湿的纸页与一杯很慢的咖啡。", content: "雨停的时候，巷子里的砖地还泛着亮。我绕路去了那家开在二楼的旧书店。\n\n老板正在给书页除湿，空气里有纸张和木头混在一起的味道。我带走了一本诗集，扉页上留着前一位读者铅笔写下的日期：1998 年的秋天。\n\n一本书被交到陌生人手里，也许就是一种安静的相遇。" },
  { id: "work", title: "把注意力还给一件事", date: "2026-05-30", category: "工作", excerpt: "少一些切换，事情反而开始向前走。", content: "屏幕上的标签页总会越开越多，直到我意识到：分心不总是因为事情太多，而是因为我们习惯了随时响应。\n\n最近我尝试把上午的前九十分钟留给最重要的一件事。关掉提醒，不回复消息，只做一件需要思考的工作。\n\n结果并不神奇，但很踏实。**专注不是逼自己更快，而是让时间重新有了形状。**" }
];
const storageKey = "zhijian-articles";
let articles = JSON.parse(localStorage.getItem(storageKey) || "null") || seedArticles;
let activeId = articles[0]?.id;
let editingId = null;
const list = document.querySelector("#articleList"), view = document.querySelector("#articleView"), count = document.querySelector("#articleCount");
const escapeHtml = (value) => value.replace(/[&<>\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
function inlineMarkup(text) { return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); }
function markup(text) { return text.split("\n").map(line => { if (line.startsWith("## ")) return `<h3>${inlineMarkup(line.slice(3))}</h3>`; if (line.startsWith("> ")) return `<blockquote>${inlineMarkup(line.slice(2))}</blockquote>`; if (!line.trim()) return ""; return `<p>${inlineMarkup(line)}</p>`; }).join(""); }
function dateLabel(date) { return new Intl.DateTimeFormat("zh-CN", { year:"numeric", month:"long", day:"numeric" }).format(new Date(`${date}T00:00:00`)); }
function persist() { localStorage.setItem(storageKey, JSON.stringify(articles)); }
function render() { const current = articles.find(a => a.id === activeId) || articles[0]; count.textContent = String(articles.length).padStart(2,"0"); list.innerHTML = articles.length ? articles.map(article => `<a class="article-item ${article.id === current?.id ? "active" : ""}" href="article.html?id=${encodeURIComponent(article.id)}"><time>${article.date.replaceAll("-", ".")}</time><h3>${escapeHtml(article.title)}</h3><span class="read-arrow">↗</span></a>`).join("") : `<p class="empty-list">还没有文章。<br />从右上角写下第一篇吧。</p>`; view.innerHTML = current ? `<div class="article-meta">点击文章，进入独立详情页</div><h2>${escapeHtml(current.title)}</h2><p class="lead">${escapeHtml(current.excerpt)}</p><div class="article-body">${markup(current.content)}</div>` : `<div class="empty-reading"><span>✦</span><h2>留一页空白</h2><p>新的记录，会从这里开始。</p></div>`; }
const dialog = document.querySelector("#composer"), form = document.querySelector("#articleForm");
const field = id => document.querySelector(id);
function setComposerMode(article) { editingId = article?.id || null; field("#composerKicker").textContent = article ? "EDIT ENTRY" : "NEW ENTRY"; field("#composerTitle").textContent = article ? "修改这篇文章" : "写下这一刻"; field("#submitArticle").textContent = article ? "保存修改" : "发布文章"; }
function open(article) { form.reset(); setComposerMode(article); field("#fileName").textContent = "支持 .md / .txt"; if (article) { field("#titleInput").value = article.title; field("#dateInput").value = article.date; field("#categoryInput").value = article.category; field("#excerptInput").value = article.excerpt; field("#contentInput").value = article.content; } else { field("#dateInput").value = new Date().toISOString().slice(0,10); } dialog.showModal(); }
function closeComposer() { dialog.close(); editingId = null; }
document.querySelector("#openComposer").addEventListener("click", () => open()); ["#closeComposer", "#cancelComposer"].forEach(id => document.querySelector(id).addEventListener("click", closeComposer));
document.querySelector("#importButton").addEventListener("click", () => document.querySelector("#fileInput").click());
document.querySelector("#fileInput").addEventListener("change", async event => { const file = event.target.files[0]; if (!file) return; document.querySelector("#contentInput").value = await file.text(); document.querySelector("#fileName").textContent = file.name; });
form.addEventListener("submit", event => { event.preventDefault(); const article = { id: editingId || `${Date.now()}`, title: field("#titleInput").value.trim(), date: field("#dateInput").value, category: field("#categoryInput").value.trim(), excerpt: field("#excerptInput").value.trim(), content: field("#contentInput").value.trim() }; const existingIndex = articles.findIndex(item => item.id === editingId); if (existingIndex >= 0) articles[existingIndex] = article; else articles.unshift(article); persist(); activeId = article.id; closeComposer(); render(); });
const editTarget = new URLSearchParams(location.search).get("edit");
if (editTarget) { const article = articles.find(item => item.id === editTarget); if (article) open(article); history.replaceState({}, "", "index.html"); }
render();
