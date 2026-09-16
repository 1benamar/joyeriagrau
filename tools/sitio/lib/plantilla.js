// Partes comunes de todas las páginas: <head>, cabecera, pie y bloques reutilizables.
const fs = require("fs");
const path = require("path");
const C = require("./config");

const IMG_DIR = path.join(__dirname, "..", "..", "..", "assets", "img");

let version = "1";
const setVersion = (v) => { version = v; };

const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const absolute = (file) => C.url + "/" + (file === "index.html" ? "" : file);
const direccion = (t) => `${t.calle}<br>${t.cp} ${t.ciudad}${t.provincia !== t.ciudad ? ` (${t.provincia})` : ""}`;
const whatsapp = (texto) => `https://wa.me/${C.whatsapp}${texto ? "?text=" + encodeURIComponent(texto) : ""}`;
const jsonLd = (data) => `  <script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>\n`;

/* ------------------------------------------------------------------ */
/* <head>                                                              */
/* ------------------------------------------------------------------ */
/* Presentación de la marca: solo en la portada, una vez por sesión y sin movimiento reducido */
const INTRO_SCRIPT = `  <script>try{if(!sessionStorage.getItem("grau-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("has-intro");sessionStorage.setItem("grau-intro","1")}}catch(e){}</script>\n`;

function head({ file, title, description, image, type = "website", scripts = [], schema = [], robots = "", intro = false }) {
  const img = image || C.imagenPorDefecto;
  const canonical = absolute(file);
  return `<!doctype html>
<html lang="es" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
${robots ? `  <meta name="robots" content="${robots}">\n` : `  <link rel="canonical" href="${canonical}">\n`}  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${C.nombre}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${/^https?:/.test(img.src) ? img.src : C.url + "/" + img.src}">
${img.width ? `  <meta property="og:image:width" content="${img.width}">\n  <meta property="og:image:height" content="${img.height}">\n` : ""}  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#f7f3ec">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&amp;family=Playfair+Display:wght@400;500&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v=${version}">
  <script>document.documentElement.className = document.documentElement.className.replace("no-js", "js");</script>
${intro ? INTRO_SCRIPT : ""}  <script defer src="main.js?v=${version}"></script>
${scripts.map((s) => `  <script defer src="${s}?v=${version}"></script>\n`).join("")}${schema.map(jsonLd).join("")}</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
${intro ? `  <div class="intro" aria-hidden="true">
    <div class="intro__inner">
      <img src="assets/img/logo.svg" alt="" width="92" height="30">
      <span class="intro__line"></span>
      <p>Joyería y relojería · Desde 1947</p>
    </div>
  </div>
` : ""}`;
}

/* ------------------------------------------------------------------ */
/* Cabecera y menú móvil                                               */
/* ------------------------------------------------------------------ */
const amp = (href) => href.replace(/&(?!amp;)/g, "&amp;");

/* Panel desplegable de un apartado del menú principal */
function megaMenu(key, { columnas, destacados, enlace }) {
  const slug = key.replace(/\.html$/, "");
  return `<div class="mega" id="menu-${slug}" data-mega-panel>
          <div class="wrap mega__grid">
            ${columnas.map(([title, links]) => `<div class="mega__col">
              <p class="mega__title">${esc(title)}</p>
              <ul>${links.map(([href, text]) => `<li><a href="${amp(href)}">${esc(text)}</a></li>`).join("")}</ul>
            </div>`).join("\n            ")}
            <div class="mega__features mega__features--${destacados.length}">
              ${destacados.map(([src, w, h, title, meta, href]) => `<a class="mega__feature" href="${amp(href)}">
                <span class="mega__img"><img src="assets/img/${src}" alt="" width="${w}" height="${h}" loading="lazy" decoding="async"></span>
                <span class="mega__meta">${esc(meta)}</span>
                <span class="mega__name">${esc(title)}</span>
              </a>`).join("\n              ")}
            </div>
            <a class="mega__all link-line" href="${key}">${esc(enlace)}</a>
          </div>
        </div>`;
}

