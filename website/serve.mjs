#!/usr/bin/env node
// Local preview server for website/dist that behaves like GitHub Pages:
// folders redirect to a trailing slash, index.html is served for folders, unknown paths get 404.html.
// Usage: node website/serve.mjs [port] [--base /project-x]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "dist");
const args = process.argv.slice(2);
const port = Number(args.find(a => /^\d+$/.test(a)) || 4173);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1].replace(/\/+$/, "") : "";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".json": "application/json", ".ico": "image/x-icon" };

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let path = decodeURIComponent(url.pathname);
  if (base) {
    if (path === base) { res.writeHead(301, { Location: base + "/" }); return res.end(); }
    if (!path.startsWith(base + "/")) return notFound(res);
    path = path.slice(base.length);
  }
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) return notFound(res);
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!url.pathname.endsWith("/")) { res.writeHead(301, { Location: url.pathname + "/" + url.search }); return res.end(); }
      return send(res, join(file, "index.html"), 200);
    }
    return send(res, file, 200);
  } catch { return notFound(res); }
}).listen(port, () => console.log(`Previewing website/dist at http://localhost:${port}${base}/`));

async function send(res, file, status) {
  try {
    const body = await readFile(file);
    res.writeHead(status, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { notFound(res); }
}
async function notFound(res) {
  try { const body = await readFile(join(root, "404.html")); res.writeHead(404, { "Content-Type": types[".html"] }); res.end(body); }
  catch { res.writeHead(404); res.end("Not found"); }
}
