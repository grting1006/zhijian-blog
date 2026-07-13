let notes = [];
let selectedNoteId = null;
const $ = selector => document.querySelector(selector);
const esc = value => value.replace(/[&<>\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
const noteLine = line => { const link = line.match(/^\[([^\]]+)\]\((article\.html\?id=[^\s)]+)\)$/); return link ? `<p><a class="note-reference" href="${link[2].replace(/[&\"]/g, char => char === "&" ? "&amp;" : "&quot;")}">${esc(link[1])}</a></p>` : line ? `<p>${esc(line)}</p>` : ""; };
function renderNotes() { $("#notesCount").textContent = String(notes.length).padStart(2, "0"); $("#notesList").innerHTML = notes.length ? notes.slice().reverse().map(note => `<button class="note-card" data-note-id="${note.id}" type="button"><time>${note.date}</time><h2>${esc(note.title)}</h2><p>${esc(note.content)}</p><span>点击阅读 →</span></button>`).join("") : `<p class="empty-favorites">还没有随笔。点击上方“写随笔”开始记录。</p>`; }
$("#notesList").addEventListener("click", event => { const card = event.target.closest("[data-note-id]"); if (!card) return; const note = notes.find(item => item.id === card.dataset.noteId); if (!note) return; selectedNoteId = note.id; $("#viewerDate").textContent = note.date; $("#viewerTitle").textContent = note.title; $("#viewerContent").innerHTML = note.content.split("\n").map(noteLine).join(""); $("#editNote").href = `note-editor.html?edit=${encodeURIComponent(note.id)}`; $("#noteViewer").showModal(); });
$("#closeNoteViewer").addEventListener("click", () => $("#noteViewer").close());
$("#deleteNote").addEventListener("click", async () => { const note = notes.find(item => item.id === selectedNoteId); if (!note || !confirm(`确定删除《${note.title}》吗？`)) return; notes = notes.filter(item => item.id !== selectedNoteId); await window.userStore.saveUserData({ favorites:window.userStore.data.favorites, folders:window.userStore.data.folders, notes }); $("#noteViewer").close(); renderNotes(); });
document.querySelector(".write-note-link").addEventListener("click", event => { if (window.userStore.requireLogin()) return; event.preventDefault(); });
window.userStore.ready.then(({ data }) => { notes = data.notes; renderNotes(); });
document.addEventListener("userchange", event => { notes = event.detail.data.notes; renderNotes(); });
renderNotes();
