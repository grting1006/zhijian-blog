import { readFile, writeFile } from "node:fs/promises";

const content = JSON.parse(await readFile("local-content.json", "utf8"));
await writeFile("local-content.js", `window.__BLOG_CONTENT__ = ${JSON.stringify(content)};\n`, "utf8");
