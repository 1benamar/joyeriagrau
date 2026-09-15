// Genera todas las páginas de la web, el sitemap y robots.txt, y comprueba enlaces y recursos.
// Uso: node tools/sitio/construir.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const C = require("./lib/config");
const P = require("./lib/plantilla");
const B = require("./lib/bloques");

const ROOT = path.resolve(__dirname, "..", "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const errors = [];
const warnings = [];

/* Versión de los recursos: cambia sola cuando cambian el CSS o el JS */
const version = crypto.createHash("md5").update(["styles.css", "main.js", "catalogo.js"].map(read).join("")).digest("hex").slice(0, 10);
P.setVersion(version);

const catalog = JSON.parse(read("data/catalogo.json"));
const productIds = new Set(catalog.items.map((it) => it[0]));

/* ------------------------------------------------------------------ */
/* Registro de páginas                                                 */
/* ------------------------------------------------------------------ */
const pages = [];
const site = {
  blog: B.blog,
  summary: B.summary,
  brandTiles: B.brandTiles,
  storeCard: B.storeCard,
  blogCards: B.blogCards,
  newsletterForm: B.newsletterForm,
  prose: (html) => B.fixHeadings(B.unlinkRetired(html, productIds)),
  page(file, opts) {
    if (pages.some((p) => p.file === file)) errors.push(`Página duplicada: ${file}`);
    pages.push({ file, ...opts });
  },
};
["inicio", "newsletter", "secciones", "tienda", "informacion", "blog", "error"].forEach((m) => require(`./paginas/${m}`)(site));

/* ------------------------------------------------------------------ */
/* Maquetación                                                         */
/* ------------------------------------------------------------------ */
function landing(opts) {
  return P.head(opts) + `
  <header class="lp-header">
    <div class="wrap">
      <a href="index.html" aria-label="Grau, ir al inicio"><img src="assets/img/logo.svg" alt="Grau" width="92" height="30"></a>
      <a class="link-line" href="index.html">Ir a la joyería</a>
    </div>
  </header>

  <main id="contenido" tabindex="-1">
${opts.body}  </main>

  <footer class="lp-footer">
    <div class="wrap">
      <p>© <span data-year>${new Date().getFullYear()}</span> ${C.razonSocial}. España.</p>
      <nav aria-label="Enlaces del pie">
        <a href="index.html">Inicio</a>
        <a href="tiendas.html">Tiendas</a>
        <a href="cita.html">Pedir cita</a>
        <a href="aviso-legal.html">Aviso legal</a>
        <a href="privacidad.html">Privacidad</a>
        <a href="${C.redes[0][1]}" target="_blank" rel="noopener">Instagram</a>
      </nav>
    </div>
  </footer>

</body>
</html>
`;
}

/* Las páginas en subcarpetas (blog/) o servidas en cualquier ruta (404) necesitan otro prefijo en sus enlaces */
const isRelative = (url) => Boolean(url) && !/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(url);
const withPrefix = (html, prefix) => html
  .replace(/(\s(?:href|src)=")([^"]*)"/gi, (all, attr, url) => (isRelative(url) ? `${attr}${prefix}${url}"` : all))
  .replace(/(\ssrcset=")([^"]*)"/gi, (all, attr, set) => `${attr}${set.split(", ").map((c) => (isRelative(c) ? prefix + c : c)).join(", ")}"`);

for (const p of pages) {
  let html = p.layout === "landing" ? landing(p) : P.page(p);
  const depth = p.file.split("/").length - 1;
  const prefix = p.prefix || "../".repeat(depth);
  if (prefix) html = withPrefix(html, prefix);
  p.html = html;
}

/* ------------------------------------------------------------------ */
/* Comprobaciones                                                      */
/* ------------------------------------------------------------------ */
const htmlByFile = Object.fromEntries(pages.map((p) => [p.file, p.html]));

function catalogCount(query) {
  const q = new URLSearchParams(query);
  const list = (k) => (q.get(k) || "").split(",").filter(Boolean);
  return catalog.items.filter((it) => {
    const tags = " " + it[8] + " ";
    if (q.get("seccion") && it[6] !== q.get("seccion")) return false;
    if (q.get("lista") && !tags.includes(" l-" + q.get("lista") + " ")) return false;
    if (list("marca").length && !list("marca").includes(it[3])) return false;
    if (list("cat").length && !list("cat").some((v) => it[7] === v || tags.includes(" c-" + v + " ") || (v === "relojes" && it[6] === "relojes"))) return false;
    for (const key of ["tipo", "para", "ocasion", "coleccion"]) if (list(key).length && !list(key).some((v) => tags.includes(` ${key}-${v} `))) return false;
    return true;
  }).length;
}

for (const p of pages) {
  const html = p.html;
  const dir = path.posix.dirname(p.file);
  const where = p.file;

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1 && p.file !== "producto.html") errors.push(`${where}: ${h1} encabezados h1`);
  const levels = [...html.replace(/<div class="mail[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, "").matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { warnings.push(`${where}: salto de encabezado h${levels[i - 1]} → h${levels[i]}`); break; }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) errors.push(`${where}: imagen sin alt ${m[0].slice(0, 80)}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dup.length) errors.push(`${where}: ids duplicados ${dup.join(", ")}`);

  const urls = [...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]*)"/g)) urls.push(...m[1].split(", ").map((c) => c.split(" ")[0]));
  for (const raw of urls) {
    const url = raw.replace(/&amp;/g, "&");
    if (!url || url === "#") { errors.push(`${where}: enlace vacío`); continue; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) continue;
    if (url.startsWith("#")) { if (url.length > 1 && !ids.includes(url.slice(1))) errors.push(`${where}: ancla inexistente ${url}`); continue; }
    const [pathAndQuery, hash] = url.split("#");
    const [target, query = ""] = pathAndQuery.split("?");
    const resolved = target.startsWith("/") ? target.slice(1) : path.posix.normalize(path.posix.join(dir, target));
    const inSite = htmlByFile[resolved] !== undefined;
    if (!inSite && !fs.existsSync(path.join(ROOT, resolved))) { errors.push(`${where}: no existe ${url}`); continue; }
    if (hash && inSite && resolved !== "blog.html" && !new RegExp(`\\sid="${hash}"`).test(htmlByFile[resolved])) errors.push(`${where}: ancla inexistente ${url}`);
    if (resolved === "catalogo.html" && query && catalogCount(query) === 0) errors.push(`${where}: enlace al catálogo sin productos ${url}`);
    if (resolved === "producto.html") {
      const id = +new URLSearchParams(query).get("id");
      if (!productIds.has(id)) warnings.push(`${where}: producto ${id} ya no está en el catálogo`);
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} errores:\n  ` + errors.slice(0, 60).join("\n  "));
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Escritura                                                           */
/* ------------------------------------------------------------------ */
const blogDir = path.join(ROOT, "blog");
fs.mkdirSync(blogDir, { recursive: true });
const generatedBlog = new Set(pages.filter((p) => p.file.startsWith("blog/")).map((p) => path.basename(p.file)));
for (const f of fs.readdirSync(blogDir)) if (f.endsWith(".html") && !generatedBlog.has(f)) fs.unlinkSync(path.join(blogDir, f));
for (const p of pages) fs.writeFileSync(path.join(ROOT, p.file), p.html);

const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((p) => p.sitemap !== false && !p.robots).map((p) => [P.absolute(p.file), p.lastmod || today]);
for (const it of catalog.items) urls.push([`${C.url}/producto.html?id=${it[0]}`, catalog.updated]);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, lastmod]) => `  <url><loc>${loc.replace(/&/g, "&amp;")}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *
Allow: /
Disallow: /tools/
Disallow: /api/

Sitemap: ${C.url}/sitemap.xml
`);

console.log(`✓ ${pages.length} páginas generadas · versión de recursos ${version}`);
console.log(`✓ sitemap.xml con ${urls.length} URLs y robots.txt`);
if (warnings.length) {
  const grouped = {};
  for (const w of warnings) { const k = w.replace(/^[^:]+: /, "").replace(/\d+/g, "N"); (grouped[k] = grouped[k] || []).push(w); }
  console.log(`! ${warnings.length} avisos:`);
  for (const [k, list] of Object.entries(grouped)) console.log(`  ${k} (${list.length}): ${list.slice(0, 3).join(" | ")}`);
}
