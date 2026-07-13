import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const usersDir = join(root, "data", "users");
const contentFile = join(root, "local-content.json");
const contentScriptFile = join(root, "local-content.js");
const mimeTypes = { ".css":"text/css", ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".mjs":"text/javascript", ".jpeg":"image/jpeg", ".jpg":"image/jpeg", ".png":"image/png", ".webp":"image/webp" };
const userFile = id => join(usersDir, `${id}.json`);
const send = (response, status, body, headers = {}) => response.writeHead(status, { "Content-Type":"application/json", ...headers }).end(body === undefined ? "" : JSON.stringify(body));
const readJson = async file => JSON.parse(await readFile(file, "utf8"));
const readBody = async request => { let body = ""; for await (const chunk of request) body += chunk; return JSON.parse(body || "{}"); };
const userId = request => new URL(request.url, "http://localhost").searchParams.get("id") || "";

await mkdir(usersDir, { recursive:true });

createServer(async (request, response) => {
  const pathname = request.url?.split("?")[0] || "/";
  try {
    if (pathname === "/api/user-data") {
      const id = userId(request); if (!id || !/^[a-zA-Z0-9_-]{1,32}$/.test(id)) return send(response, 400, { error:"请输入有效账号 ID" });
      if (request.method === "GET") return send(response, 200, await readJson(userFile(id)));
      if (request.method === "POST") { const data = await readBody(request); const normalized = { favorites:Array.isArray(data.favorites) ? data.favorites : [], folders:Array.isArray(data.folders) ? data.folders : ["默认收藏"], notes:Array.isArray(data.notes) ? data.notes : [] }; await writeFile(userFile(id), `${JSON.stringify(normalized, null, 2)}\n`); return send(response, 204); }
    }
    if (request.method === "POST" && pathname === "/api/local-data") {
      const content = await readBody(request); const serialized = `${JSON.stringify(content, null, 2)}\n`; await writeFile(contentFile, serialized); await writeFile(contentScriptFile, `window.__BLOG_CONTENT__ = ${JSON.stringify(content)};\n`); return send(response, 204);
    }
    const file = normalize(join(root, pathname === "/" ? "index.html" : pathname));
    if (!file.startsWith(root)) return response.writeHead(403).end();
    const data = await readFile(file); response.writeHead(200, { "Content-Type":mimeTypes[extname(file)] || "application/octet-stream" }).end(data);
  } catch (error) { send(response, error.code === "ENOENT" ? 404 : 400, { error:"请求失败" }); }
}).listen(4173, () => console.log("Blog available at http://localhost:4173"));
