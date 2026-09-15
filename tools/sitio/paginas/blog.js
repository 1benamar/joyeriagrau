// Blog: listado con filtro por categoría y una página por artículo (blog/<slug>.html).
const C = require("../lib/config");
const { esc, pageHero, ctaBand, sectionHead } = require("../lib/plantilla");

const fecha = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
const normalize = (s) => s.replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/g, " ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/* Algunos artículos repiten el título como primer encabezado del contenido: se quita porque ya es el h1 */
function withoutRepeatedTitle(content, title) {
  const first = content.match(/<(h[1-4])>([\s\S]*?)<\/\1>/);
  return first && normalize(first[2]) === normalize(title) ? content.replace(first[0], "") : content;
}

module.exports = function (site) {
  const { posts, categories } = site.blog;
  const catName = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const image = (p) => p.image ? `<img src="${esc(p.image.src)}" alt="${esc(p.alt)}" width="${p.image.width}" height="${p.image.height}" loading="lazy" decoding="async">` : "";

  site.page("blog.html", {
    title: "Blog · Joyería Grau",
    description: "El blog de Joyería Grau: tendencias en joyería, relojería, bodas, eventos y consejos de nuestros joyeros.",
    active: "blog.html",
    body: pageHero({
      crumb: "Blog", eyebrow: "El blog de Grau", title: "Historias que brillan",
      lead: "Tendencias en joyería y relojería, bodas, eventos y los consejos de nuestros joyeros.",
      actions: `<div class="blog-cats" data-blog-cats role="group" aria-label="Filtrar por categoría"><button type="button" aria-pressed="true" data-cat="">Todos</button>${categories.map((c) => `<button type="button" aria-pressed="false" data-cat="${c.slug}">${esc(c.name)}</button>`).join("")}</div>`,
    }) + `
    <section class="section">
      <div class="wrap">
        <h2 class="sr-only">Artículos</h2>
        <p class="sr-only" data-blog-status role="status"></p>
        <div class="blog-grid" data-blog-grid>
          ${posts.map((p) => `<a class="post" href="blog/${p.slug}.html" data-cats="${p.categories.join(" ")}"><div class="post__img">${image(p)}</div><p class="post__tag">${p.categories.map((c) => catName[c]).filter(Boolean).slice(0, 2).join(" · ")}</p><h3 class="h3">${esc(p.title)}</h3><p>${esc(p.excerpt.slice(0, 220))}</p><span class="post__date">${fecha(p.date)}</span></a>`).join("\n          ")}
        </div>
        <div class="catalog__more"><button type="button" class="btn btn--ghost" data-blog-more>Ver más artículos</button></div>
      </div>
    </section>
`,
  });

  for (const p of posts) {
    const related = posts.filter((q) => q.slug !== p.slug && q.categories.some((c) => p.categories.includes(c))).slice(0, 3);
    const cover = p.cover || p.image;
    site.page(`blog/${p.slug}.html`, {
      title: `${p.title} · Blog de Joyería Grau`,
      description: p.description,
      active: "blog.html",
      type: "article",
      image: cover ? { src: cover.src, width: cover.width, height: cover.height } : null,
      lastmod: p.modified,
      schema: [{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        dateModified: p.modified,
        image: cover ? [cover.src] : undefined,
        mainEntityOfPage: `${C.url}/blog/${p.slug}.html`,
        author: { "@type": "Organization", name: C.nombre },
        publisher: { "@type": "Organization", name: C.nombre, logo: { "@type": "ImageObject", url: C.url + "/assets/img/logo.svg" } },
      }],
      body: `
    <section class="section section--tight">
      <div class="wrap">
        <article class="article">
          <header class="article__head">
            <nav class="crumbs crumbs--center" aria-label="Ruta de navegación"><a href="index.html">Inicio</a><i aria-hidden="true"></i><a href="blog.html">Blog</a></nav>
            <p class="eyebrow eyebrow--plain">${p.categories.filter((c) => catName[c]).map((c) => `<a href="blog.html#${c}">${esc(catName[c])}</a>`).join(" · ")}</p>
            <h1 class="h2">${esc(p.title)}</h1>
            <p class="article__meta"><time datetime="${p.date}">${fecha(p.date)}</time></p>
          </header>
          ${cover ? `<figure class="article__cover"><img src="${esc(cover.src)}" alt="${esc(p.alt)}" width="${cover.width}" height="${cover.height}" fetchpriority="high"></figure>` : ""}
          <div class="prose">${site.prose(withoutRepeatedTitle(p.content, p.title))}</div>
          <p class="article__back"><a class="link-line" href="blog.html">Volver al blog</a></p>
        </article>
      </div>
    </section>
    ${related.length ? `<section class="section section--paper">
      <div class="wrap">${sectionHead("Sigue leyendo", "Artículos relacionados")}
        <div class="journal">
          ${related.map((q) => `<a class="post" href="blog/${q.slug}.html"><div class="post__img">${image(q)}</div><p class="post__tag">${fecha(q.date)}</p><h3 class="h3">${esc(q.title)}</h3><span class="link-line">Leer</span></a>`).join("\n          ")}
        </div>
      </div>
    </section>` : ""}
` + ctaBand(),
    });
  }
};
