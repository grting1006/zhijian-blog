import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const contentFile = join(root, "local-content.json");
const mimeTypes = { ".css":"text/css", ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".mjs":"text/javascript" };

createServer(async (request, response) => {
  if (request.method === "POST" && request.url === "/api/local-data") {
    let body = "";
    for await (const chunk of request) body += chunk;
    try { JSON.parse(body); await writeFile(contentFile, `${body}\n`, "utf8"); response.writeHead(204).end(); }
    catch { response.writeHead(400).end("Invalid local data"); }
    return;
  }
  const pathname = request.url?.split("?")[0] || "/";
  const file = normalize(join(root, pathname === "/" ? "index.html" : pathname));
  if (!file.startsWith(root)) { response.writeHead(403).end(); return; }
  try { const data = await readFile(file); response.writeHead(200, { "Content-Type": mimeTypes[extname(file)] || "application/octet-stream" }); response.end(data); }
  catch { response.writeHead(404).end("Not found"); }
}).listen(4173, () => console.log("Blog available at http://localhost:4173"));
