// Recorre listados y selecciones de joieriagrau.com y guarda qué productos pertenecen a cada uno.
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const OUT = path.join(__dirname, "_datos", "lists.json");
if (process.argv.includes("--todo") && fs.existsSync(OUT)) fs.unlinkSync(OUT);

const LISTS = {
  // Selecciones (filtros)
  "charms": "s/4/charms", "comunion": "s/5/joyas-para-comunion", "bautizo": "s/6/joyas-para-bautizo",
  "joyas-mujer": "s/7/joyas-mujer", "joyas-hombre": "s/8/joyas-hombre", "joyas-unisex": "s/9/joyas-unisex",
  "joyas-bebe": "s/10/joyas-bebe", "joyas-infantiles": "s/11/joyas-infantiles",
  "col-aura": "s/12/joyas-grau-cosmos", "col-halo": "s/13/joyas-grau-halo", "col-zodiaco": "s/14/joyas-grau-zodiaco",
  "col-good-mood": "s/39/joyas-goodmood-grau", "col-my-essence": "s/38/grau-my-essence", "col-rainbow": "s/50/joyas-rainbow",
  "charms-dodo": "s/41/dodo-charms", "charms-pandora": "s/42/charms-pandora",
  "anillos-grau": "s/43/anillos-grau", "pendientes-grau": "s/44/pendientes-grau", "pulseras-grau": "s/45/pulseras-grau", "collares-grau": "s/46/collares-grau",
  "relojes-comunion": "s/15/relojes-comunion", "relojes-compromiso": "s/51/relojes-compromiso-hombre",
  "relojes-cuarzo": "s/17/relojes-cuarzo", "relojes-automatico": "s/18/relojes-automatico", "relojes-cuerda": "s/19/relojes-cuerda", "relojes-smartwatch": "s/20/relojes-smartwatch",
  "relojes-mujer": "s/21/relojes-mujer", "relojes-hombre": "s/22/relojes-hombre", "relojes-infantiles": "s/23/relojes-infantiles",
  "novia-collares": "s/26/collares-novia", "novia-pendientes": "s/27/pendientes-novia", "novia-pulseras": "s/36/pulseras-para-novia", "novio-gemelos": "s/28/gemelos-novio",
  "accesorios-mujer": "s/37/accesorios-mujer", "accesorios-hombre": "s/32/accesorios-hombre",
  // Categorías
  "cat-joyas": "10-joyas", "cat-relojes": "20-relojes", "cat-accesorios": "30-accesorios",
  "cat-anillos": "101-anillo", "cat-pendientes": "102-pendientes", "cat-pulseras": "103-pulseras", "cat-cadenas": "104-cadena",
  "cat-escritura": "106-escritura", "cat-collares": "107-collar", "cat-gemelos": "108-gemelos", "cat-colgantes": "110-colgante",
  "cat-piel": "300-piel", "cat-gafas": "301-gafas-de-sol",
  "preowned": "341-pre-owned", "preowned-joyas": "342-joyas", "preowned-relojes": "343-relojes",
  // Listados especiales (conservan el orden)
  "novedades": "nuevos-productos", "promociones": "promociones-especiales", "mas-vendidos": "mas-vendido",
};

function curl(url) {
  return new Promise((resolve) => {
    execFile("curl", ["-sSL", "--compressed", "--max-time", "60", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126", url],
      { maxBuffer: 30 * 1024 * 1024, encoding: "utf8" }, (err, out) => resolve(err ? "" : out));
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const result = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
  for (const [key, slug] of Object.entries(LISTS)) {
    if (result[key] && result[key].done) continue;
    const ids = []; let total = null;
    for (let page = 1; page < 200; page++) {
      const url = `https://joieriagrau.com/es/${slug}?resultsPerPage=96&page=${page}`;
      let html = "";
      for (let a = 0; a < 3 && !/js-product-miniature|Hay \d+ productos|no hay productos/i.test(html); a++) { html = await curl(url); if (!html) await sleep(4000); }
      const m = html.match(/Hay (\d+) productos?/); if (m) total = +m[1];
      const pageIds = [...html.matchAll(/js-product-miniature" data-id-product="(\d+)"/g)].map((x) => +x[1]);
      const fresh = pageIds.filter((id) => !ids.includes(id));
      ids.push(...fresh);
      await sleep(900);
      if (!fresh.length || (total && ids.length >= total)) break;
    }
    result[key] = { slug, total, ids, done: true };
    fs.writeFileSync(OUT, JSON.stringify(result));
    console.log(`${key}: ${ids.length}${total ? " / " + total : ""}`);
  }
  console.log("FIN listados");
})();
