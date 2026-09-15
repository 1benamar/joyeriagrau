// Páginas de sección: joyas, relojes, compromiso, marcas, pre-owned, tiendas, cita e historia.
const C = require("../lib/config");
const { img, pageHero, ctaBand, sectionHead, whatsapp, schemaTiendas } = require("../lib/plantilla");

const ext = ' target="_blank" rel="noopener"';
const CATS = "(max-width: 1100px) 50vw, 25vw";
const TRIO = "(max-width: 900px) 100vw, 33vw";
const og = (src, width, height) => ({ src: "assets/img/" + src, width, height });
const icon = {
  cita: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4A8 8 0 1 1 8 19z"/></svg>',
  telefono: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13"/><path d="M3 6l9 7 9-7"/></svg>',
  tienda: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
};
const contactGrid = (extraClass = "") => `<div class="contact-grid${extraClass} reveal">
            <a href="cita.html">${icon.cita}Cita previa</a>
            <a href="${whatsapp()}"${ext}>${icon.whatsapp}WhatsApp</a>
            <a href="tel:${C.telefono.href}">${icon.telefono}Llámanos</a>
            <a href="mailto:${C.email}">${icon.email}Escríbenos</a>
          </div>`;

module.exports = function (site) {
  /* ------------------------------------------------------------------ */
  /* JOYAS                                                               */
  /* ------------------------------------------------------------------ */
  const collection = ({ id, name, text, image, iw, ih, href, products = [], reverse = false, eyebrow = "Colección Grau" }) => `
        <article class="split${reverse ? " split--reverse" : ""}" id="${id}">
          <figure class="split__media reveal">${img(image, "Colección " + name + " de Joyería Grau", iw, ih)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">${eyebrow}</p>
            <h3 class="h2">${name}</h3>
            <p>${text}</p>
            ${products.length ? `<div class="mini-products">
              ${products.map(([src, label, w]) => `<a class="mini-product" href="${href}"><div class="mini-product__img">${img(src, label, w, w)}</div><span>${label}</span></a>`).join("\n              ")}
            </div>` : ""}
            <div class="split__actions"><a class="btn btn--ghost" href="${href}">Ver colección <span class="arrow"></span></a></div>
          </div>
        </article>`;

  site.page("joyas.html", {
    title: "Joyas · Joyería Grau",
    description: "Colección de joyas de Joyería Grau: anillos, pendientes, collares y pulseras de oro y diamantes, colecciones propias Aura, Halo, Good Mood y My Essence, y las mejores firmas internacionales.",
    active: "joyas.html",
    image: og("newsletter-hero.jpg", 1600, 2000),
    body: pageHero({
      crumb: "Joyas", eyebrow: "Colección de joyas", title: "Luce tu verdadera esencia",
      lead: "Piezas de oro y diamantes creadas en nuestro taller propio y una selección de las firmas de joyería más prestigiosas del mundo.",
      actions: `<a class="btn" href="#tipo">Encuentra tu joya <span class="arrow"></span></a><a class="btn btn--ghost" href="catalogo.html?seccion=joyas">Ver todo el catálogo</a>`,
      image: { src: "newsletter-hero.jpg", alt: "Cadena de oro amarillo de Joyería Grau", width: 1600, height: 2000 },
    }) + `
    <section class="section" id="tipo">
      <div class="wrap">${sectionHead("Por tipo de joya", "Encuentra tu joya", `<a class="link-line reveal" href="catalogo.html?seccion=joyas">Ver todas las joyas</a>`)}
        <div class="cats cats--4">
          <a class="cat reveal" href="catalogo.html?seccion=joyas&amp;cat=anillos"><div class="cat__img">${img("anillos.jpg", "Anillo de oro amarillo con diamantes", 960, 1280, "", CATS)}</div><div class="cat__label">Anillos <small>01</small></div></a>
          <a class="cat reveal" data-delay="1" href="catalogo.html?seccion=joyas&amp;cat=pendientes"><div class="cat__img">${img("pendientes.jpg", "Pendientes de oro amarillo con piedra central", 960, 1280, "", CATS)}</div><div class="cat__label">Pendientes <small>02</small></div></a>
          <a class="cat reveal" data-delay="2" href="catalogo.html?seccion=joyas&amp;cat=collares"><div class="cat__img">${img("collares.jpg", "Cadena de oro amarillo", 960, 1280, "", CATS)}</div><div class="cat__label">Collares <small>03</small></div></a>
          <a class="cat reveal" data-delay="3" href="catalogo.html?seccion=joyas&amp;cat=pulseras"><div class="cat__img cat__img--packshot">${img("pulseras.jpg", "Pulsera esclava Grau de oro rosa con pavé de diamantes", 960, 1280, "", CATS)}</div><div class="cat__label">Pulseras <small>04</small></div></a>
        </div>
      </div>
    </section>

    <section class="section section--paper" id="colecciones">
      <div class="wrap">${sectionHead("Diseñadas en Grau", "Nuestras colecciones", `<p class="reveal">Joyas creadas en nuestro taller, con la misma esencia desde 1947.</p>`)}
${collection({ id: "aura", name: "Aura", eyebrow: "Colección insignia · desde 1994", text: "Lleva un pedacito de cosmos contigo con la colección insignia de Joyería Grau: piezas de oro y diamantes que perduran desde 1994 con la misma esencia.", image: "joyas-hero.jpg", iw: 1200, ih: 1500, href: "catalogo.html?seccion=joyas&amp;coleccion=aura", products: [["prod-aura-pendientes.jpg", "Pendientes oro rosa Aura", 600], ["prod-aura-collar-doble.jpg", "Collar diamantes doble Aura", 800], ["prod-aura-collar.jpg", "Collar oro rosa Aura", 800]] })}
${collection({ id: "halo", name: "Halo", reverse: true, text: "Pendientes de ónix, pulseras de diamantes, collares de oro y anillos con un halo de diamantes inspirado en los ángeles.", image: "hero-1.jpg", iw: 1200, ih: 1500, href: "catalogo.html?seccion=joyas&amp;coleccion=halo", products: [["prod-halo-anillo.jpg", "Anillo Halo Grand madreperla", 800], ["prod-halo-collar.jpg", "Collar Halo Grand nácar", 600], ["prod-halo-sello.jpg", "Anillo sello Halo Grand ónix", 600]] })}
${collection({ id: "good-mood", name: "Good Mood", text: "Anillos, collares y pendientes con grandes gemas preciosas: ese toque de color que te pone de buen humor.", image: "pendientes.jpg", iw: 960, ih: 1280, href: "catalogo.html?seccion=joyas&amp;coleccion=good-mood", products: [["prod-goodmood-pendientes.jpg", "Pendientes largos oro rosa Good Mood", 800], ["prod-goodmood-collar.jpg", "Collar oro rosa con amatista y rodolita", 800], ["prod-goodmood-anillo.jpg", "Anillo oro rosa con topacios y amatista", 800]] })}
${collection({ id: "my-essence", name: "My Essence", reverse: true, text: "Joyas de oro para mujer y hombre con las que lucir tu verdadera esencia, cada día.", image: "oro-pepitas.jpg", iw: 1024, ih: 1024, href: "catalogo.html?seccion=joyas&amp;coleccion=my-essence" })}
      </div>
    </section>

    <section class="section">
      <div class="wrap">${sectionHead("Para cada ocasión", "Momentos especiales")}
        <div class="link-grid reveal">
          <a href="catalogo.html?seccion=joyas&amp;lista=mas-vendidos"><span><small>Descubrir</small>Los más vendidos</span></a>
          <a href="catalogo.html?seccion=joyas&amp;ocasion=comunion"><span><small>Celebraciones</small>Joyas para comunión</span></a>
          <a href="catalogo.html?seccion=joyas&amp;cat=charms"><span><small>Descubrir</small>Charms</span></a>
          <a href="compromiso.html"><span><small>Compromiso</small>Anillos y alianzas</span></a>
          <a href="catalogo.html?seccion=joyas&amp;para=mujer"><span><small>Para</small>Mujer</span></a>
          <a href="catalogo.html?seccion=joyas&amp;para=hombre"><span><small>Para</small>Hombre</span></a>
          <a href="catalogo.html?seccion=joyas&amp;para=bebe"><span><small>Para</small>Bebé</span></a>
          <a href="catalogo.html?seccion=joyas&amp;para=infantil"><span><small>Para</small>Infantiles</span></a>
        </div>
      </div>
    </section>

    <section class="section section--paper">
      <div class="wrap">${sectionHead("Firmas de joyería", "Las mejores firmas internacionales", `<a class="link-line reveal" href="marcas.html#joyeria">Ver todas las marcas</a>`)}
        <div class="brand-grid reveal">
          ${site.brandTiles([["Grau", "grau", "Colección propia"], ["Messika", "messika"], ["Pomellato", "pomellato"], ["Damiani", "damiani"], ["Dinh Van", "dinh-van"], ["Roberto Coin", "roberto-coin"], ["Chopard", "chopard.html"], ["Ole Lynggaard", "ole-lynggaard"]], "Joyería")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="split">
          <figure class="split__media reveal">${img("comp-taller.jpg", "Joyero de Grau engastando un diamante en el taller", 1080, 1350)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Joyas personalizadas</p>
            <h2 class="h2">Hechas a mano en nuestro taller</h2>
            <p>En nuestro taller propio trabajamos de forma artesanal, ética y sostenible, fusionando lo mejor de la tradición y de la innovación. Cuéntanos tu idea y la convertiremos en una joya única.</p>
            <div class="split__actions"><a class="btn" href="cita.html?servicio=personalizadas">Diseñar mi joya <span class="arrow"></span></a><a class="link-line" href="historia.html">Nuestra historia</a></div>
          </div>
        </div>
      </div>
    </section>
` + ctaBand(),
  });

  /* ------------------------------------------------------------------ */
  /* RELOJES                                                             */
  /* ------------------------------------------------------------------ */
  site.page("relojes.html", {
    title: "Relojes · Joyería Grau",
    description: "Relojes para hombre y mujer en Joyería Grau: distribuidor oficial Rolex, Tudor y Cartier, servicio técnico oficial y firmas como Omega, TAG Heuer, Longines o Tissot.",
    active: "relojes.html",
    image: og("relojes.jpg", 960, 1280),
    body: pageHero({
      crumb: "Relojes", eyebrow: "Relojería", title: "Relojes para hombre y mujer",
      lead: "Encuentra el reloj perfecto entre las firmas internacionales más prestigiosas, con la garantía de un distribuidor oficial y nuestro propio servicio técnico.",
      actions: `<a class="btn" href="#oficial">Distribuidor oficial <span class="arrow"></span></a><a class="btn btn--ghost" href="catalogo.html?seccion=relojes">Ver todos los relojes</a>`,
      image: { src: "relojes.jpg", alt: "Reloj de caballero con gemelos", width: 960, height: 1280 },
    }) + `
    <section class="section section--paper" id="oficial">
      <div class="wrap">${sectionHead("Distribuidor oficial", "Rolex, Tudor y Cartier", `<p class="reveal">Somos distribuidor oficial Rolex desde los años 80 y contamos con servicio técnico oficial en Barcelona y Lloret de Mar.</p>`)}
        <div class="trio">
          <a class="feature reveal" href="rolex.html">
            ${img("rolex-m.jpg", "Reloj Rolex Oyster Perpetual Datejust", 1071, 1300, "", TRIO)}
            <div class="feature__body"><p class="eyebrow eyebrow--plain">Distribuidor oficial</p><h3 class="h3">Rolex</h3><span class="link-line">Descubrir</span></div>
          </a>
          <a class="feature reveal" data-delay="1" href="tudor.html">
            ${img("tudor.jpg", "Reloj Tudor", 800, 1080)}
            <div class="feature__body"><p class="eyebrow eyebrow--plain">Distribuidor oficial</p><h3 class="h3">Tudor</h3><span class="link-line">Descubrir</span></div>
          </a>
          <a class="feature feature--bottom reveal" data-delay="2" href="cartier.html">
            ${img("cartier-m.jpg", "Reloj Santos de Cartier", 1200, 1350, "", TRIO)}
            <div class="feature__body"><p class="eyebrow eyebrow--plain">Distribuidor oficial</p><h3 class="h3">Cartier</h3><span class="link-line">Descubrir</span></div>
          </a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">${sectionHead("Más firmas", "Relojería suiza e internacional", `<a class="link-line reveal" href="marcas.html#relojeria">Ver todas las marcas</a>`)}
        <div class="brand-grid reveal">
          ${site.brandTiles([["TAG Heuer", "tag-heuer"], ["Omega", "omega"], ["Chopard", "chopard.html"], ["Longines", "longines"], ["Tissot", "tissot"], ["Rado", "rado"], ["Hamilton", "hamilton"], ["Nomos", "nomos"], ["Hublot", "hublot"], ["Baume & Mercier", "baume-et-mercier"], ["Montblanc", "montblanc"], ["Seiko", "seiko"]], "Relojes")}
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">${sectionHead("Encuentra tu reloj", "Por tipo y para quién")}
        <div class="link-grid reveal">
          <a href="catalogo.html?seccion=relojes&amp;tipo=automatico"><span><small>Mecanismo</small>Automáticos</span></a>
          <a href="catalogo.html?seccion=relojes&amp;tipo=cuerda"><span><small>Mecanismo</small>Cuerda manual</span></a>
          <a href="catalogo.html?seccion=relojes&amp;tipo=cuarzo"><span><small>Mecanismo</small>Cuarzo</span></a>
          <a href="catalogo.html?seccion=relojes&amp;tipo=smartwatch"><span><small>Mecanismo</small>Smartwatches</span></a>
          <a href="catalogo.html?seccion=relojes&amp;para=hombre"><span><small>Para</small>Hombre</span></a>
          <a href="catalogo.html?seccion=relojes&amp;para=mujer"><span><small>Para</small>Mujer</span></a>
          <a href="catalogo.html?seccion=relojes&amp;ocasion=compromiso"><span><small>Momentos</small>Relojes de compromiso</span></a>
          <a href="catalogo.html?seccion=relojes&amp;ocasion=comunion"><span><small>Momentos</small>Relojes de comunión</span></a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="split">
          <figure class="split__media split__media--square reveal">${img("relojero.jpg", "Juan Carlos Pérez, relojero de Joyería Grau, en el taller", 451, 450)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Servicio técnico</p>
            <h2 class="h2">Tradición relojera en nuestro taller</h2>
            <p>Somos servicio técnico oficial Rolex en Barcelona y Lloret de Mar. Nuestros relojeros revisan, reparan y ponen a punto tu reloj con el cuidado que merece.</p>
            <blockquote class="split__quote">«Somos tradición relojera y estamos comprometidos con el oficio.»<cite>Juan Carlos Pérez, Watchcare Service Manager y relojero</cite></blockquote>
            <div class="split__actions"><a class="btn" href="cita.html?servicio=tecnico">Solicitar servicio técnico <span class="arrow"></span></a></div>
          </div>
        </div>
        <div class="split split--reverse">
          <figure class="split__media split__media--landscape reveal">${img("preowned-hero.jpg", "Reloj pre-owned con certificado Grau", 1600, 1067)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Grau Pre-owned</p>
            <h2 class="h2">Una segunda vida para piezas excepcionales</h2>
            <p>Relojes restaurados con mimo en nuestro taller y entregados con el certificado Grau.</p>
            <div class="split__actions"><a class="btn btn--ghost" href="pre-owned.html">Descubrir Pre-owned <span class="arrow"></span></a></div>
          </div>
        </div>
      </div>
    </section>
` + ctaBand({ title: "¿Buscas un reloj en concreto?", text: "Pide cita y te mostraremos los modelos disponibles en boutique. Si buscas una referencia concreta, te ayudamos a encontrarla.", service: "relojes" }),
  });

  /* ------------------------------------------------------------------ */
  /* COMPROMISO                                                          */
  /* ------------------------------------------------------------------ */
  const models = (items) => items.map(([src, name, kind], i) => `<a class="model reveal" data-delay="${i}" href="cita.html?servicio=compromiso">${img(src, kind + " " + name + " de Joyería Grau", 500, 338)}<small>${kind}</small><h3 class="h3">${name}</h3></a>`).join("\n          ");
  const benefit = ([title, text], i) => `<article class="benefit reveal"${i ? ` data-delay="${i}"` : ""}><span class="benefit__n">0${i + 1}</span><h3 class="h3">${title}</h3><p>${text}</p></article>`;

  site.page("compromiso.html", {
    title: "Anillos de compromiso y alianzas de boda · Joyería Grau",
    description: "Anillos de compromiso y alianzas de boda de Joyería Grau, hechos a mano en nuestro taller con oro de 18 k, platino y diamantes. Pide cita y te asesoramos.",
    active: "compromiso.html",
    image: og("comp-hero.jpg", 1080, 1350),
    body: pageHero({
      crumb: "Compromiso", eyebrow: "Compromiso y boda", title: "Recuerdos que perduran",
      lead: "Hacer la gran pregunta y enlazar vuestras vidas son dos de los momentos más emotivos que viviréis juntos. Recordadlos con el anillo de compromiso y las alianzas de boda.",
      actions: `<a class="btn" href="#anillos">Anillos de compromiso <span class="arrow"></span></a><a class="btn btn--ghost" href="#alianzas">Alianzas de boda</a>`,
      image: { src: "comp-hero.jpg", alt: "Anillo de compromiso y alianza de diamantes de Joyería Grau entre flores blancas", width: 1080, height: 1350 },
    }) + `
    <div class="proof">
      <div class="wrap">
        <div class="proof__item"><b>1947</b><span>Joyeros desde</span></div>
        <div class="proof__item"><b>Taller propio</b><span>Hecho a mano</span></div>
        <div class="proof__item"><b>18 k</b><span>Oro y platino</span></div>
        <div class="proof__item"><b>G-VS2</b><span>Diamantes desde</span></div>
      </div>
    </div>

    <section class="section" id="anillos">
      <div class="wrap">${sectionHead("Anillos de compromiso", "Hacia el «Sí, quiero»", `<p class="reveal">Ya tienes a tu media naranja. Solo te falta el anillo para que el momento sea redondo.</p>`)}
        <div class="models">
          ${models([["anillo-corazon.jpg", "Corazón", "Anillo de compromiso"], ["anillo-abrazo.jpg", "Abrazo", "Anillo de compromiso"], ["anillo-amor.jpg", "Amor", "Anillo de compromiso"], ["anillo-tension.jpg", "Tensión", "Anillo de compromiso"]])}
        </div>

        <div class="split block-gap">
          <figure class="split__media split__media--square split__media--contain reveal">${img("anillo-zafiro.jpg", "Anillo de compromiso Grau con zafiro azul en el interior del aro", 1200, 1200)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Algo azul</p>
            <h2 class="h2">Un zafiro escondido en cada anillo</h2>
            <p>El azul es símbolo de amor y fidelidad. Los anillos de compromiso Grau llevan un zafiro azul en el interior del aro, como un guiño a esa antigua tradición.</p>
            <div class="split__actions"><a class="btn" href="cita.html?servicio=compromiso">Pedir cita <span class="arrow"></span></a><a class="link-line" href="${whatsapp()}"${ext}>Consultar por WhatsApp</a></div>
          </div>
        </div>

        <div class="benefits benefits--3 block-gap">
          ${[["Un tesoro de la tierra", "Un diamante necesita millones de años para formarse y salir a la superficie. Por eso es la gema más valorada para un anillo de compromiso, símbolo de eternidad."], ["Un anillo para cada dedo", "Cada historia es diferente. Cuando elijas el modelo, nuestros maestros joyeros lo crearán desde cero siguiendo tus deseos."], ["Forjado para la eternidad", "Utilizamos aleaciones propias, fundidas, forjadas y pulidas a mano: oro de 24 k aleado para conseguir oro de 18 k en distintos colores, y platino."]].map(benefit).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section--paper" id="alianzas">
      <div class="wrap">
        <div class="split">
          <figure class="split__media reveal">${img("comp-alianzas.jpg", "Alianzas de boda de oro amarillo de Joyería Grau", 1080, 1350)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Alianzas de boda</p>
            <h2 class="h2">Alianzas para toda la eternidad</h2>
            <p>Elegid las alianzas que serán el símbolo de vuestro enlace, en oro rosa, oro amarillo, oro blanco o platino. Llevamos desde 1947 ayudando a crear historias de amor.</p>
            <div class="split__actions"><a class="btn" href="cita.html?servicio=compromiso">Pedir cita <span class="arrow"></span></a><a class="link-line" href="${whatsapp()}"${ext}>Consultar por WhatsApp</a></div>
          </div>
        </div>

        <div class="models block-gap block-gap--sm">
          ${models([["alianza-almond.jpg", "Almond", "Alianza de boda"], ["alianza-strong.jpg", "Strong", "Alianza de boda"], ["alianza-happy.jpg", "Happy", "Alianza de boda"], ["alianza-steps.jpg", "Steps", "Alianza de boda"]])}
        </div>

        <div class="benefits block-gap">
          ${[["Metales preciosos", "Todas nuestras alianzas se realizan en oro de 18 k o platino, con nuestra propia aleación para conseguir colores vivos y piezas duraderas."], ["Diamantes éticos", "Adquirimos los diamantes en origen y seguimos la cadena de custodia. Nuestros diamantes parten de la calidad G-VS2."], ["Personalizadas", "Desde el grabado hasta la forma, todo es posible para que vuestras alianzas reflejen lo que solo vosotros sabéis."], ["Deseo de prosperidad", "En todas nuestras alianzas añadimos un pequeño diamante en el interior, para desearos prosperidad en este nuevo camino."]].map(benefit).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="split">
          <figure class="split__media reveal">${img("comp-taller.jpg", "Joyero de Grau engastando un diamante en el taller", 1080, 1350)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Somos joyeros</p>
            <h2 class="h2">Hechos a mano en nuestro taller</h2>
            <p>Una larga tradición joyera nos precede. Las joyas Grau se realizan a mano en nuestro taller, donde controlamos cada proceso para que vuestros anillos superen vuestras expectativas.</p>
            <div class="split__actions"><a class="btn btn--ghost" href="historia.html">Conócenos <span class="arrow"></span></a></div>
          </div>
        </div>
        <div class="split split--reverse">
          <figure class="split__media split__media--square reveal">${img("novia-collar.jpg", "Collar de oro blanco con esmeralda y diamantes para novia", 1000, 1000)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">El gran día</p>
            <h2 class="h2">Luce tu esencia en tu boda</h2>
            <p>Encuentra el complemento ideal para combinar con tu vestido o tu traje. Y si prefieres pedir matrimonio con un reloj, también tenemos relojes de compromiso para hombre.</p>
            <div class="link-grid link-grid--3">
              <a href="catalogo.html?seccion=joyas&amp;cat=collares&amp;ocasion=novia"><span>Collares de novia</span></a>
              <a href="catalogo.html?seccion=joyas&amp;cat=pendientes&amp;ocasion=novia"><span>Pendientes de novia</span></a>
              <a href="catalogo.html?seccion=joyas&amp;cat=pulseras&amp;ocasion=novia"><span>Pulseras de novia</span></a>
              <a href="catalogo.html?cat=gemelos&amp;ocasion=novia"><span>Gemelos de novio</span></a>
              <a href="catalogo.html?seccion=relojes&amp;ocasion=compromiso"><span>Relojes de compromiso</span></a>
              <a href="relojes.html"><span>Relojería</span></a>
            </div>
          </div>
        </div>
        <div class="split" id="estuche">
          <figure class="split__media reveal">${img("hero-3.jpg", "Estuche de regalo Grau con lazo verde", 1200, 1500)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">El estuche Grau</p>
            <h2 class="h2">Preparado para sorprender</h2>
            <p>Todas las joyas Grau se entregan cuidadosamente envueltas en nuestro embalaje original, realizado con materiales ligeros y sostenibles.</p>
          </div>
        </div>
      </div>
    </section>
` + ctaBand({ eyebrow: "Asesores personales", title: "Pide ayuda. Estamos aquí.", text: "Nuestro equipo te espera con ilusión para ayudarte a encontrar el anillo o las alianzas perfectas.", service: "compromiso" }),
  });

  /* ------------------------------------------------------------------ */
  /* MARCAS                                                              */
  /* ------------------------------------------------------------------ */
  const W = "Relojes", J = "Joyería", A = "Accesorios";
  site.page("marcas.html", {
    title: "Marcas · Joyería Grau",
    description: "Todas las marcas de relojería, joyería y accesorios de Joyería Grau: Rolex, Tudor, Cartier, Omega, TAG Heuer, Messika, Pomellato, Damiani, Montblanc y muchas más.",
    active: "marcas.html",
    body: pageHero({
      crumb: "Marcas", eyebrow: "Marcas", title: "Las firmas más prestigiosas",
      lead: "Distribuidores oficiales de las grandes maisons de relojería y joyería, junto a nuestra propia colección Grau.",
      actions: `<div class="brand-nav"><a href="#relojeria">Relojería</a><a href="#joyeria">Joyería</a><a href="#accesorios">Accesorios</a></div>`,
    }) + `
    <section class="section">
      <div class="wrap">
        <div class="brand-group" id="relojeria">${sectionHead("Relojería", "Relojes")}
          <div class="brand-grid reveal">
            ${site.brandTiles([["Rolex", "rolex.html", "Distribuidor oficial", 1], ["Tudor", "tudor.html", "Distribuidor oficial", 1], ["Cartier", "cartier.html", "Distribuidor oficial", 1], ["TAG Heuer", "tag-heuer", W], ["Omega", "omega", W], ["Chopard", "chopard.html", W], ["Longines", "longines", W], ["Hublot", "hublot", W], ["Tissot", "tissot", W], ["Rado", "rado", W], ["Hamilton", "hamilton", W], ["Nomos", "nomos", W], ["Baume & Mercier", "baume-et-mercier", W], ["Seiko", "seiko", W], ["Garmin", "garmin", W], ["Casio", "casio", W]])}
          </div>
        </div>
        <div class="brand-group" id="joyeria">${sectionHead("Joyería", "Joyas")}
          <div class="brand-grid reveal">
            ${site.brandTiles([["Grau", "grau", "Colección propia", 1], ["Messika", "messika", J], ["Pomellato", "pomellato", J], ["Damiani", "damiani", J], ["Dinh Van", "dinh-van", J], ["Roberto Coin", "roberto-coin", J], ["John Hardy", "john-hardy", J], ["Ole Lynggaard", "ole-lynggaard", J], ["Gigi Clozeau", "gigiclozeau", J], ["Chantecler", "chantecler", J], ["Van den Abeele", "van-den-abeele", J], ["My First Diamond", "my-first-diamond", J], ["Uno de 50", "uno-de-50", J], ["Pandora", "pandora", J], ["PdPaola", "pdpaola", J], ["Agatha", "agatha", J], ["Dodo", "dodo", J], ["Baraka", "baraka", J], ["Swarovski", "swarovski", J], ["Les Georgettes", "les-georgettes", J]])}
          </div>
        </div>
        <div class="brand-group" id="accesorios">${sectionHead("Accesorios", "Escritura, piel y gemelos")}
          <div class="brand-grid reveal">
            ${site.brandTiles([["Montblanc", "montblanc", A], ["Chopard", "chopard.html", A], ["Deakin & Francis", "deakin-francis", A], ["Ver todos los accesorios", "catalogo.html?seccion=accesorios", "Catálogo"]])}
          </div>
        </div>
      </div>
    </section>
` + ctaBand({ title: "¿Buscas una marca en concreto?", text: "Si no encuentras la pieza que buscas, pregúntanos. Te ayudamos a localizarla en cualquiera de nuestras boutiques." }),
  });

  /* ------------------------------------------------------------------ */
  /* PRE-OWNED                                                           */
  /* ------------------------------------------------------------------ */
  site.page("pre-owned.html", {
    title: "Grau Pre-owned · Relojes y joyas certificados · Joyería Grau",
    description: "Grau Pre-owned: relojes y joyas vintage restaurados en nuestro taller y entregados con el certificado Grau.",
    active: "pre-owned.html",
    image: og("preowned-hero.jpg", 1600, 1067),
    body: pageHero({
      crumb: "Pre-owned", eyebrow: "Grau Pre-owned", title: "Las auténticas joyas nunca pierden la esencia",
      lead: "Encuentra la joya o el reloj perfecto para darle una segunda vida a una pieza excepcional, restaurada y certificada en nuestro taller.",
      actions: `<a class="btn" href="catalogo.html?seccion=preowned&amp;cat=po-relojes">Relojes pre-owned <span class="arrow"></span></a><a class="btn btn--ghost" href="catalogo.html?seccion=preowned&amp;cat=po-joyas">Joyas pre-owned</a>`,
      image: { src: "preowned-hero.jpg", alt: "Reloj pre-owned con tarjeta de certificado Grau", width: 1600, height: 1067 }, position: "45% center",
    }) + `
    <section class="section section--paper">
      <div class="wrap">
        <div class="text-cards">
          <a class="text-card reveal" href="catalogo.html?seccion=preowned&amp;cat=po-relojes"><p class="eyebrow">Relojes</p><h2 class="h2">Relojes pre-owned</h2><p>Relojes restaurados con mimo y certificados para darles una segunda vida.</p><span class="link-line">Explorar relojes</span></a>
          <a class="text-card reveal" data-delay="1" href="catalogo.html?seccion=preowned&amp;cat=po-joyas"><p class="eyebrow">Joyas</p><h2 class="h2">Joyas pre-owned</h2><p>Verdaderas obras de arte vintage recuperadas y puestas a punto por nuestros joyeros.</p><span class="link-line">Explorar joyas</span></a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="split">
          <figure class="split__media reveal">${img("comp-taller.jpg", "Joyero de Grau revisando una pieza en el taller", 1080, 1350)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Certificado Pre-owned</p>
            <h2 class="h2">Cada pieza, revisada en nuestro taller</h2>
            <p>Nuestros joyeros y relojeros analizan y ponen a punto todas las piezas siguiendo cuatro fases, para garantizar su funcionamiento y su calidad sin perder su esencia original.</p>
            <ol class="steps">
              <li><b>Fase 1</b><span>Selección de las mejores piezas clásicas.</span></li>
              <li><b>Fase 2</b><span>Control meticuloso en el taller Grau para garantizar su correcto funcionamiento.</span></li>
              <li><b>Fase 3</b><span>Restauración de la pieza, respetando su personalidad.</span></li>
              <li><b>Fase 4</b><span>Limpieza y expedición del certificado Grau.</span></li>
            </ol>
          </div>
        </div>
      </div>
    </section>
` + ctaBand({ title: "¿Buscas una pieza pre-owned?", text: "Pide cita y te enseñaremos las piezas disponibles en boutique, o cuéntanos qué buscas y te avisaremos cuando llegue.", service: "preowned" }),
  });

  /* ------------------------------------------------------------------ */
  /* TIENDAS                                                             */
  /* ------------------------------------------------------------------ */
  site.page("tiendas.html", {
    title: "Nuestras tiendas · Joyería Grau",
    description: "Joyerías Grau en Barcelona, Lloret de Mar, Sabadell y Blanes: direcciones, horarios, teléfonos y cita previa.",
    active: "tiendas.html",
    image: og("tienda-barcelona.jpg", 900, 600),
    schema: [schemaTiendas()],
    body: pageHero({
      crumb: "Tiendas", eyebrow: "Nuestras joyerías", title: "Visítanos en boutique",
      lead: "Cuatro joyerías con el mismo trato humano, honesto y cercano que nos define desde 1947. Visita tu joyería preferida y recibe asesoramiento personalizado.",
      actions: `<div class="brand-nav">${C.tiendas.map((t) => `<a href="#${t.slug}">${t.nombre}</a>`).join("")}</div>`,
    }) + `
    <section class="section">
      <div class="wrap">
        <div class="store-cards">
          ${C.tiendas.map((t, i) => site.storeCard(t, { delay: i % 2, eyebrow: t.nota, citaQuery: `tienda=${t.slug}`, id: true })).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section--paper">
      <div class="wrap">${sectionHead("Atención al cliente", "También a distancia", `<p class="reveal">${C.horarioAtencion}, por teléfono, email y WhatsApp.</p>`)}
        ${contactGrid(" contact-grid--flush")}
      </div>
    </section>
`,
  });

  /* ------------------------------------------------------------------ */
  /* CITA                                                                */
  /* ------------------------------------------------------------------ */
  const opt = (v, l) => `<option value="${v}">${l}</option>`;
  site.page("cita.html", {
    title: "Pedir cita · Joyería Grau",
    description: "Pide cita en tu joyería Grau de Barcelona, Lloret de Mar, Sabadell o Blanes y recibe asesoramiento personalizado.",
    active: "cita.html",
    scripts: ["catalogo.js"],
    body: pageHero({
      crumb: "Pedir cita", eyebrow: "Cita previa", title: "Asesoramiento personalizado",
      lead: "Cuéntanos qué buscas y en qué joyería prefieres que te atendamos. Te contactaremos para confirmar el día y la hora.",
    }) + `
    <section class="section">
      <div class="wrap cita">
        <div class="form-card nl-box reveal">
          <form class="cita-form form-grid" novalidate data-form="cita">
            <input type="hidden" name="tipo" value="cita">
            <div class="hp-field" aria-hidden="true"><label for="c-web">No rellenar</label><input type="text" id="c-web" name="web" tabindex="-1" autocomplete="off"></div>
            <div class="cita-product" data-cita-product hidden></div>
            <p class="form-legend">Tu visita</p>
            <div class="field">
              <select id="c-tienda" name="tienda" required aria-describedby="c-tienda-error">
                <option value="">Selecciona una joyería</option>
                ${C.tiendas.map((t) => opt(t.slug, t.nombre)).join("")}
              </select>
              <label for="c-tienda">Joyería *</label>
              <p class="field__error" id="c-tienda-error">Elige una joyería.</p>
            </div>
            <div class="field">
              <select id="c-servicio" name="servicio">
                <option value="">Sin especificar</option>
                ${opt("joyas", "Joyas")}${opt("personalizadas", "Joyas personalizadas")}${opt("compromiso", "Anillos de compromiso y alianzas")}${opt("relojes", "Relojes")}${opt("tecnico", "Servicio técnico de relojería")}${opt("preowned", "Pre-owned")}${opt("otras", "Otras consultas")}
              </select>
              <label for="c-servicio">Motivo de la cita</label>
            </div>
            <div class="field">
              <input type="date" id="c-fecha" name="fecha">
              <label for="c-fecha">Fecha preferida</label>
            </div>
            <div class="field">
              <select id="c-franja" name="franja">
                <option value="">Indiferente</option>${opt("manana", "Mañana")}${opt("tarde", "Tarde")}
              </select>
              <label for="c-franja">Franja horaria</label>
            </div>

            <p class="form-legend">Tus datos</p>
            <div class="field">
              <input type="text" id="c-nombre" name="nombre" placeholder=" " autocomplete="given-name" required maxlength="80" aria-describedby="c-nombre-error">
              <label for="c-nombre">Nombre *</label>
              <p class="field__error" id="c-nombre-error">Escribe tu nombre.</p>
            </div>
            <div class="field">
              <input type="text" id="c-apellidos" name="apellidos" placeholder=" " autocomplete="family-name" maxlength="120">
              <label for="c-apellidos">Apellidos</label>
            </div>
            <div class="field">
              <input type="email" id="c-email" name="email" placeholder=" " autocomplete="email" required maxlength="160" aria-describedby="c-email-error">
              <label for="c-email">Correo electrónico *</label>
              <p class="field__error" id="c-email-error">Introduce un correo válido.</p>
            </div>
            <div class="field">
              <input type="tel" id="c-telefono" name="telefono" placeholder=" " autocomplete="tel" required maxlength="30" aria-describedby="c-telefono-error">
              <label for="c-telefono">Teléfono *</label>
              <p class="field__error" id="c-telefono-error">Introduce un teléfono válido.</p>
            </div>
            <div class="field span-2">
              <textarea id="c-mensaje" name="mensaje" placeholder=" " rows="4" maxlength="2000"></textarea>
              <label for="c-mensaje">¿Qué te gustaría ver o consultar?</label>
            </div>

            <label class="consent">
              <input type="checkbox" name="consent" value="1" required aria-describedby="c-consent-error">
              <span class="consent__box"></span>
              <span>He leído y acepto la <a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a>.</span>
            </label>
            <p class="consent__error" id="c-consent-error">Necesitamos tu consentimiento para gestionar la cita.</p>

            <button class="btn btn--full" type="submit">Solicitar cita <span class="arrow"></span></button>
            <p class="form-status" role="alert" hidden></p>
          </form>
          <div class="nl-success" role="status" tabindex="-1">
            <p class="eyebrow">Solicitud recibida</p>
            <h2 class="h2">Gracias, te contactaremos pronto.</h2>
            <p class="lead">Nuestro equipo se pondrá en contacto contigo para confirmar el día y la hora de tu cita.</p>
            <a class="btn" href="index.html">Volver al inicio <span class="arrow"></span></a>
          </div>
        </div>

        <aside class="reveal" data-delay="1">
          <p class="eyebrow">¿Prefieres hablar con nosotros?</p>
          <h2 class="h2 cita__title">Otras formas de contacto</h2>
          <ul class="contact-list">
            <li><a href="tel:${C.telefono.href}">${icon.telefono}<span><b>${C.telefono.texto}</b>Llámanos y recibe asesoramiento</span></a></li>
            <li><a href="${whatsapp()}"${ext}>${icon.whatsapp}<span><b>WhatsApp</b>Consulta a través de la app</span></a></li>
            <li><a href="mailto:${C.email}">${icon.email}<span><b>${C.email}</b>Escríbenos tus dudas</span></a></li>
            <li><a href="tiendas.html">${icon.tienda}<span><b>Nuestras tiendas</b>Direcciones y horarios</span></a></li>
            <li><div class="contact-list__item">${icon.reloj}<span><b>Lunes a sábado</b>De 10:00 a 20:00 h por teléfono, email y WhatsApp</span></div></li>
          </ul>
        </aside>
      </div>
    </section>
`,
  });

  /* ------------------------------------------------------------------ */
  /* HISTORIA                                                            */
  /* ------------------------------------------------------------------ */
  const milestones = [
    ["1947", "Nuestros inicios", "La familia Grau-Domenech abrió un pequeño comercio en Lloret de Mar.", "historia-1947.jpg", "Ricard y Francesca Grau"],
    ["1947 – 1997", "Crecemos", "Durante los primeros cincuenta años ampliamos el negocio con nuevas tiendas en Lloret de Mar, Blanes y Sabadell.", "historia-lloret.jpg", "Fachada de Joyería Grau en Lloret de Mar"],
    ["Años 80", "Llega Rolex", "Conocimos a uno de nuestros grandes compañeros de viaje: Rolex. Nos convertimos en su distribuidor y servicio técnico oficial.", "historia-rolex.jpg", "Rolex en Lloret de Mar"],
    ["Años 90", "El origen de las gemas", "Gemma Grau viajó por Asia y se acercó al origen de materiales como las perlas y las piedras preciosas.", "historia-asia.jpg", "Gemma Grau en Indonesia, en un cultivo de perlas"],
    ["1993", "Formación gemológica", "Tras estudiar en el GIA (Gemological Institute of America) en California, Gemma trajo a nuestras colecciones la cultura y el estilo de vida californianos.", "historia-eeuu.jpg", "Gemma Grau en Estados Unidos"],
    ["1994", "Nace Aura", "Nace nuestra colección insignia, Aura, que perdura hasta hoy con la misma esencia.", "historia-aura.jpg", "Collar de la colección Aura"],
    ["2011", "Llegamos a Barcelona", "Abrimos en plena Avenida Diagonal como punto de venta oficial Rolex y servicio técnico oficial, fieles a nuestra esencia original.", "historia-barcelona.jpg", "Joyería Grau en Barcelona"],
  ];
  site.page("historia.html", {
    title: "Nuestra historia · Joyería Grau desde 1947",
    description: "La historia de Joyería Grau: una familia joyera desde 1947, nacida en Lloret de Mar, distribuidor oficial Rolex y con taller propio.",
    active: "historia.html",
    image: og("historia-familia.jpg", 1148, 700),
    body: pageHero({
      crumb: "Nuestra historia", eyebrow: "#wearegrau", title: "Desde 1947, fieles a nuestra esencia",
      lead: "Ofrecemos mucho más que una joya o un reloj: una pieza única y eterna. Desde que nacimos en Lloret de Mar, un trato humano, honesto y de confianza nos ha definido.",
      actions: `<a class="btn" href="#historia">Nuestros orígenes <span class="arrow"></span></a><a class="btn btn--ghost" href="tiendas.html">Nuestras tiendas</a>`,
      image: { src: "historia-familia.jpg", alt: "Ricard y Gemma Grau", width: 1148, height: 700 }, wide: true, caption: "Ricard y Gemma Grau",
    }) + `
    <section class="section section--paper">
      <div class="wrap">
        <figure class="quote reveal">
          ${img("historia-gemma.jpg", "Gemma Grau", 566, 450)}
          <div>
            <blockquote>«Cada vez que nos decís “era exactamente esto”, nos dan ganas de seguir otros setenta años haciendo lo mismo.»</blockquote>
            <figcaption>Gemma Grau, Manager</figcaption>
          </div>
        </figure>
      </div>
    </section>

    <section class="section" id="historia">
      <div class="wrap">${sectionHead("Nuestros orígenes", "Una familia joyera", `<p class="reveal">Somos conscientes de lo relevante que puede ser una joya. Por eso ponemos el alma en lo que hacemos.</p>`)}
        <div class="timeline">
          ${milestones.map(([y, t, p, src, cap]) => `<article class="milestone reveal">
            <figure class="milestone__media">${img(src, cap, 566, 450)}<figcaption class="media-caption">${cap}</figcaption></figure>
            <div class="milestone__text"><span class="milestone__year">${y}</span><h3 class="h3">${t}</h3><p>${p}</p></div>
          </article>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap">
        <div class="split">
          <figure class="split__media split__media--landscape reveal">${img("historia-taller.jpg", "Manos de un joyero trabajando en el taller de Grau", 566, 450)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Nuestro taller</p>
            <h2 class="h2">Joyas que son algo más que joyas</h2>
            <p>Desde nuestros inicios, en nuestro taller propio trabajamos de forma artesanal, ética y sostenible, fusionando nuestros valores con lo mejor de la tradición y de la innovación. Historias originales que perduran generaciones.</p>
            <div class="split__actions"><a class="btn btn--ghost" href="joyas.html">Ver nuestras joyas <span class="arrow"></span></a></div>
          </div>
        </div>
        <div class="split split--reverse">
          <figure class="split__media split__media--landscape reveal">${img("historia-thinkpink.jpg", "Campaña Thinkpink de Joyería Grau en beneficio de la AECC", 566, 450)}</figure>
          <div class="split__body reveal" data-delay="1">
            <p class="eyebrow">Compromiso social</p>
            <h2 class="h2">Un impacto positivo</h2>
            <p>Creemos en generar un impacto positivo en la sociedad con nuestro trabajo y nuestras iniciativas solidarias: apoyamos acciones culturales y sostenibles y ayudamos a organizaciones sin ánimo de lucro, como con la campaña Thinkpink en beneficio de la AECC.</p>
          </div>
        </div>
      </div>
    </section>
` + ctaBand({ eyebrow: "Tú también eres Grau", title: "Luce tu esencia", text: "Visítanos en cualquiera de nuestras cuatro joyerías y descubre por qué tantas familias confían en nosotros desde hace generaciones." }),
  });
};

