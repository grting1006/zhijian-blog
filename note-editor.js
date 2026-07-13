const notesKey = "zhijian-reader-notes";
const favoritesKey = "zhijian-favorites";
const articlesKey = "zhijian-articles";
const $ = selector => document.querySelector(selector);
const esc = value => value.replace(/[&<>\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
const editingId = new URLSearchParams(location.search).get("edit");
const existingNote = editingId ? (JSON.parse(localStorage.getItem(notesKey) || "[]")).find(note => note.id === editingId) : null;
if (existingNote) { $("#noteKicker").textContent = "EDIT A NOTE"; $("#noteHeading").textContent = "修改随笔"; $("#noteTitle").value = existingNote.title; $("#noteContent").value = existingNote.content; $("#saveNote").textContent = "保存修改"; }
function favoriteText(item) { if (item.type === "article") { const article = (JSON.parse(localStorage.getItem(articlesKey) || "[]")).find(entry => entry.id === item.content); return article ? `${article.title}\n${article.excerpt}` : item.title; } return item.content.replace(/^\{\{chart\|/, "图表：").replace(/\}\}$/, ""); }
function renderReferences() { const favorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]"); $("#referenceList").innerHTML = favorites.length ? favorites.slice().reverse().map(item => `<button class="reference-item" data-reference-id="${item.id}" type="button"><span>${esc(item.folder)} · ${esc(item.type)}</span><strong>${esc(item.title)}</strong></button>`).join("") : `<p class="empty-favorites">收藏夹还是空的。</p>`; }
$("#openReferences").addEventListener("click", () => { renderReferences(); $("#referencesDialog").showModal(); });
$("#closeReferences").addEventListener("click", () => $("#referencesDialog").close());
$("#referenceList").addEventListener("click", event => { const item = event.target.closest("[data-reference-id]"); if (!item) return; const favorite = (JSON.parse(localStorage.getItem(favoritesKey) || "[]")).find(entry => entry.id === item.dataset.referenceId); if (!favorite) return; $("#noteContent").value += `${$("#noteContent").value.trim() ? "\n\n" : ""}> ${favoriteText(favorite).replace(/\n/g, "\n> ")}`; $("#referencesDialog").close(); });
$("#saveNote").addEventListener("click", () => { const title = $("#noteTitle").value.trim(); const content = $("#noteContent").value.trim(); if (!title || !content) return; const notes = JSON.parse(localStorage.getItem(notesKey) || "[]"); const note = { id:editingId || `${Date.now()}`, title, content, date:existingNote?.date || new Intl.DateTimeFormat("zh-CN", { year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date()) }; const index = notes.findIndex(item => item.id === editingId); if (index >= 0) notes[index] = note; else notes.push(note); localStorage.setItem(notesKey, JSON.stringify(notes)); location.href = "notes.html"; });