function header(active, overlay = false) {
  const current = (href) => (href === active ? ' aria-current="page"' : "");
  const link = ([href, label]) => `<a href="${href}"${current(href)}>${label}</a>`;
  const { izquierda, derecha } = C.navegacion;
  const item = ([href, label]) => {
    const menu = C.menus[href];
    if (!menu) return link([href, label]);
    const slug = href.replace(/\.html$/, "");
    return `<div class="nav__item" data-mega>
        <a href="${href}"${current(href)}>${label}</a>
        <button type="button" class="nav__more" aria-expanded="false" aria-controls="menu-${slug}"><span class="sr-only">Mostrar el menú de ${label}</span><svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg></button>
        ${megaMenu(href, menu)}
      </div>`;
  };
  const drawerLinks = [["catalogo.html", "Tienda"], ...izquierda, ...derecha];
  return `
  <div class="topbar">Envío gratuito en pedidos superiores a <strong>75 €</strong></div>

  <header class="header${overlay ? " header--overlay" : ""}">
    <div class="wrap header__row">
      <button type="button" class="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
      <nav class="nav" aria-label="Principal">
      ${izquierda.map(item).join("\n      ")}
      </nav>
      <a class="header__logo" href="index.html" aria-label="Grau, ir al inicio"><img src="assets/img/logo.svg" alt="Grau" width="92" height="30"></a>
      <nav class="nav nav--right" aria-label="Secundaria">
        ${derecha.map(link).join("\n        ")}
        <a class="nav__search" href="catalogo.html#buscar" aria-label="Buscar en la tienda"${active === "catalogo.html" ? ' aria-current="page"' : ""}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg></a>
        <a class="nav__cta" href="cita.html"${active === "cita.html" ? ' aria-current="page"' : ""}>Pedir cita</a>
      </nav>
      <a class="header__search" href="catalogo.html#buscar" aria-label="Buscar en la tienda"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg></a>
    </div>
  </header>
  <div class="nav-backdrop" data-nav-backdrop hidden></div>

  <nav class="drawer" id="drawer" aria-label="Menú móvil">
    <div class="drawer__inner">
      <ul class="drawer__main">
        ${drawerLinks.map(([href, label], i) => `<li style="--i:${i}"><a href="${href}"${current(href)}><small>${String(i + 1).padStart(2, "0")}</small>${label}</a></li>`).join("\n        ")}
      </ul>
      <ul class="drawer__sub" style="--i:${drawerLinks.length}">
        <li><a href="historia.html"${current("historia.html")}>Nuestra historia</a></li>
        <li><a href="blog.html"${current("blog.html")}>Blog</a></li>
        <li><a href="marcas.html#relojeria">Relojería oficial</a></li>
      </ul>
      <div class="drawer__foot" style="--i:${drawerLinks.length + 1}">
        <a class="btn btn--full" href="cita.html">Pedir cita <span class="arrow"></span></a>
        <p><a href="tel:${C.telefono.href}">${C.telefono.texto}</a><a href="${whatsapp()}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:${C.email}">${C.email}</a></p>
      </div>
    </div>
  </nav>
`;
}

/* ------------------------------------------------------------------ */
/* Pie                                                                 */
/* ------------------------------------------------------------------ */
function footer() {
  const col = (title, items) => `
        <div>
          <h2 class="footer__title">${title}</h2>
          <ul>
            ${items.map(([href, label, attrs = ""]) => href ? `<li><a href="${href}"${attrs}>${label}</a></li>` : `<li>${label}</li>`).join("\n            ")}
          </ul>
        </div>`;
  const ext = ' target="_blank" rel="noopener"';
  return `
  <footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          <img class="footer__logo" src="assets/img/logo.svg" alt="Grau" width="92" height="30">
          <p class="footer__about">Joyería y relojería desde 1947. Barcelona, Lloret de Mar, Sabadell y Blanes.</p>
        </div>${col("Tienda", [["catalogo.html", "Todo el catálogo"], ["joyas.html", "Joyas"], ["relojes.html", "Relojes"], ["compromiso.html", "Compromiso"], ["pre-owned.html", "Pre-owned"], ["marcas.html", "Marcas"]])}${col("Grau", [["historia.html", "Nuestra historia"], ["tiendas.html", "Nuestras tiendas"], ["blog.html", "Blog"]])}${col("Ayuda", [["cita.html", "Pedir cita"], ["envios.html", "Envíos"], ["devoluciones.html", "Devoluciones"], ["preguntas-frecuentes.html", "Preguntas frecuentes"], ["guia-de-tallas.html", "Guía de tallas"], [C.sugerencias, "Envíanos sugerencias", ext]])}${col("Contacto", [["tel:" + C.telefono.href, C.telefono.internacional], [whatsapp(), "WhatsApp", ext], ["mailto:" + C.email, C.email], ["", C.horarioAtencion]])}
      </div>
      <div class="footer__bottom">
        <p>© <span data-year>${new Date().getFullYear()}</span> ${C.razonSocial}. España. Todos los derechos reservados.</p>
        <nav class="footer__links" aria-label="Información legal">
          <a href="aviso-legal.html">Aviso legal</a><a href="terminos.html">Términos</a><a href="privacidad.html">Privacidad</a><a href="cookies.html">Cookies</a><a href="codigo-etico.html">Código ético</a><a href="accesibilidad.html">Accesibilidad</a>
        </nav>
        <nav class="footer__links" aria-label="Redes sociales">
          ${C.redes.map(([n, u]) => `<a href="${u}"${ext}>${n}</a>`).join("")}
        </nav>
      </div>
    </div>
  </footer>
`;
}

/* ------------------------------------------------------------------ */
/* Bloques reutilizables                                               */
/* ------------------------------------------------------------------ */
const crumbs = (label, parents = []) => `<nav class="crumbs hero__in" style="--d:0s" aria-label="Ruta de navegación"><a href="index.html">Inicio</a>${parents.map(([h, l]) => `<i aria-hidden="true"></i><a href="${h}">${l}</a>`).join("")}<i aria-hidden="true"></i><span aria-current="page">${label}</span></nav>`;

