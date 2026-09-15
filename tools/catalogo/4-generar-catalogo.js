// Convierte las fichas extraídas (raw/*.json) y los listados (lists.json) en el catálogo de la web.
const fs = require("fs");
const path = require("path");
const RAW = path.join(__dirname, "_datos", "raw");
const OUT = path.join(__dirname, "..", "..", "data");

const lists = fs.existsSync(path.join(__dirname, "_datos", "lists.json")) ? JSON.parse(fs.readFileSync(path.join(__dirname, "_datos", "lists.json"), "utf8")) : {};
const inList = {};
for (const [key, l] of Object.entries(lists)) (l.ids || []).forEach((id, i) => { (inList[id] = inList[id] || {})[key] = i; });

const BRAND_NAMES = {
  "tag-heuer": "TAG Heuer", "baume-et-mercier": "Baume & Mercier", "deakin-francis": "Deakin & Francis", "pighen": "Pig & Hen",
  "g-shock": "G-Shock", "uno-de-50": "Uno de 50", "pdpaola": "PdPaola", "gigiclozeau": "Gigi Clozeau", "dinh-van": "Dinh Van",
  "roberto-coin": "Roberto Coin", "john-hardy": "John Hardy", "ole-lynggaard": "Ole Lynggaard", "calvin-klein": "Calvin Klein",
  "michael-kors": "Michael Kors", "ulysse-nardin": "Ulysse Nardin", "my-first-diamond": "My First Diamond", "les-georgettes": "Les Georgettes",
  "van-den-abeele": "Van den Abeele", "ice-watch": "Ice-Watch", "grau": "Grau", "cluse": "Cluse",
};
const titleCase = (s) => s.toLowerCase().replace(/(^|[\s-])([a-záéíóúñ])/g, (m, a, b) => a + b.toUpperCase());

const CAT_FROM_SLUG = {
  anillo: ["joyas", "anillos"], pendientes: ["joyas", "pendientes"], collar: ["joyas", "collares"], colgante: ["joyas", "colgantes"],
  pulseras: ["joyas", "pulseras"], cadena: ["joyas", "cadenas"], medalla: ["joyas", "medallas"], joyas: ["joyas", ""], bridal: ["joyas", ""],
  relojes: ["relojes", "relojes"], omega: ["relojes", "relojes"], accesorios: ["accesorios", ""], escritura: ["accesorios", "escritura"],
  "pre-owned": ["preowned", ""],
};
const LIST_CAT = { "cat-anillos": "anillos", "cat-pendientes": "pendientes", "cat-pulseras": "pulseras", "cat-cadenas": "cadenas", "cat-collares": "collares", "cat-colgantes": "colgantes", "cat-escritura": "escritura", "cat-gemelos": "gemelos", "cat-piel": "piel", "cat-gafas": "gafas" };
const LIST_TAG = {
  "joyas-mujer": "para-mujer", "relojes-mujer": "para-mujer", "accesorios-mujer": "para-mujer",
  "joyas-hombre": "para-hombre", "relojes-hombre": "para-hombre", "accesorios-hombre": "para-hombre",
  "joyas-unisex": "para-unisex", "joyas-infantiles": "para-infantil", "relojes-infantiles": "para-infantil", "joyas-bebe": "para-bebe",
  "comunion": "ocasion-comunion", "relojes-comunion": "ocasion-comunion", "bautizo": "ocasion-bautizo",
  "novia-collares": "ocasion-novia", "novia-pendientes": "ocasion-novia", "novia-pulseras": "ocasion-novia", "novio-gemelos": "ocasion-novia",
  "relojes-compromiso": "ocasion-compromiso",
  "col-aura": "coleccion-aura", "col-halo": "coleccion-halo", "col-zodiaco": "coleccion-zodiaco", "col-good-mood": "coleccion-good-mood", "col-my-essence": "coleccion-my-essence", "col-rainbow": "coleccion-rainbow",
  "charms": "c-charms", "charms-dodo": "c-charms", "charms-pandora": "c-charms",
  "relojes-cuarzo": "tipo-cuarzo", "relojes-automatico": "tipo-automatico", "relojes-cuerda": "tipo-cuerda", "relojes-smartwatch": "tipo-smartwatch",
  "novedades": "l-novedades", "promociones": "l-promociones", "mas-vendidos": "l-mas-vendidos",
};

