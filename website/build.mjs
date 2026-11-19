#!/usr/bin/env node
// Builds the Orbital Crow website into website/dist.
// No dependencies: run `node website/build.mjs` (optionally `--base /project-x` for a sub-folder preview).
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const src = join(here, "src");
const out = join(here, "dist");

/* ---------- arguments ---------- */
const args = process.argv.slice(2);
const baseArg = args.includes("--base") ? args[args.indexOf("--base") + 1] ?? "" : (process.env.SITE_BASE_PATH ?? "");
const base = baseArg === "/" ? "" : baseArg.replace(/\/+$/, "");
if (base && !/^\/[A-Za-z0-9._\/-]+$/.test(base)) fail(`--base must look like "/project-x", got "${baseArg}"`);

/* ---------- config ---------- */
const config = JSON.parse(readFileSync(join(here, "site.config.json"), "utf8"));
const problems = [];
const isRealUrl = u => /^https:\/\/[^\s#]+\.[^\s#]+/.test(u) && !/example\.(com|org|net)/i.test(u);
for (const key of ["robloxCommunityUrl", "randomizerUrl"]) if (config[key] && !isRealUrl(config[key])) problems.push(`${key} must be a full https:// address (no "#" or example.com), or left empty.`);
if (config.contactEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail) || /example\./i.test(config.contactEmail))) problems.push("contactEmail must be a real address, or left empty.");
for (const s of config.socialLinks ?? []) if (!s.label || !isRealUrl(s.url ?? "")) problems.push(`socialLinks entries need a "label" and a full https:// "url": ${JSON.stringify(s)}`);
if (!isRealUrl(config.productionUrl)) problems.push("productionUrl must be a full https:// address.");
for (const [name, logo] of Object.entries(config.logos ?? {})) {
  if (!logo.src) continue;
  if (!existsSync(join(src, logo.src.replace(/^\/+/, "")))) problems.push(`logos.${name}.src points to a missing file: website/src/${logo.src}`);
  if (!(logo.width > 0 && logo.height > 0)) problems.push(`logos.${name} needs its real pixel width and height.`);
}
if (problems.length) fail("site.config.json has problems:\n - " + problems.join("\n - "));

/* ---------- tiny template engine: {{x}} escaped, {{{x}}} raw, {{#if x}}…{{/if}}, {{#unless x}}…{{/unless}} ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function render(tpl, data) {
  let s = tpl;
  for (let i = 0; i < 5; i++) {
    s = s.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, k, body) => (data[k] ? body : ""))
         .replace(/\{\{#unless (\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (_, k, body) => (data[k] ? "" : body));
  }
  s = s.replace(/\{\{\{(\w+)\}\}\}/g, (_, k) => (data[k] ?? ""))
       .replace(/\{\{(\w+)\}\}/g, (_, k) => esc(data[k]));
  const left = s.match(/\{\{[^}]*\}\}/);
  if (left) fail(`Unfilled template value ${left[0]}`);
  return s;
}

/* ---------- shared pieces ---------- */
const prod = config.productionUrl.replace(/\/+$/, "");
const asset = p => (p ? `${base}/${p.replace(/^\/+/, "")}` : "");
const cssPath = join(src, "assets/css/site.css");
const cssVersion = createHash("sha256").update(readFileSync(cssPath)).digest("hex").slice(0, 10);

// Decorative orbit: a tilted ellipse with one crimson "satellite". aria-hidden: it carries no information.
const orbitSvg = (cls = "") => `<svg class="orbit ${cls}" viewBox="0 0 1000 560" preserveAspectRatio="xMinYMid meet" aria-hidden="true" focusable="false">
      <ellipse class="orbit-path" cx="500" cy="280" rx="470" ry="190" transform="rotate(-14 500 280)" pathLength="1"/>
      <circle class="orbit-satellite" cx="${(500 + 470 * Math.cos(-0.62) * Math.cos(-14 * Math.PI / 180) - 190 * Math.sin(-0.62) * Math.sin(-14 * Math.PI / 180)).toFixed(1)}" cy="${(280 + 470 * Math.cos(-0.62) * Math.sin(-14 * Math.PI / 180) + 190 * Math.sin(-0.62) * Math.cos(-14 * Math.PI / 180)).toFixed(1)}" r="15"/>
    </svg>`;

