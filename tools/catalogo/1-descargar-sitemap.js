// Descarga el mapa del sitio de joieriagrau.com y guarda la lista de fichas de producto.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const DIR = path.join(__dirname, "_datos");
fs.mkdirSync(DIR, { recursive: true });
const xml = execFileSync("curl", ["-sSL", "--compressed", "-A", "Mozilla/5.0", "https://joieriagrau.com/1_es_0_sitemap.xml"], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
const urls = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)/g)].map((m) => m[1]).filter((u) => /\/\d+-[^/]+\.html$/.test(u));
fs.writeFileSync(path.join(DIR, "urls-productos.txt"), urls.join("\n"));
console.log(`Fichas de producto en el sitemap: ${urls.length}`);