/* Versiones reducidas de una imagen (nombre-640.jpg, nombre-1280.jpg) para srcset */
function srcset(src, w) {
  const base = src.replace(/.jpg$/, "");
  const sizes = [640, 1280].filter((n) => n < w && fs.existsSync(path.join(IMG_DIR, `${base}-${n}.jpg`)));
  return sizes.length ? [...sizes.map((n) => `assets/img/${base}-${n}.jpg ${n}w`), `assets/img/${src} ${w}w`].join(", ") : "";
}
const responsive = (src, w, sizes) => { const set = srcset(src, w); return set ? ` srcset="${set}" sizes="${sizes}"` : ""; };

const img = (src, alt, w, h, extra = "", sizes = "(max-width: 900px) 100vw, 50vw") =>
  `<img src="assets/img/${src}"${responsive(src, w, sizes)} alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async"${extra}>`;

/* Cabecera de página. Con imagen vertical, la imagen ocupa media pantalla a sangre;
   con imagen apaisada ("wide") se mantiene enmarcada; sin imagen, cabecera de texto. */
function pageHero({ crumb, parents, eyebrow, title, lead, actions = "", image, wide = false, caption = "", position = "" }) {
  const split = image && !wide;
  const media = image ? `
        <figure class="page-hero__media${wide ? " page-hero__media--wide" : ""}">
          <img src="assets/img/${image.src}"${responsive(image.src, image.width, split ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 100vw, 45vw")} alt="${esc(image.alt)}" width="${image.width}" height="${image.height}" fetchpriority="high"${split ? " data-parallax" : ""}${position ? ` style="object-position:${position}"` : ""}>
          ${caption ? `<figcaption class="media-caption">${caption}</figcaption>` : ""}
        </figure>` : "";
  const text = `<div class="page-hero__text">
          ${crumbs(crumb, parents)}
          <p class="eyebrow hero__in" style="--d:.08s">${eyebrow}</p>
          <h1 class="display page-hero__title" data-split style="--d:.16s">${title}</h1>
          <p class="lead hero__in" style="--d:.4s">${lead}</p>
          ${actions ? `<div class="hero__actions hero__in" style="--d:.52s">${actions}</div>` : ""}
        </div>`;
  if (split) return `
    <section class="page-hero page-hero--split">
      <div class="page-hero__grid">
        ${text}${media}
      </div>
    </section>
`;
  return `
    <section class="page-hero${image ? "" : " page-hero--plain"}">
      <div class="wrap page-hero__grid">
        ${text}${media}
      </div>
    </section>
`;
}

function ctaBand({ eyebrow = "Asesoramiento personal", title = "¿Te ayudamos a elegir?", text = "Pide cita en tu joyería preferida y te atenderemos con calma, sin compromiso. También puedes escribirnos por WhatsApp o llamarnos.", service = "" } = {}) {
  return `
    <section class="section cta-band">
      <div class="wrap cta-band__grid">
        <div class="reveal">
          <p class="eyebrow">${eyebrow}</p>
          <h2 class="h2" data-split>${title}</h2>
          <p>${text}</p>
        </div>
        <div class="cta-band__actions reveal" data-delay="1">
          <a class="btn btn--light" href="cita.html${service ? "?servicio=" + service : ""}">Pedir cita <span class="arrow"></span></a>
          <a class="btn btn--outline-light" href="${whatsapp()}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </section>
`;
}

const sectionHead = (eyebrow, title, side = "") => `
        <div class="section__head">
          <div class="reveal">
            <p class="eyebrow">${eyebrow}</p>
            <h2 class="h2" data-split>${title}</h2>
          </div>
          ${side}
        </div>`;

/* Datos estructurados de la empresa y sus joyerías */
const schemaTiendas = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: C.nombre,
  url: C.url + "/",
  logo: C.url + "/assets/img/logo.svg",
  email: C.email,
  telephone: C.telefono.internacional,
  foundingDate: "1947",
  sameAs: C.redes.map(([, u]) => u),
  subOrganization: C.tiendas.map((t) => ({
    "@type": "JewelryStore",
    name: `${C.nombre} ${t.nombre}`,
    image: C.url + "/assets/img/" + t.foto[0],
    telephone: t.tel,
    url: C.url + "/tiendas.html#" + t.slug,
    address: { "@type": "PostalAddress", streetAddress: t.calle, postalCode: t.cp, addressLocality: t.ciudad, addressRegion: t.provincia, addressCountry: "ES" },
    openingHoursSpecification: t.horas.map(([days, opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days.split(",").map((d) => ({ Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday" })[d]),
      opens, closes,
    })),
  })),
});

/* Página completa con cabecera y pie estándar */
function page(opts) {
  return head(opts) + header(opts.active, opts.overlay) + '\n  <main id="contenido" tabindex="-1">\n' + opts.body + "  </main>\n" + footer() + "\n</body>\n</html>\n";
}

module.exports = { setVersion, esc, absolute, direccion, whatsapp, head, header, footer, crumbs, img, srcset, responsive, pageHero, ctaBand, sectionHead, schemaTiendas, page };