const nav = [
  { id: "home", label: "Home", href: `${base}/` },
  { id: "games", label: "Games", href: `${base}/games/` },
  ...(config.contactEmail ? [{ id: "contact", label: "Contact", href: `mailto:${config.contactEmail}` }] : [])
];
const navItems = active => nav.map(n => `<li><a href="${esc(n.href)}"${n.id === active ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`).join("");
const footerItems = [
  `<li><a href="${base}/games/">${esc(config.studioName)}</a></li>`,
  ...(config.contactEmail ? [`<li><a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a></li>`] : []),
  ...(config.socialLinks ?? []).map(s => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a></li>`)
].join("");
const socialList = (config.socialLinks ?? []).length
  ? `<ul class="social-list">${config.socialLinks.map(s => `<li><a class="text-link" href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul>` : "";

const logos = config.logos ?? {};
const sym = logos.symbol ?? {}, studio = logos.studioWordmark ?? {}, og = logos.socialPreviewImage ?? {};
const headerMark = sym.src ? `<img src="${esc(asset(sym.src))}" width="${sym.width}" height="${sym.height}" alt="">` : "";

const shared = {
  base, cssVersion, brandName: config.brandName, studioName: config.studioName, location: config.location,
  year: new Date().getFullYear(), contactEmail: config.contactEmail, robloxCommunityUrl: config.robloxCommunityUrl,
  socialList, footerItems, headerMark,
  orbit: orbitSvg(), orbitSmall: orbitSvg("orbit-small"),
  symbolLogo: asset(sym.src), symbolLogoWidth: sym.width, symbolLogoHeight: sym.height,
  studioLogo: asset(studio.src), studioLogoWidth: studio.width, studioLogoHeight: studio.height, studioLogoAlt: studio.alt,
  ogImage: og.src ? `${prod}/${og.src.replace(/^\/+/, "")}` : "", ogImageAlt: og.alt
};

/* ---------- pages ---------- */
// To add a public page: add an entry here and a file in src/pages. "sitemap: true" lists it in sitemap.xml.
const pages = [
  { id: "home", file: "home.html", out: "index.html", path: "/", sitemap: true,
    title: `${config.brandName} — independent creative venture from ${config.location}`,
    ogTitle: config.brandName,
    description: `${config.brandName} is an independent creative venture founded in ${config.location}. Its first focus is ${config.studioName}, a new game studio starting on Roblox.` },
  { id: "games", file: "games.html", out: "games/index.html", path: "/games/", sitemap: true,
    title: `${config.studioName} — independent game studio`,
    ogTitle: config.studioName,
    description: `${config.studioName} is an independent, solo-founded game studio from ${config.location}, preparing its first Roblox project.` },
  { id: "notfound", file: "404.html", out: "404.html", path: null, sitemap: false, noindex: true,
    title: `Page not found — ${config.brandName}`, ogTitle: "", description: "This page could not be found." }
];

const layout = readFileSync(join(src, "templates/layout.html"), "utf8");
const orgData = JSON.stringify({
  "@context": "https://schema.org", "@type": "Organization", name: config.brandName, url: `${prod}/`,
  ...(og.src || sym.src ? { logo: `${prod}/${(sym.src || og.src).replace(/^\/+/, "")}` } : {}),
  ...(config.contactEmail ? { email: config.contactEmail } : {})
}).replace(/</g, "\\u003c");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(src, "assets"), join(out, "assets"), { recursive: true });

for (const p of pages) {
  const data = { ...shared, ...p, pageId: p.id, navItems: navItems(p.id), canonical: p.path ? prod + p.path : "",
    structuredData: p.id === "home" ? `<script type="application/ld+json">${orgData}</script>\n` : "" };
  data.content = render(readFileSync(join(src, "pages", p.file), "utf8"), data);
  const html = render(layout, data);
  mkdirSync(dirname(join(out, p.out)), { recursive: true });
  writeFileSync(join(out, p.out), html);
}

// /web — intentionally empty route. Stand-alone template: no header, footer, navigation or visible content.
mkdirSync(join(out, "web"), { recursive: true });
writeFileSync(join(out, "web/index.html"), render(readFileSync(join(src, "pages/web.html"), "utf8"), shared));

/* ---------- sitemap and robots (production URLs; /web and 404 excluded on purpose) ---------- */
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter(p => p.sitemap).map(p => `  <url><loc>${prod}${p.path}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
// /web is NOT disallowed here: crawlers must be able to fetch it to see its noindex tag.
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${prod}/sitemap.xml\n`);
writeFileSync(join(out, ".nojekyll"), "");

/* ---------- existing tools deployed alongside (paths unchanged) ---------- */
for (const rel of config.deployAlongside ?? []) {
  const from = join(repoRoot, rel);
  if (!existsSync(from) || !statSync(from).isDirectory()) fail(`deployAlongside: folder not found: ${rel}`);
  cpSync(from, join(out, rel), { recursive: true, filter: f => !/\/(collector|data)(\/|$)|README\.md$/.test(f.slice(from.length)) });
}

const count = d => readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(join(d, e.name)) : 1), 0);
console.log(`Built ${pages.length + 1} pages into website/dist (${count(out)} files) with base path "${base || "/"}".`);

function fail(msg) { console.error("Build stopped: " + msg); process.exit(1); }
