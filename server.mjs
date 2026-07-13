import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const usersDir = join(root, "data", "users");
const contentFile = join(root, "local-content.json");
const contentScriptFile = join(root, "local-content.js");
const accountsFile = join(root, "data", "accounts.json");
const sessions = new Map();
const mimeTypes = { ".css":"text/css", ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".mjs":"text/javascript", ".jpeg":"image/jpeg", ".jpg":"image/jpeg", ".png":"image/png", ".webp":"image/webp" };
const hash = value => createHash("sha256").update(value).digest("hex");
const userFile = id => join(usersDir, `${id}.json`);
const cookies = request => Object.fromEntries((request.headers.cookie || "").split(";").map(part => part.trim().split("=")).filter(([key]) => key));
const send = (response, status, body, headers = {}) => response.writeHead(status, { "Content-Type":"application/json", ...headers }).end(body === undefined ? "" : JSON.stringify(body));
const readJson = async file => JSON.parse(await readFile(file, "utf8"));
const readBody = async request => { let body = ""; for await (const chunk of request) body += chunk; return JSON.parse(body || "{}"); };
const session = request => sessions.get(cookies(request).zhijian_session);

await mkdir(usersDir, { recursive:true });

createServer(async (request, response) => {
  const pathname = request.url?.split("?")[0] || "/";
  try {
    if (request.method === "POST" && pathname === "/api/login") {
      const { id, password = "" } = await readBody(request);
      const account = (await readJson(accountsFile)).accounts.find(item => item.id === id);
      if (!account || (account.passwordHash && account.passwordHash !== hash(password))) return send(response, 401, { error:"账号或密码错误" });
      const token = randomUUID(); sessions.set(token, { id:account.id, role:account.role });
      return send(response, 200, { user:{ id:account.id, role:account.role } }, { "Set-Cookie":`zhijian_session=${token}; HttpOnly; SameSite=Lax; Path=/` });
    }
    if (request.method === "POST" && pathname === "/api/logout") { const token = cookies(request).zhijian_session; sessions.delete(token); return send(response, 204, undefined, { "Set-Cookie":"zhijian_session=; Max-Age=0; Path=/" }); }
    if (request.method === "GET" && pathname === "/api/session") return send(response, 200, { user:session(request) || null });
    if (pathname === "/api/user-data") {
      const user = session(request); if (!user) return send(response, 401, { error:"请先登录" });
      if (request.method === "GET") return send(response, 200, await readJson(userFile(user.id)));
      if (request.method === "POST") { const data = await readBody(request); const normalized = { favorites:Array.isArray(data.favorites) ? data.favorites : [], folders:Array.isArray(data.folders) ? data.folders : ["默认收藏"], notes:Array.isArray(data.notes) ? data.notes : [] }; await writeFile(userFile(user.id), `${JSON.stringify(normalized, null, 2)}\n`); return send(response, 204); }
    }
    if (request.method === "POST" && pathname === "/api/local-data") {
      const user = session(request); if (!user || user.role !== "admin") return send(response, 403, { error:"需要管理员权限" });
      const content = await readBody(request); const serialized = `${JSON.stringify(content, null, 2)}\n`; await writeFile(contentFile, serialized); await writeFile(contentScriptFile, `window.__BLOG_CONTENT__ = ${JSON.stringify(content)};\n`); return send(response, 204);
    }
    const file = normalize(join(root, pathname === "/" ? "index.html" : pathname));
    if (!file.startsWith(root)) return response.writeHead(403).end();
    const data = await readFile(file); response.writeHead(200, { "Content-Type":mimeTypes[extname(file)] || "application/octet-stream" }).end(data);
  } catch (error) { send(response, error.code === "ENOENT" ? 404 : 400, { error:"请求失败" }); }
}).listen(4173, () => console.log("Blog available at http://localhost:4173"));
