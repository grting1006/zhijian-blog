const seedArticles = [
  { id: "paper", title: "给生活留一张白纸", date: "2026-07-08", category: "随笔", excerpt: "不是所有空白都需要立刻填满。", content: "有一阵子，我把日程排得很满。每一个小时都要有名字，每一次停顿都像一种浪费。\n\n直到某个傍晚，我在窗边坐了很久。没有读书，也没有打开任何一份文件。街上的光一点点暗下来，我才发现，原来留白不是无所事事，而是给感受留下入口。\n\n## 练习留白\n\n现在我会在周末留出一个下午，不安排目的地。走到哪儿算哪儿，看到一家没有去过的店就进去。那些没有被计划捕捉的时刻，常常比完成清单更让我记得。\n\n> 生活不是一份等待勾选的任务列表。\n\n也许我们需要的不是更高效，而是偶尔允许自己，像一张还没落笔的白纸。" },
  { id: "rain", title: "雨后去了一趟旧书店", date: "2026-06-21", category: "城市", excerpt: "潮湿的纸页与一杯很慢的咖啡。", content: "雨停的时候，巷子里的砖地还泛着亮。我绕路去了那家开在二楼的旧书店。\n\n老板正在给书页除湿，空气里有纸张和木头混在一起的味道。我带走了一本诗集，扉页上留着前一位读者铅笔写下的日期：1998 年的秋天。\n\n一本书被交到陌生人手里，也许就是一种安静的相遇。" },
  { id: "work", title: "把注意力还给一件事", date: "2026-05-30", category: "工作", excerpt: "少一些切换，事情反而开始向前走。", content: "屏幕上的标签页总会越开越多，直到我意识到：分心不总是因为事情太多，而是因为我们习惯了随时响应。\n\n最近我尝试把上午的前九十分钟留给最重要的一件事。关掉提醒，不回复消息，只做一件需要思考的工作。\n\n结果并不神奇，但很踏实。**专注不是逼自己更快，而是让时间重新有了形状。**" }
];
const articles = JSON.parse(localStorage.getItem("zhijian-articles") || "null") || seedArticles;
const article = articles.find(item => item.id === new URLSearchParams(location.search).get("id"));
const escapeHtml = value => value.replace(/[&<>\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
const inlineMarkup = text => escapeHtml(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
const markup = text => text.split("\n").map(line => line.startsWith("## ") ? `<h3>${inlineMarkup(line.slice(3))}</h3>` : line.startsWith("> ") ? `<blockquote>${inlineMarkup(line.slice(2))}</blockquote>` : line.trim() ? `<p>${inlineMarkup(line)}</p>` : "").join("");
const dateLabel = date => new Intl.DateTimeFormat("zh-CN", { year:"numeric", month:"long", day:"numeric" }).format(new Date(`${date}T00:00:00`));
document.title = article ? `${article.title} | 纸间` : "文章未找到 | 纸间";
const view = document.querySelector("#articleView");
view.innerHTML = article ? `<div class="article-meta">${escapeHtml(article.category).toUpperCase()} &nbsp;/&nbsp; ${dateLabel(article.date)}</div><div class="article-title-row"><h1>${escapeHtml(article.title)}</h1><div class="article-actions"><a class="edit-link" href="index.html?edit=${encodeURIComponent(article.id)}">编辑</a><button class="delete-button" type="button" id="deleteArticle">删除</button></div></div><p class="lead">${escapeHtml(article.excerpt)}</p><div class="article-body">${markup(article.content)}</div>` : `<div class="article-meta">NOT FOUND</div><h1>这篇文章不在这里。</h1><p class="lead">它可能已被移除，或链接地址不正确。</p>`;
if (article) document.querySelector("#deleteArticle").addEventListener("click", () => { if (!confirm(`确定删除《${article.title}》吗？此操作无法撤销。`)) return; const remaining = articles.filter(item => item.id !== article.id); localStorage.setItem("zhijian-articles", JSON.stringify(remaining)); location.href = "index.html"; });
