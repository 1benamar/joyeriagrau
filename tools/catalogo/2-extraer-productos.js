// Extrae todas las fichas de producto de joieriagrau.com (lista del sitemap) a JSON.
// Reanudable: salta los productos ya guardados. Usa "--todo" para volver a descargarlos todos.
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const BASE = path.join(__dirname, "_datos");
const RAW = path.join(BASE, "raw");
const HTMLDIR = path.join(BASE, "html");
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(HTMLDIR, { recursive: true });
const URLS = fs.readFileSync(path.join(BASE, "urls-productos.txt"), "utf8").split(/\r?\n/).filter(Boolean);
const CONCURRENCY = +process.argv[2] || 4;
const LIMIT = +process.argv[3] || URLS.length;

const decode = (s) => s
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;| /g, " ").replace(/&euro;/g, "€").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const text = (s) => decode((s || "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h\d)>/gi, "\n").replace(/<[^>]+>/g, " "))
  .replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{2,}/g, "\n").trim();

function parse(html, url) {
  const id = +url.match(/\/(\d+)-[^/]+\.html$/)[1];
  const seg = url.split("/");
  const p = { id, url, catSlug: seg[4], brandSlug: seg[5] };
  const g = (re, i = 1) => { const m = html.match(re); return m ? m[i] : null; };

  p.name = decode(g(/<h1 class="h1" itemprop="name">([\s\S]*?)<\/h1>/) || "").trim();
  const man = html.match(/class="product-manufacturer">\s*<a href="[^"]*\/brand\/(\d+)-([^"]+)">\s*<img[^>]*alt="([^"]*)"/);
  if (man) { p.brandId = +man[1]; p.brand = decode(man[3]).trim(); p.brandSlug = man[2]; }
  const h1 = html.indexOf('itemprop="name">' + (g(/<h1 class="h1" itemprop="name">([\s\S]*?)<\/h1>/) || ""));
  const after = h1 > 0 ? html.slice(h1, h1 + 6000) : html;
  const price = after.match(/itemprop="price" content="([\d.]+)"/);
  p.price = price ? +price[1] : null;
  const reg = after.match(/class="regular-price">([^<]+)</);
  if (reg) p.regularPrice = +decode(reg[1]).replace(/[^\d,]/g, "").replace(",", ".");
  const disc = after.match(/class="discount[^"]*">([^<]+)</);
  if (disc) p.discount = decode(disc[1]).trim();
  p.availability = g(/itemprop="availability" href="https?:\/\/schema\.org\/(\w+)"/);
  const avail = html.match(/id="product-availability">([\s\S]*?)<\/span>/);
  if (avail) p.availabilityText = text(avail[1].replace(/<i[\s\S]*?<\/i>/g, ""));

  const short = html.match(/id="product-description-short"[^>]*>([\s\S]*?)<div class="product-information">/);
  if (short) p.short = text(short[1]);
  const long = html.match(/<div class="product-description">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
  if (long) p.description = text(long[1]);

  const more = html.match(/id="moreinfo_tab"[\s\S]*?<ul>([\s\S]*?)<\/ul>/);
  if (more) {
    const items = [...more[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
    p.info = [];
    for (const it of items) {
      if (/guia-de-tallas/.test(it)) { p.sizeGuide = true; continue; }
      const t = text(it);
      const kv = t.match(/^([^:]{2,40}):\s*(.+)$/);
      if (kv && /referencia/i.test(kv[1])) p.reference = kv[2].trim();
      else if (kv) p.info.push([kv[1].trim(), kv[2].trim()]);
      else if (t) p.info.push(["", t]);
    }
    if (!p.info.length) delete p.info;
  }

  const imgBlock = html.match(/class="product-images[^"]*"[^>]*>([\s\S]*?)<\/ul>/);
  const imgs = [...((imgBlock ? imgBlock[1] : "").matchAll(/data-image-large-src="([^"]+)"/g))].map((m) => m[1]);
  if (!imgs.length) {
    const cover = g(/class="js-qv-product-cover"[^>]*src="([^"]+)"/) || g(/<meta property="og:image" content="([^"]+)"/);
    if (cover) imgs.push(cover);
  }
  p.images = [...new Set(imgs)];
  p.imageAlt = decode(g(/data-image-large-src="[^"]+"\s+src="[^"]+"\s+alt="([^"]*)"/) || "");

  const crumbs = [...html.matchAll(/itemprop="itemListElement"[\s\S]*?<a itemprop="item" href="([^"]+)">\s*<span itemprop="name">([\s\S]*?)<\/span>/g)]
    .map((m) => [m[1], decode(m[2]).trim()]);
  p.breadcrumb = crumbs.slice(1, -1).map(([u, n]) => ({ name: n, url: u }));

  const variants = html.match(/class="product-variants[^"]*">([\s\S]*?)<\/div>\s*<section class="product-discounts">/);
  if (variants && /<select|<input/.test(variants[1])) {
    p.variants = [...variants[1].matchAll(/<span class="control-label">([\s\S]*?)<\/span>[\s\S]*?<select[\s\S]*?>([\s\S]*?)<\/select>/g)]
      .map((m) => ({ label: text(m[1]), options: [...m[2].matchAll(/<option[^>]*>([\s\S]*?)<\/option>/g)].map((o) => text(o[1])) }));
    if (!p.variants.length) delete p.variants;
  }

  const acc = html.match(/class="product-accessories[\s\S]*?<\/section>/);
  if (acc) p.related = [...new Set([...acc[0].matchAll(/data-id-product="(\d+)"/g)].map((m) => +m[1]))];
  return p;
}

function curl(url) {
  return new Promise((resolve, reject) => {
    execFile("curl", ["-sSL", "--compressed", "--max-time", "40", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36", "-w", "\n__STATUS__%{http_code}", url],
      { maxBuffer: 20 * 1024 * 1024, encoding: "utf8" }, (err, out) => {
        if (err) return reject(err);
        const i = out.lastIndexOf("\n__STATUS__");
        resolve({ status: +out.slice(i + 11), body: out.slice(0, i) });
      });
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const all = process.argv.includes("--todo");
  const todo = URLS.slice(0, LIMIT).filter((u) => all || !fs.existsSync(path.join(RAW, u.match(/\/(\d+)-[^/]+\.html$/)[1] + ".json")));
  console.log(`Pendientes: ${todo.length} de ${Math.min(LIMIT, URLS.length)} · concurrencia ${CONCURRENCY}`);
  let done = 0, fail = 0; const t0 = Date.now(); let idx = 0;
  const errors = [];
  async function worker(w) {
    await sleep(w * 250);
    while (idx < todo.length) {
      const url = todo[idx++];
      let ok = false;
      for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
        try {
          const { status, body } = await curl(url);
          if (status === 200 && /itemprop="name"/.test(body)) {
            const p = parse(body, url);
            fs.writeFileSync(path.join(RAW, p.id + ".json"), JSON.stringify(p));
            ok = true;
          } else if (status === 404 || status === 410 || (status === 200 && !/itemprop="name"/.test(body))) {
            fs.writeFileSync(path.join(RAW, url.match(/\/(\d+)-[^/]+\.html$/)[1] + ".json"), JSON.stringify({ id: +url.match(/\/(\d+)-[^/]+\.html$/)[1], url, missing: status }));
            ok = true;
          } else { await sleep(3000 * attempt); }
        } catch (e) { await sleep(3000 * attempt); }
      }
      if (!ok) { fail++; errors.push(url); }
      done++;
      if (done % 100 === 0) {
        const rate = done / ((Date.now() - t0) / 1000);
        console.log(`${done}/${todo.length} · ${rate.toFixed(2)}/s · fallos ${fail} · quedan ~${Math.round((todo.length - done) / rate / 60)} min`);
      }
      await sleep(120);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  fs.writeFileSync(path.join(BASE, "errores.txt"), errors.join("\n"));
  console.log(`FIN · ${done} procesados · ${fail} fallos · ${Math.round((Date.now() - t0) / 1000)} s`);
})();
