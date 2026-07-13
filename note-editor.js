const notesKey = "zhijian-reader-notes";
const favoritesKey = "zhijian-favorites";
const articlesKey = "zhijian-articles";
const $ = selector => document.querySelector(selector);
const esc = value => value.replace(/[&<>\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
function favoriteText(item) { if (item.type === "article") { const article = (JSON.parse(localStorage.getItem(articlesKey) || "[]")).find(entry => entry.id === item.content); return article ? `${article.title}\n${article.excerpt}` : item.title; } return item.content.replace(/^\{\{chart\|/, "图表：").replace(/\}\}$/, ""); }
function renderReferences() { const favorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]"); $("#referenceList").innerHTML = favorites.length ? favorites.slice().reverse().map(item => `<button class="reference-item" data-reference-id="${item.id}" type="button"><span>${esc(item.folder)} · ${esc(item.type)}</span><strong>${esc(item.title)}</strong></button>`).join("") : `<p class="empty-favorites">收藏夹还是空的。</p>`; }
$("#openReferences").addEventListener("click", () => { renderReferences(); $("#referencesDialog").showModal(); });
$("#closeReferences").addEventListener("click", () => $("#referencesDialog").close());
$("#referenceList").addEventListener("click", event => { const item = event.target.closest("[data-reference-id]"); if (!item) return; const favorite = (JSON.parse(localStorage.getItem(favoritesKey) || "[]")).find(entry => entry.id === item.dataset.referenceId); if (!favorite) return; $("#noteContent").value += `${$("#noteContent").value.trim() ? "\n\n" : ""}> ${favoriteText(favorite).replace(/\n/g, "\n> ")}`; $("#referencesDialog").close(); });
$("#saveNote").addEventListener("click", () => { const title = $("#noteTitle").value.trim(); const content = $("#noteContent").value.trim(); if (!title || !content) return; const notes = JSON.parse(localStorage.getItem(notesKey) || "[]"); notes.push({ id:`${Date.now()}`, title, content, date:new Intl.DateTimeFormat("zh-CN", { year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date()) }); localStorage.setItem(notesKey, JSON.stringify(notes)); location.href = "notes.html"; });
