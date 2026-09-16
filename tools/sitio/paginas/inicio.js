// Página de inicio: capítulos a pantalla completa, colecciones en horizontal, relojería, taller, blog y boutiques.
const C = require("../lib/config");
const { esc, img, srcset, responsive, schemaTiendas, whatsapp } = require("../lib/plantilla");

const ext = ' target="_blank" rel="noopener"';
const CATS = "(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 16vw";

module.exports = function (site) {
  const brands = ["Rolex", "Tudor", "Cartier", "Omega", "TAG Heuer", "Messika", "Pomellato", "Damiani", "Dinh Van", "Roberto Coin", "Chopard", "Grau"].map((b) => `<span class="marquee__item">${b}</span>`).join("");
  const slides = [
    ["hero-1.jpg", "Anillos de oro con nácar y diamantes", "Anillos con nácar", "joyas.html#halo"],
    ["hero-2.jpg", "Anillo solitario de diamantes en la mano", "Anillos de compromiso", "compromiso.html#anillos"],
    ["hero-3.jpg", "Estuche de regalo Grau con lazo verde", "El estuche Grau", "compromiso.html#estuche"],
  ];
  const n = String(C.tiendas.length).padStart(2, "0");

  /* Capítulos a pantalla completa que se deslizan sobre el anterior */
  const chapter = ({ id, header, mobile, tone = "", top = false, eyebrow, title, lead, actions, desktop, alt }) => `
    <section class="chapter chapter--full${tone ? " chapter--" + tone : ""}${top ? " chapter--top-m" : ""}" id="${id}" data-chapter data-header="${header}" aria-labelledby="${id}-titulo">
      <div class="chapter__media">
        <picture>
          <source media="(max-width: 900px)" srcset="${srcset(mobile[0], mobile[1]) || "assets/img/" + mobile[0]}" sizes="100vw" width="${mobile[1]}" height="${mobile[2]}">
          ${img(desktop[0], alt, desktop[1], desktop[2], "", "100vw")}
        </picture>
      </div>
      <div class="wrap chapter__body">
        <p class="eyebrow eyebrow--plain">${eyebrow}</p>
        <h2 class="chapter__title" id="${id}-titulo" data-split>${title}</h2>
        <p class="chapter__lead">${lead}</p>
        <div class="chapter__actions">${actions}</div>
      </div>
    </section>`;

  const chapters = [
    ["portada", "Grau"],
    ["capitulo-rolex", "Rolex"],
    ["capitulo-cartier", "Cartier"],
    ["capitulo-compromiso", "Compromiso"],
  ];

  const collections = [
    ["aura", "Aura", "Colección insignia · desde 1994", "Lleva un pedacito de cosmos contigo: oro y diamantes que perduran con la misma esencia.", "joyas-hero.jpg", 1200, 1500, "Anillo de oro amarillo con diamantes de la colección Aura"],
    ["halo", "Halo", "Colección Grau", "Un halo de diamantes inspirado en los ángeles, con nácar, ónix y oro.", "hero-1.jpg", 1200, 1500, "Anillos de oro con nácar y diamantes de la colección Halo"],
    ["good-mood", "Good Mood", "Colección Grau", "Grandes gemas preciosas: ese toque de color que te pone de buen humor.", "pendientes.jpg", 960, 1280, "Pendientes de oro con gema de la colección Good Mood"],
    ["my-essence", "My Essence", "Colección Grau", "Joyas de oro para mujer y hombre con las que lucir tu esencia, cada día.", "oro-pepitas.jpg", 1024, 1024, "Pepitas de oro de la colección My Essence"],
  ];

  const watches = [
    ["rolex.html", "Rolex", "Distribuidor oficial", "rolex-m.jpg", 1071, 1300, "Reloj Rolex Oyster Perpetual Datejust"],
    ["tudor.html", "Tudor", "Distribuidor oficial", "tudor.jpg", 800, 1080, "Reloj TUDOR Black Bay con esfera turquesa"],
    ["cartier.html", "Cartier", "Distribuidor oficial", "cartier-m.jpg", 1200, 1350, "Reloj Santos de Cartier"],
    ["pre-owned.html", "Grau Pre-owned", "Relojes certificados", "preowned-hero.jpg", 1600, 1067, "Reloj pre-owned con tarjeta de certificado Grau"],
    ["relojes.html", "Toda la relojería", "Todas las firmas", "relojes.jpg", 960, 1280, "Reloj de caballero con gemelos"],
  ];

  site.page("index.html", {
    title: "Joyería Grau · Alta joyería y relojería en Barcelona y Girona",
    description: "Joyería y Relojería Grau. Distribuidor oficial de Rolex, Tudor y Cartier. Alta joyería, anillos de compromiso y alianzas en Barcelona, Sabadell, Lloret de Mar y Blanes.",
    active: "index.html",
    overlay: true,
    intro: true,
    schema: [schemaTiendas()],
    body: `
    <div class="chapters" data-chapters>
      <section class="chapter chapter--main" id="portada" data-chapter data-header="dark" data-header-mobile="light" aria-labelledby="hero-title">
        <div class="chapter__text">
          <div class="chapter__inner">
            <p class="eyebrow hero__in" style="--d:.05s">Joyería y Relojería Grau</p>
            <h1 class="display hero__title" id="hero-title">
              <span class="hero__line"><span style="--d:.15s">Alta joyería</span></span>
              <span class="hero__line"><span style="--d:.27s">en Barcelona</span></span>
              <span class="hero__line"><span style="--d:.39s">y Girona.</span></span>
            </h1>
            <p class="lead hero__in" style="--d:.6s">Distribuidores oficiales de las grandes maisons de relojería y joyería, con el asesoramiento cercano de siempre en cada una de nuestras boutiques.</p>
            <div class="hero__actions hero__in" style="--d:.72s">
              <a class="btn" href="joyas.html">Descubrir colecciones <span class="arrow"></span></a>
              <a class="btn btn--ghost" href="cita.html">Pedir cita</a>
            </div>
            <ul class="hero__facts hero__in" style="--d:.86s">
              <li><b>1947</b><span>Joyeros desde</span></li>
              <li><b>Rolex</b><span>Distribuidor oficial</span></li>
              <li><b>${C.tiendas.length}</b><span>Boutiques</span></li>
            </ul>
          </div>
        </div>

        <div class="chapter__visual">
          <figure class="hero__frame" data-hero-slides aria-roledescription="carrusel" aria-label="Selección Grau">
            ${slides.map(([src, alt], i) => `<img class="hero__slide${i ? "" : " is-active"}" src="assets/img/${src}"${responsive(src, 1200, "(max-width: 900px) 100vw, 50vw")} alt="${alt}" width="1200" height="1500"${i ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}>`).join("\n            ")}
            <figcaption class="hero__caption">
              <span class="hero__count"><b data-hero-index>01</b> / ${String(slides.length).padStart(2, "0")}</span>
              <a class="hero__label" data-hero-label href="${slides[0][3]}">${slides[0][2]}</a>
              <span class="hero__dots" role="group" aria-label="Elegir imagen">
                ${slides.map(([, , label, href], i) => `<button type="button"${i ? "" : ' class="is-active"'} aria-label="Imagen ${i + 1}: ${label}" aria-pressed="${!i}" data-label="${label}" data-href="${href}"><i></i></button>`).join("\n                ")}
              </span>
            </figcaption>
          </figure>

          <div class="hero__stores" data-hero-stores role="group" aria-label="Nuestras boutiques">
            ${C.tiendas.map((t, i) => `<a class="hero__inset${i ? "" : " is-active"}" href="${t.mapa}"${ext}${i ? ' tabindex="-1" aria-hidden="true"' : ""}>
              <img src="assets/img/${t.miniatura}" alt="" width="320" height="320" decoding="async">
              <span class="hero__inset-text"><small>Boutique <b>${String(i + 1).padStart(2, "0")}</b> / ${n}</small>${t.nombre}<em>Cómo llegar</em></span>
            </a>`).join("\n            ")}
          </div>
        </div>
        <a class="hero__scroll" href="#capitulo-rolex" data-chapter-link="1"><span class="hero__scroll-line" aria-hidden="true"></span>Descubrir</a>
      </section>
${chapter({
  id: "capitulo-rolex", header: "light", tone: "dark",
  eyebrow: "Distribuidor oficial Rolex", title: "Rolex",
  lead: "Distribuidor oficial Rolex desde los años 80 y servicio técnico oficial en Barcelona y Lloret de Mar.",
  actions: `<a class="btn btn--light" href="rolex.html">Descubrir Rolex <span class="arrow"></span></a><a class="link-line" href="cita.html?servicio=relojes">Pedir cita</a>`,
  desktop: ["rolex.jpg", 1880, 1000], mobile: ["rolex-m.jpg", 1071, 1300], alt: "Reloj Rolex Oyster Perpetual Datejust sobre el agua",
})}
${chapter({
  id: "capitulo-cartier", header: "light", tone: "dark", top: true,
  eyebrow: "Distribuidor oficial Cartier", title: "Cartier",
  lead: "Relojes y joyas de la Maison Cartier, con la garantía y el asesoramiento de un distribuidor oficial.",
  actions: `<a class="btn btn--light" href="cartier.html">Descubrir Cartier <span class="arrow"></span></a><a class="link-line" href="cita.html?servicio=relojes">Pedir cita</a>`,
  desktop: ["cartier-wide.jpg", 2000, 1090], mobile: ["cartier-m.jpg", 1200, 1350], alt: "Reloj Santos de Cartier y una pantera sobre un biplano",
})}
${chapter({
  id: "capitulo-compromiso", header: "dark", tone: "light", top: true,
  eyebrow: "Compromiso", title: "El amor está en el aire, no lo dejes escapar.",
  lead: "Anillos de compromiso y alianzas creados para acompañaros toda la vida. Os asesoramos en boutique, con calma y sin prisas.",
  actions: `<a class="btn" href="compromiso.html#anillos">Anillos de compromiso <span class="arrow"></span></a><a class="link-line" href="compromiso.html#alianzas">Alianzas de boda</a>`,
  desktop: ["alianzas.jpg", 2000, 1075], mobile: ["comp-alianzas.jpg", 1080, 1350], alt: "Alianzas de boda de oro Grau sobre seda",
})}
      <div class="chapters__rail">
        <nav class="chapters__nav" aria-label="Capítulos de la portada" data-chapters-nav>
          ${chapters.map(([id, label], i) => `<a href="#${id}" data-chapter-link="${i}"${i ? "" : ' aria-current="true"'}><span class="chapters__label">${label}</span><i aria-hidden="true"></i></a>`).join("\n          ")}
        </nav>
      </div>
    </div>

    <section class="section manifesto" aria-labelledby="manifiesto-title">
      <div class="wrap manifesto__wrap">
        <p class="eyebrow eyebrow--center reveal">Desde 1947</p>
        <h2 class="manifesto__text" id="manifiesto-title" data-split>Ofrecemos mucho más que una joya o un reloj: una pieza única y eterna, con el trato humano, honesto y cercano que nos define.</h2>
        <ul class="manifesto__facts">
          <li class="reveal"><b>Distribuidor oficial</b><span>Rolex, Tudor y Cartier</span></li>
          <li class="reveal" data-delay="1"><b>Servicio técnico oficial</b><span>Barcelona y Lloret de Mar</span></li>
          <li class="reveal" data-delay="2"><b>Taller propio</b><span>Joyas hechas a mano</span></li>
        </ul>
        <a class="link-line reveal" href="historia.html">Nuestra historia</a>
      </div>
    </section>

    <section class="marquee" id="marcas" aria-label="Marcas disponibles en Grau">
      <div class="marquee__track">
        <div class="marquee__group">${brands}</div>
        <div class="marquee__group" aria-hidden="true">${brands}</div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section__head">
          <div class="reveal">
            <p class="eyebrow">Encuentra tu joya</p>
            <h2 class="h2" data-split>Piezas para cada momento</h2>
          </div>
          <a class="link-line reveal" href="joyas.html">Ver todas las joyas</a>
        </div>
        <div class="cats">
          <a class="cat reveal" href="catalogo.html?seccion=joyas&amp;cat=anillos"><div class="cat__img">${img("anillos.jpg", "Anillo de oro amarillo con diamantes", 960, 1280, "", CATS)}</div><div class="cat__label">Anillos <small>01</small></div></a>
          <a class="cat reveal" data-delay="1" href="catalogo.html?seccion=joyas&amp;cat=collares"><div class="cat__img">${img("collares.jpg", "Cadena de oro amarillo", 960, 1280, "", CATS)}</div><div class="cat__label">Collares <small>02</small></div></a>
          <a class="cat reveal" data-delay="2" href="catalogo.html?seccion=joyas&amp;cat=pendientes"><div class="cat__img">${img("pendientes.jpg", "Pendientes de oro amarillo con piedra central", 960, 1280, "", CATS)}</div><div class="cat__label">Pendientes <small>03</small></div></a>
          <a class="cat reveal" data-delay="3" href="catalogo.html?seccion=joyas&amp;cat=pulseras"><div class="cat__img cat__img--packshot">${img("pulseras.jpg", "Pulsera esclava Grau de oro rosa con pavé de diamantes", 960, 1280, "", CATS)}</div><div class="cat__label">Pulseras <small>04</small></div></a>
          <a class="cat reveal" data-delay="1" href="relojes.html"><div class="cat__img">${img("relojes.jpg", "Reloj de caballero con gemelos", 960, 1280, "", CATS)}</div><div class="cat__label">Relojes <small>05</small></div></a>
          <a class="cat reveal" data-delay="2" href="catalogo.html?seccion=accesorios"><div class="cat__img">${img("accesorios.jpg", "Tarjetero de piel y pluma Montblanc", 960, 1280, "", CATS)}</div><div class="cat__label">Accesorios <small>06</small></div></a>
        </div>
      </div>
    </section>

    <section class="hscroll" data-hscroll aria-labelledby="colecciones-title">
      <div class="hscroll__sticky">
        <div class="hscroll__track" data-hscroll-track>
          <div class="hscroll__intro">
            <p class="eyebrow">Diseñadas en Grau</p>
            <h2 class="h2" id="colecciones-title" data-split>Nuestras colecciones</h2>
            <p>Joyas creadas en nuestro taller, con la misma esencia desde 1947.</p>
            <p class="hscroll__hint" aria-hidden="true"><span></span>Descubre las colecciones</p>
          </div>
          <div class="hscroll__cards" data-hscroll-cards>
            ${collections.map(([key, name, meta, text, src, w, h, alt], i) => `<a class="coll reveal" href="catalogo.html?seccion=joyas&amp;coleccion=${key}">
              <span class="coll__img">${img(src, alt, w, h, "", "(max-width: 900px) 78vw, 30vw")}</span>
              <span class="coll__top"><span class="coll__num">${String(i + 1).padStart(2, "0")}</span><span class="coll__meta">${meta}</span></span>
              <h3 class="coll__name">${name}</h3>
              <span class="coll__text">${text}</span>
            </a>`).join("\n            ")}
            <a class="coll coll--end reveal" href="joyas.html#colecciones"><span class="coll__end"><span class="eyebrow eyebrow--plain">Joyería Grau</span><span class="coll__end-title">Descubrir todas las colecciones</span><span class="arrow" aria-hidden="true"></span></span></a>
          </div>
        </div>
        <div class="hscroll__bar" aria-hidden="true"><span data-hscroll-bar></span></div>
      </div>
    </section>

    <section class="section watches" aria-labelledby="relojeria-title">
      <div class="wrap watches__grid">
        <figure class="watches__media reveal-media" data-swap-media>
          ${watches.map(([, name, meta, src, w, h, alt], i) => img(src, alt, w, h, ` data-swap="${i}"${i ? "" : ' class="is-active"'}`, "(max-width: 900px) 100vw, 46vw")).join("\n          ")}
          <figcaption class="watches__caption"><span data-swap-caption>${watches[0][1]} · ${watches[0][2]}</span></figcaption>
        </figure>
        <div class="watches__body">
          <div class="reveal">
            <p class="eyebrow">Relojería</p>
            <h2 class="h2" id="relojeria-title" data-split>Las grandes firmas de la relojería</h2>
            <p class="watches__lead">Distribuidor oficial Rolex, Tudor y Cartier, con servicio técnico oficial en Barcelona y Lloret de Mar y una selección de las firmas suizas más prestigiosas.</p>
          </div>
          <ul class="watch-list" data-swap-list>
            ${watches.map(([href, name, meta], i) => `<li class="reveal"${i ? ` data-delay="${Math.min(i, 3)}"` : ""}><a href="${href}" data-swap-to="${i}" data-caption="${esc(name + " · " + meta)}"><span class="watch-list__num">${String(i + 1).padStart(2, "0")}</span><span class="watch-list__name">${name}</span><span class="watch-list__meta">${meta}</span></a></li>`).join("\n            ")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section atelier" aria-labelledby="taller-title">
      <div class="wrap atelier__grid">
        <figure class="atelier__media reveal-media">${img("comp-taller.jpg", "Joyero de Grau engastando un diamante en el taller", 1080, 1350, " data-parallax", "(max-width: 900px) 100vw, 45vw")}</figure>
        <div class="atelier__body">
          <div class="reveal">
            <p class="eyebrow">Nuestro taller</p>
            <h2 class="h2" id="taller-title" data-split>Hechas a mano en nuestro taller</h2>
            <p class="lead">En nuestro taller propio trabajamos de forma artesanal, ética y sostenible, fusionando lo mejor de la tradición y de la innovación. Cuéntanos tu idea y la convertiremos en una joya única.</p>
          </div>
          <ol class="atelier__list">
            <li class="reveal"><b>Oro de 18 k y platino</b><span>Aleaciones propias, fundidas, forjadas y pulidas a mano.</span></li>
            <li class="reveal" data-delay="1"><b>Diamantes éticos</b><span>Adquiridos en origen, desde la calidad G-VS2.</span></li>
            <li class="reveal" data-delay="2"><b>Servicio técnico oficial</b><span>Nuestros relojeros cuidan tu Rolex en Barcelona y Lloret de Mar.</span></li>
          </ol>
          <div class="split__actions reveal">
            <a class="btn btn--light" href="cita.html?servicio=personalizadas">Diseñar mi joya <span class="arrow"></span></a>
            <a class="link-line" href="historia.html">Nuestra historia</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section__head">
          <div class="reveal">
            <p class="eyebrow">El blog de Grau</p>
            <h2 class="h2" data-split>Historias que brillan</h2>
          </div>
          <a class="link-line reveal" href="blog.html">Ir al blog</a>
        </div>
        <div class="journal">
          ${[
            ["ana-belen-luce-joyas-grau-en-sesion-fotografica-la-vanguardia", "blog-anabelen.jpg", "Ana Belén con joyas de Grau", "Prensa", "Ana Belén luce joyas de Grau para su entrevista en La Vanguardia", "Una sesión luminosa donde la elegancia cobra todo el protagonismo."],
            ["cartier-santos-diamantes-relojes-lujo", "blog-cartier.jpg", "Cartier Santos con diamantes", "Relojería", "Cartier Santos con diamantes: una combinación perfecta", "Cómo el Santos con diamantes reinventa un clásico con carácter atemporal."],
            ["joyeria-grau-premios-goya-2026", "blog-goya.jpg", "Joyas de Grau en los Premios Goya 2026", "Alfombra roja", "Grau en los Premios Goya 2026", "Piezas que fusionan sofisticación, carácter y luz propia sobre la alfombra roja."],
          ].map(([slug, src, alt, tag, title, text], i) => `<a class="post reveal"${i ? ` data-delay="${i}"` : ""} href="blog/${slug}.html">
            <div class="post__img">${img(src, alt, 1024, 683, "", "(max-width: 900px) 100vw, 33vw")}</div>
            <p class="post__tag">${tag}</p>
            <h3 class="h3">${title}</h3>
            <p>${text}</p>
            <span class="link-line">Leer</span>
          </a>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section nl-band" id="newsletter">
      <div class="wrap nl-band__grid">
        <div class="reveal">
          <p class="eyebrow">La Carta de Grau</p>
          <h2 class="h2" data-split>Lo nuevo, antes que nadie.</h2>
          <p>Nuevas colecciones, presentaciones en boutique y consejos de nuestros joyeros, directamente en tu correo.</p>
        </div>
        <div class="nl-box reveal" data-delay="1">
          ${site.newsletterForm({ id: "home", dark: true, source: "inicio", consentText: "y quiero recibir comunicaciones de Joieria Grau" })}
          <div class="nl-success" role="status" tabindex="-1">
            <h3 class="h3">Gracias por suscribirte.</h3>
            <p>Hemos recibido tu solicitud. Pronto empezarás a recibir La Carta de Grau.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--sand" id="tiendas">
      <div class="wrap stores">
        <div class="stores__img reveal-media">${img("tienda-m.jpg", "Boutique Grau en Barcelona", 1004, 1004, " data-parallax")}</div>
        <div>
          <p class="eyebrow reveal">Nuestras joyerías</p>
          <h2 class="h2" data-split>Visítanos en boutique</h2>
          <p class="lead reveal" data-delay="2">Visita tu joyería preferida y recibe asesoramiento personalizado.</p>
          <a class="link-line reveal" data-delay="2" href="tiendas.html">Direcciones y horarios</a>
          <ul class="store-list">
            ${C.tiendas.map((t, i) => `<li class="reveal"><a href="${t.mapa}"${ext}><span class="num">${String(i + 1).padStart(2, "0")}</span><span class="name">${t.nombre}</span><span class="go">Cómo llegar</span></a></li>`).join("\n            ")}
          </ul>
          <div class="contact-grid reveal">
            <a href="cita.html"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>Cita previa</a>
            <a href="${whatsapp()}"${ext}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4A8 8 0 1 1 8 19z"/></svg>WhatsApp</a>
            <a href="tel:${C.telefono.href}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg>Llámanos</a>
            <a href="mailto:${C.email}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13"/><path d="M3 6l9 7 9-7"/></svg>Escríbenos</a>
          </div>
        </div>
      </div>
    </section>
`,
  });
};
