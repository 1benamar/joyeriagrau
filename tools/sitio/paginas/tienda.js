// Tienda: listado del catálogo, ficha de producto y páginas de las marcas oficiales.
const C = require("../lib/config");
const { img, pageHero, ctaBand, sectionHead } = require("../lib/plantilla");

const og = (src, width, height) => ({ src: "assets/img/" + src, width, height });

module.exports = function (site) {
  const catSections = `<nav class="cat-sections" data-cat-sections aria-label="Secciones de la tienda">
            <a href="catalogo.html">Todo</a><a href="catalogo.html?seccion=joyas">Joyas</a><a href="catalogo.html?seccion=relojes">Relojes</a><a href="catalogo.html?seccion=accesorios">Accesorios</a><a href="catalogo.html?seccion=preowned">Pre-owned</a><a href="catalogo.html?lista=novedades">Novedades</a>
          </nav>`;

  site.page("catalogo.html", {
    title: "Tienda · Joyería Grau",
    description: "Catálogo completo de Joyería Grau: joyas, relojes, accesorios y piezas pre-owned de Grau y de las mejores firmas internacionales.",
    active: "catalogo.html",
    scripts: ["catalogo.js"],
    body: `
    <section class="cat-hero">
      <div class="wrap">
        <nav class="crumbs" aria-label="Ruta de navegación" data-cat-crumb><a href="index.html">Inicio</a><i aria-hidden="true"></i><span aria-current="page">Tienda</span></nav>
        <h1 class="display cat-hero__title" data-cat-title>Tienda</h1>
        <p class="lead" data-cat-lead>Joyas, relojes y accesorios de Joyería Grau y de las mejores firmas internacionales.</p>
        ${catSections}
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="resultados-titulo">
      <div class="wrap catalog" data-catalog>
        <aside class="filters" id="filtros" data-filters aria-label="Filtros">
          <div class="filters__head"><b>Filtros</b><button type="button" class="filters__close" data-filters-close aria-label="Cerrar filtros">×</button></div>
          <div data-filters-body></div>
          <button type="button" class="btn btn--full filters__apply" data-filters-close>Ver resultados</button>
        </aside>
        <div class="catalog__main">
          <h2 class="sr-only" id="resultados-titulo">Productos</h2>
          <div class="catalog__bar">
            <button type="button" class="btn btn--ghost btn--sm filters-toggle" data-filters-open aria-expanded="false" aria-controls="filtros">Filtros</button>
            <p class="catalog__count" data-count role="status">&nbsp;</p>
            <div class="field" id="buscar"><input type="search" id="cat-q" placeholder=" " data-search autocomplete="off" enterkeyhint="search"><label for="cat-q">Buscar por nombre o marca</label></div>
            <div class="field"><select id="cat-sort" data-sort></select><label for="cat-sort">Ordenar</label></div>
          </div>
          <div class="active-filters" data-active></div>
          <div class="product-grid" data-grid></div>
          <div class="catalog__more"><button type="button" class="btn btn--ghost" data-more hidden>Ver más productos</button><p data-progress></p></div>
          <noscript><p>Activa JavaScript para ver el catálogo o llámanos al ${C.telefono.texto}.</p></noscript>
        </div>
      </div>
    </section>
` + ctaBand({ title: "¿No encuentras lo que buscas?", text: "Nuestro equipo te ayuda a localizar cualquier pieza en nuestras boutiques. Escríbenos por WhatsApp o pide cita." }),
  });

  site.page("producto.html", {
    title: "Producto · Joyería Grau",
    description: "Ficha de producto de Joyería Grau: descripción, precio, disponibilidad y reserva por WhatsApp o cita en boutique.",
    active: "catalogo.html",
    scripts: ["catalogo.js"],
    sitemap: false,
    body: `
    <section class="pdp-wrap" data-product aria-live="polite"><div class="wrap"><p class="catalog__loading">Cargando producto…</p></div></section>

    <section class="section section--paper" data-related hidden>
      <div class="wrap">${sectionHead("También te puede interesar", "Piezas relacionadas", `<a class="link-line" data-related-more href="catalogo.html">Ver más</a>`)}
        <div class="product-grid product-grid--related" data-related-grid></div>
      </div>
    </section>
` + ctaBand({ eyebrow: "Asesoramiento personal", title: "¿Quieres verla en persona?", text: "Pide cita y te la prepararemos en tu boutique preferida. También puedes reservarla por WhatsApp." }),
  });

  /* ------------------------------------------------------------------ */
  /* Marcas con sección oficial                                          */
  /* ------------------------------------------------------------------ */
  const official = (brand, url) => `<a class="btn btn--ghost" href="${url}" target="_blank" rel="noopener">Sección oficial de ${brand} <span class="arrow"></span></a>`;
  const officialNote = (brand) => `<p class="official-note"><span aria-hidden="true">ⓘ</span><span><b>Sección oficial de ${brand}.</b> La colección y la información oficial de ${brand} se consultan en la sección de la marca dentro de joieriagrau.com, que se abre en una pestaña nueva.</span></p>`;
  const brandGrid = (key, name) => `
    <section class="section section--paper">
      <div class="wrap">${sectionHead("En nuestra tienda", "Selección " + name, `<a class="link-line reveal" href="catalogo.html?marca=${key}">Ver todo ${name}</a>`)}
        <div class="product-grid" data-brand-grid="${key}"><p class="catalog__loading">Cargando…</p></div>
      </div>
    </section>`;

  const rolexStores = C.tiendas.filter((t) => ["barcelona", "lloret"].includes(t.slug));
  site.page("rolex.html", {
    title: "Rolex en Joyería Grau · Distribuidor oficial",
    description: "Joyería Grau es distribuidor oficial Rolex y servicio técnico oficial en Barcelona y Lloret de Mar. Pide cita en nuestras boutiques.",
    active: "relojes.html",
    image: og("rolex-m.jpg", 1071, 1300),
    body: pageHero({
      crumb: "Rolex", parents: [["relojes.html", "Relojes"]], eyebrow: "Distribuidor oficial Rolex", title: "Rolex en Joyería Grau",
      lead: "Somos distribuidor oficial Rolex desde los años 80 y servicio técnico oficial en Barcelona y Lloret de Mar.",
      actions: `<a class="btn" href="cita.html?servicio=relojes">Pedir cita <span class="arrow"></span></a>${official("Rolex", "https://joieriagrau.com/es/rolex/")}`,
      image: { src: "rolex-m.jpg", alt: "Reloj Rolex Oyster Perpetual Datejust", width: 1071, height: 1300 },
    }) + `
    <section class="section section--paper">
      <div class="wrap">
        <div class="split">
          <figure class="split__media split__media--landscape reveal">${img("historia-rolex.jpg", "Rolex en la joyería Grau de Lloret de Mar", 566, 450)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Una larga relación</p>
            <h2 class="h2">Compañeros de viaje desde los años 80</h2>
            <p>En los años 80 conocimos a uno de nuestros grandes compañeros de viaje: Rolex. Nos convertimos en su distribuidor y servicio técnico oficial en Lloret de Mar. En 2011 llegamos a Barcelona, en plena Avenida Diagonal, como punto de venta oficial Rolex y servicio técnico oficial.</p>
            ${officialNote("Rolex")}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">${sectionHead("Boutiques Rolex", "Dónde encontrarnos")}
        <div class="store-cards">
          ${rolexStores.map((t, i) => site.storeCard(t, { delay: i, eyebrow: "Distribuidor oficial Rolex", citaQuery: `tienda=${t.slug}&amp;servicio=relojes`, level: 3 })).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="split split--reverse">
          <figure class="split__media split__media--square reveal">${img("relojero.jpg", "Relojero de Joyería Grau en el taller", 451, 450)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Servicio técnico oficial</p>
            <h2 class="h2">El cuidado que tu Rolex merece</h2>
            <p>Nuestros relojeros revisan y ponen a punto tu reloj en nuestro servicio técnico oficial. Pide cita en Barcelona o Lloret de Mar.</p>
            <div class="split__actions"><a class="btn" href="cita.html?servicio=tecnico">Solicitar servicio técnico <span class="arrow"></span></a></div>
          </div>
        </div>
      </div>
    </section>
` + site.blogCards("relojes-rolex", "Historias de relojería") + ctaBand({ title: "Descubre Rolex en boutique", text: "Pide cita y te atenderemos en nuestras boutiques de Barcelona o Lloret de Mar.", service: "relojes" }),
  });

  site.page("tudor.html", {
    title: "TUDOR en Joyería Grau · Distribuidor oficial",
    description: "Relojes TUDOR en Joyería Grau, distribuidor oficial: Black Bay, Pelagos, 1926 y más modelos con el asesoramiento de nuestro equipo.",
    active: "relojes.html",
    scripts: ["catalogo.js"],
    image: og("tudor.jpg", 800, 1080),
    body: pageHero({
      crumb: "TUDOR", parents: [["relojes.html", "Relojes"]], eyebrow: "Distribuidor oficial TUDOR", title: "TUDOR en Joyería Grau",
      lead: "Relojes con carácter, fiabilidad y diseño, con la garantía y el asesoramiento de un distribuidor oficial.",
      actions: `<a class="btn" href="catalogo.html?marca=tudor">Ver relojes TUDOR <span class="arrow"></span></a>${official("TUDOR", "https://joieriagrau.com/tudor/es/")}`,
      image: { src: "tudor.jpg", alt: "Reloj TUDOR", width: 800, height: 1080 },
    }) + brandGrid("tudor", "TUDOR") + `
    <section class="section section--tight">
      <div class="wrap">${officialNote("TUDOR")}</div>
    </section>
` + ctaBand({ title: "Descubre TUDOR en boutique", text: "Pide cita y te mostraremos los modelos disponibles.", service: "relojes" }),
  });

  site.page("cartier.html", {
    title: "Cartier en Joyería Grau · Distribuidor oficial",
    description: "Relojes y joyas Cartier en Joyería Grau, distribuidor oficial. Descubre la Maison Cartier con el asesoramiento de nuestro equipo.",
    active: "relojes.html",
    image: og("cartier-m.jpg", 1200, 1350),
    body: pageHero({
      crumb: "Cartier", parents: [["relojes.html", "Relojes"]], eyebrow: "Distribuidor oficial Cartier", title: "Cartier en Joyería Grau",
      lead: "Relojes y joyas de la Maison Cartier, con la garantía y el asesoramiento de un distribuidor oficial.",
      actions: `<a class="btn" href="cita.html?servicio=relojes">Pedir cita <span class="arrow"></span></a>${official("Cartier", "https://joieriagrau.com/cartier/es/")}`,
      image: { src: "cartier-m.jpg", alt: "Reloj Santos de Cartier", width: 1200, height: 1350 },
    }) + `
    <section class="section section--paper section--tight">
      <div class="wrap">${officialNote("Cartier")}</div>
    </section>
` + site.blogCards("cartier", "Cartier en el blog") + ctaBand({ title: "Descubre Cartier en boutique", text: "Pide cita y te atenderemos con calma en tu boutique preferida.", service: "relojes" }),
  });

  site.page("chopard.html", {
    title: "Chopard en Joyería Grau",
    description: "Joyas y relojes Chopard en Joyería Grau. Descubre la selección disponible y pide cita para verla en boutique.",
    active: "marcas.html",
    scripts: ["catalogo.js"],
    body: pageHero({
      crumb: "Chopard", parents: [["marcas.html", "Marcas"]], eyebrow: "Chopard", title: "Chopard en Joyería Grau",
      lead: "Joyas y relojes de la Maison Chopard, con el asesoramiento personalizado de nuestro equipo.",
      actions: `<a class="btn" href="catalogo.html?marca=chopard">Ver piezas Chopard <span class="arrow"></span></a>${official("Chopard", "https://joieriagrau.com/chopard/es/")}`,
    }) + brandGrid("chopard", "Chopard") + `
    <section class="section section--tight">
      <div class="wrap">${officialNote("Chopard")}</div>
    </section>
` + ctaBand({ service: "joyas" }),
  });
};
