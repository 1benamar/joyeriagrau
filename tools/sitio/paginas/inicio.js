// Página de inicio.
const C = require("../lib/config");
const { img, srcset, responsive, schemaTiendas, whatsapp } = require("../lib/plantilla");

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

  site.page("index.html", {
    title: "Joyería Grau · Alta joyería y relojería en Barcelona y Girona",
    description: "Joyería y Relojería Grau. Distribuidor oficial de Rolex, Tudor y Cartier. Alta joyería, anillos de compromiso y alianzas en Barcelona, Sabadell, Lloret de Mar y Blanes.",
    active: "index.html",
    schema: [schemaTiendas()],
    body: `
    <section class="hero" aria-labelledby="hero-title">
      <div class="wrap hero__grid">
        <div class="hero__content">
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

        <div class="hero__visual">
          <figure class="hero__frame" data-hero-slides aria-roledescription="carrusel" aria-label="Selección Grau">
            ${slides.map(([src, alt], i) => `<img class="hero__slide${i ? "" : " is-active"}" src="assets/img/${src}"${responsive(src, 1200, "(max-width: 900px) 100vw, 45vw")} alt="${alt}" width="1200" height="1500"${i ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}>`).join("\n            ")}
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
      </div>
      <a class="hero__scroll" href="#marcas" aria-label="Ir a la siguiente sección"><span></span></a>
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
            <h2 class="h2">Piezas para cada momento</h2>
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

    <section class="section section--paper" id="relojeria">
      <div class="wrap">
        <div class="section__head">
          <div class="reveal">
            <p class="eyebrow">Relojería</p>
            <h2 class="h2">Distribuidores oficiales</h2>
          </div>
          <a class="link-line reveal" href="relojes.html">Ver toda la relojería</a>
        </div>
        <div class="duo">
          <a class="feature feature--rolex reveal" href="rolex.html">
            <picture><source media="(max-width: 900px)" srcset="${srcset("rolex-m.jpg", 1071)}" sizes="100vw" width="1071" height="1300">${img("rolex.jpg", "Reloj Rolex Oyster Perpetual Datejust", 1880, 1000, "", "58vw")}</picture>
            <div class="feature__body">
              <p class="eyebrow eyebrow--plain">Distribuidor oficial</p>
              <h3 class="h3">Rolex</h3>
              <span class="link-line">Descubrir</span>
            </div>
          </a>
          <a class="feature feature--cartier reveal" data-delay="1" href="cartier.html">
            <picture><source media="(max-width: 560px)" srcset="${srcset("cartier-m.jpg", 1200)}" sizes="100vw" width="1200" height="1350">${img("cartier.jpg", "Reloj Santos de Cartier", 2000, 1600, "", "(max-width: 900px) 100vw, 42vw")}</picture>
            <div class="feature__body">
              <p class="eyebrow eyebrow--plain">Maison Cartier</p>
              <h3 class="h3">Santos de Cartier</h3>
              <span class="link-line">Descubrir Cartier</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="promise">
      ${img("alianzas.jpg", "Alianzas de boda de oro Grau", 2000, 1075, " data-parallax", "(max-width: 900px) 100vw, 60vw")}
      <div class="wrap">
        <div class="promise__body">
          <p class="eyebrow reveal">Compromiso</p>
          <h2 class="h2 reveal" data-delay="1">El amor está en el aire, no lo dejes escapar.</h2>
          <p class="lead reveal" data-delay="2">Anillos de compromiso y alianzas creados para acompañaros toda la vida. Os asesoramos en boutique, con calma y sin prisas.</p>
          <div class="promise__links reveal" data-delay="3">
            <a class="btn" href="compromiso.html#anillos">Anillos de compromiso <span class="arrow"></span></a>
            <a class="link-line" href="compromiso.html#alianzas">Alianzas de boda</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section__head">
          <div class="reveal">
            <p class="eyebrow">El blog de Grau</p>
            <h2 class="h2">Historias que brillan</h2>
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
          <h2 class="h2">Lo nuevo, antes que nadie.</h2>
          <p>Nuevas colecciones, presentaciones en boutique y consejos de nuestros joyeros, directamente en tu correo.</p>
          <a class="link-line nl-band__more" href="newsletter.html">Saber más sobre La Carta</a>
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
        <div class="stores__img reveal">${img("tienda-m.jpg", "Boutique Grau en Barcelona", 1004, 1004)}</div>
        <div>
          <p class="eyebrow reveal">Nuestras joyerías</p>
          <h2 class="h2 reveal" data-delay="1">Visítanos en boutique</h2>
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