// Algunas descripciones de la tienda original arrastran texto pegado de buscadores o traductores: se corta ahí
const cleanText = (text) => String(text || "").split(/Abrir en el Traductor de Google|Danos tu opinión/)[0].replace(/https?:\/\/\S+/g, "").replace(/[ \t]{2,}/g, " ").trim();

const WATCH_BRANDS =new Set(["rolex", "tudor", "omega", "longines", "tissot", "rado", "hamilton", "nomos", "hublot", "seiko", "casio", "g-shock", "garmin", "tag-heuer", "baume-et-mercier"]);

const brands = {};
const items = [];
const details = [];
let written = 0, skipped = 0;
const files = fs.readdirSync(RAW).filter((f) => f.endsWith(".json"));

for (const f of files) {
  const r = JSON.parse(fs.readFileSync(path.join(RAW, f), "utf8"));
  if (r.missing || !r.name) { skipped++; continue; }
  const memb = inList[r.id] || {};

  // Algunos productos recientes cuelgan de "inicio": la sección se deduce de los listados, la marca o el nombre
  let [sec, cat] = CAT_FROM_SLUG[r.catSlug] ||
    (memb["cat-relojes"] !== undefined || WATCH_BRANDS.has(r.brandSlug) || /\breloj/i.test(r.name) ? ["relojes", "relojes"]
      : memb["cat-accesorios"] !== undefined ? ["accesorios", ""] : ["joyas", ""]);
  if (memb["preowned"] !== undefined || r.catSlug === "pre-owned") {
    sec = "preowned";
    cat = memb["preowned-relojes"] !== undefined ? "po-relojes" : memb["preowned-joyas"] !== undefined ? "po-joyas" : (/reloj/i.test(r.name) ? "po-relojes" : "po-joyas");
  }
  if (!cat || sec === "accesorios") {
    for (const [lk, c] of Object.entries(LIST_CAT)) if (memb[lk] !== undefined) {
      if (sec === "accesorios" && ["escritura", "gemelos", "piel", "gafas"].includes(c)) { cat = c; break; }
      if (sec === "joyas" && !cat && !["escritura", "gemelos", "piel", "gafas"].includes(c)) { cat = c; break; }
    }
    if (sec === "accesorios" && !cat) cat = "otros";
  }
  if (sec === "joyas" && !cat) {
    const n = r.name.toLowerCase();
    cat = /anillo|solitario|alianza|sello/.test(n) ? "anillos" : /pendiente|aro|criolla/.test(n) ? "pendientes" : /collar|gargantilla/.test(n) ? "collares" : /colgante|charm/.test(n) ? "colgantes" : /pulsera|brazalete|esclava/.test(n) ? "pulseras" : /cadena/.test(n) ? "cadenas" : "";
  }

  const brandKey = (r.brandSlug && !/\.html$/.test(r.brandSlug)) ? r.brandSlug : "";
  if (brandKey) brands[brandKey] = brands[brandKey] || BRAND_NAMES[brandKey] || titleCase(r.brand || brandKey.replace(/-/g, " "));

  const tags = new Set();
  for (const [lk, t] of Object.entries(LIST_TAG)) if (memb[lk] !== undefined) tags.add(t);
  for (const [lk, c] of Object.entries(LIST_CAT)) if (memb[lk] !== undefined && c !== cat) tags.add("c-" + c);
  // Colecciones Grau también por nombre (algunas selecciones de la web original están limitadas a 32 productos)
  if (brandKey === "grau") {
    const COL = { aura: /\baura\b/i, halo: /\bhalo\b/i, zodiaco: /zod[ií]aco/i, "good-mood": /good\s*mood/i, "my-essence": /my\s*essence/i, rainbow: /\brainbow\b/i };
    for (const [c, re] of Object.entries(COL)) if (re.test(r.name)) tags.add("coleccion-" + c);
  }

  const imgs = (r.images || []).map((u) => u.match(/\/(\d+)-[a-z_]+\/([^/]+)\.(?:jpe?g|png|webp)$/i)).filter(Boolean);
  const slug = imgs[0] ? imgs[0][2] : (r.url.match(/\/\d+-([^/]+)\.html$/) || [])[1];
  const imageIds = imgs.map((m) => +m[1]);
  const stock = (r.availability === "InStock" || r.availability === "LimitedAvailability") && !/sin stock|fuera de stock|agotado/i.test(r.availabilityText || "") ? 1 : 0;
  const rank = memb["novedades"] !== undefined ? memb["novedades"] : 20000 + (20000 - r.id);

  items.push([r.id, slug, r.name, brandKey, r.price || 0, r.regularPrice && r.regularPrice > (r.price || 0) ? r.regularPrice : 0, sec, cat, [...tags].join(" "), imageIds[0] || 0, imageIds[1] || 0, stock, rank]);

  details.push({
    id: r.id, slug, name: r.name, brand: brandKey, brandName: brands[brandKey] || "", sec, cat, price: r.price || 0,
    regularPrice: r.regularPrice || 0, stock, availabilityText: r.availabilityText || "", reference: r.reference || "",
    short: cleanText(r.short), description: r.description && r.description !== r.short ? cleanText(r.description) : "",
    info: r.info || undefined, sizeGuide: r.sizeGuide || undefined, variants: r.variants || undefined,
    images: imageIds, related: r.related || [], tags: [...tags],
  });
}

