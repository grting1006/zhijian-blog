const notesKey = "zhijian-reader-notes";
let notes = JSON.parse(localStorage.getItem(notesKey) || "[]");
const $ = selector => document.querySelector(selector);
const esc = value => value.replace(/[&<>\"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
function renderNotes() { $("#notesCount").textContent = String(notes.length).padStart(2, "0"); $("#notesList").innerHTML = notes.length ? notes.slice().reverse().map(note => `<button class="note-card" data-note-id="${note.id}" type="button"><time>${note.date}</time><h2>${esc(note.title)}</h2><p>${esc(note.content)}</p><span>点击阅读 →</span></button>`).join("") : `<p class="empty-favorites">还没有随笔。点击上方“写随笔”开始记录。</p>`; }
$("#notesList").addEventListener("click", event => { const card = event.target.closest("[data-note-id]"); if (!card) return; const note = notes.find(item => item.id === card.dataset.noteId); if (!note) return; $("#viewerDate").textContent = note.date; $("#viewerTitle").textContent = note.title; $("#viewerContent").innerHTML = esc(note.content).split("\n").map(line => line ? `<p>${line}</p>` : "").join(""); $("#noteViewer").showModal(); });
$("#closeNoteViewer").addEventListener("click", () => $("#noteViewer").close());
renderNotes();