items.sort((a, b) => a[12] - b[12]);
const sortedBrands = Object.fromEntries(Object.entries(brands).sort((a, b) => a[1].localeCompare(b[1], "es")));

// Se vacían las carpetas de salida para no dejar fichas de productos retirados
for (const dir of ["productos", "marcas"]) {
  const full = path.join(OUT, dir);
  fs.mkdirSync(full, { recursive: true });
  for (const f of fs.readdirSync(full)) if (f.endsWith(".json")) fs.unlinkSync(path.join(full, f));
}

const byId = new Map(items.map((it) => [it[0], it]));
const brandSubset = (list) => Object.fromEntries([...new Set(list.map((it) => it[3]).filter(Boolean))].map((k) => [k, sortedBrands[k]]));

// Ficha de cada producto con sus relacionados ya resueltos (la ficha no necesita cargar el catálogo completo)
for (const d of details) {
  const rel = d.related.map((id) => byId.get(id)).filter(Boolean);
  for (const it of items) {
    if (rel.length >= 8) break;
    if (it[0] !== d.id && it[3] === d.brand && it[6] === d.sec && it[11] && !rel.includes(it)) rel.push(it);
  }
  d.relatedItems = rel.slice(0, 8);
  d.relatedBrands = brandSubset(d.relatedItems);
  delete d.related;
  fs.writeFileSync(path.join(OUT, "productos", d.id + ".json"), JSON.stringify(d));
  written++;
}

// Selección destacada de cada marca (páginas de marca)
for (const key of Object.keys(sortedBrands)) {
  const list = items.filter((it) => it[3] === key).sort((a, b) => (b[11] - a[11]) || (a[12] - b[12])).slice(0, 8);
  fs.writeFileSync(path.join(OUT, "marcas", key + ".json"), JSON.stringify({ brands: { [key]: sortedBrands[key] }, items: list }));
}

fs.writeFileSync(path.join(OUT, "catalogo.json"), JSON.stringify({ updated: new Date().toISOString().slice(0, 10), brands: sortedBrands, items }));

const bySec = items.reduce((acc, it) => ((acc[it[6]] = (acc[it[6]] || 0) + 1), acc), {});
const byCat = items.reduce((acc, it) => ((acc[it[6] + "/" + it[7]] = (acc[it[6] + "/" + it[7]] || 0) + 1), acc), {});
console.log(`Productos: ${written} · omitidos: ${skipped} · marcas: ${Object.keys(brands).length}`);
console.log("Por sección:", bySec);
console.log("Por categoría:", byCat);
console.log("Tamaño catalogo.json:", Math.round(fs.statSync(path.join(OUT, "catalogo.json")).size / 1024) + " KB");
