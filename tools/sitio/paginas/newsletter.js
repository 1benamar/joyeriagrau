// Landing de la newsletter (con cabecera y pie propios).
const C = require("../lib/config");

module.exports = function (site) {
  site.page("newsletter.html", {
    layout: "landing",
    sitemap: false,
    title: "La Carta de Grau · Newsletter de Joyería Grau",
    description: "Suscríbete a La Carta de Grau: nuevas colecciones, presentaciones en boutique y consejos de nuestros joyeros, directamente en tu correo.",
    image: { src: "assets/img/newsletter-hero.jpg", width: 1600, height: 2000 },
    body: `
    <section class="lp-hero">
      <div class="lp-hero__media">
        <img src="assets/img/newsletter-hero.jpg" alt="Cadena de oro amarillo sobre un fondo dorado brillante" width="1600" height="2000" fetchpriority="high">
        <div class="lp-hero__badge"><b>1</b> carta al mes · sin ruido</div>
      </div>

      <div class="lp-hero__panel">
        <div class="lp-hero__inner nl-box" id="suscribirse">
          <p class="eyebrow reveal">La Carta de Grau</p>
          <h1 class="display reveal" data-delay="1">Lo que brilla,<br>primero en tu correo.</h1>
          <p class="lead reveal" data-delay="2">Nuevas colecciones, presentaciones privadas en boutique y los consejos de nuestros joyeros. Una vez al mes, con el mismo cuidado con el que elegimos cada pieza.</p>
          <div class="reveal" data-delay="3">
          ${site.newsletterForm({ id: "lp", source: "newsletter", completo: true, consentText: "y quiero recibir comunicaciones comerciales de Joieria Grau", button: "Suscribirme a La Carta" })}
          </div>
          <div class="nl-success" role="status" tabindex="-1">
            <p class="eyebrow">Suscripción recibida</p>
            <h2 class="h2">Gracias, te damos la bienvenida.</h2>
            <p class="lead">Hemos recibido tu solicitud y te escribiremos con la próxima edición de La Carta. Mientras tanto, puedes descubrir nuestras joyas.</p>
            <a class="btn" href="joyas.html">Descubrir joyas <span class="arrow"></span></a>
          </div>
        </div>
      </div>
    </section>

    <div class="proof">
      <div class="wrap">
        <div class="proof__item"><b>Rolex</b><span>Distribuidor oficial</span></div>
        <div class="proof__item"><b>${C.tiendas.length}</b><span>Boutiques en Catalunya</span></div>
        <div class="proof__item"><b>+10</b><span>Maisons de lujo</span></div>
        <div class="proof__item"><b>75 €</b><span>Envío gratuito desde</span></div>
      </div>
    </div>

    <section class="section">
      <div class="wrap">
        <div class="section__head">
          <div class="reveal">
            <p class="eyebrow">Qué recibirás</p>
            <h2 class="h2">Una carta pensada para quien valora los detalles</h2>
          </div>
          <p class="reveal">Sin promociones constantes. Solo lo que merece la pena contarte.</p>
        </div>
        <div class="benefits">
          ${[["Novedades en primicia", "Las nuevas colecciones de Grau y de nuestras maisons, antes de que lleguen al escaparate."], ["Invitaciones a boutique", "Presentaciones privadas y eventos en Barcelona, Sabadell, Lloret de Mar y Blanes."], ["Consejos de joyero", "Cómo elegir un anillo de compromiso, cuidar el oro o conocer la historia de un reloj."], ["Selección pre-owned", "Aviso cuando entran piezas de relojería pre-owned certificadas que no duran mucho."]]
            .map(([t, p], i) => `<article class="benefit reveal"${i ? ` data-delay="${i}"` : ""}>
            <span class="benefit__n">0${i + 1}</span>
            <h3 class="h3">${t}</h3>
            <p>${p}</p>
          </article>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section--sand">
      <div class="wrap issue">
        <div class="issue__text">
          <p class="eyebrow reveal">Un vistazo</p>
          <h2 class="h2 reveal" data-delay="1">Así es La Carta de Grau</h2>
          <p class="lead reveal" data-delay="2">Una lectura breve, cuidada y visual. Cada edición reúne lo más relevante del mes en nuestras boutiques.</p>
          <ul class="issue__list reveal" data-delay="3">
            <li>Una historia principal: una colección, una pieza o un encargo especial.</li>
            <li>Tres piezas seleccionadas por nuestro equipo.</li>
            <li>La agenda de la boutique y cómo reservar tu cita.</li>
          </ul>
        </div>
        <div class="mail reveal" data-delay="1" role="group" aria-label="Ejemplo de La Carta de Grau">
          <div class="mail__bar" aria-hidden="true"><i></i><i></i><i></i><span>La Carta de Grau · Edición de otoño</span></div>
          <div class="mail__body">
            <img src="assets/img/logo.svg" alt="" width="68" height="22">
            <p class="mail__date">Septiembre 2026</p>
            <div class="mail__hero"><img src="assets/img/alianzas-640.jpg" alt="" width="640" height="344" loading="lazy" decoding="async"></div>
            <p class="mail__title">El oro que os acompaña</p>
            <p>Descubre la nueva selección de alianzas y cómo elegir la vuestra.</p>
            <a class="mail__btn" href="compromiso.html#alianzas">Descubrir</a>
            <div class="mail__cols">
              <a href="catalogo.html?seccion=joyas&amp;cat=anillos"><img src="assets/img/anillos-640.jpg" alt="" width="640" height="853" loading="lazy" decoding="async"><span>Anillos</span></a>
              <a href="catalogo.html?seccion=joyas&amp;cat=collares"><img src="assets/img/collares-640.jpg" alt="" width="640" height="853" loading="lazy" decoding="async"><span>Collares</span></a>
              <a href="catalogo.html?seccion=joyas&amp;cat=pulseras"><img src="assets/img/pulseras-640.jpg" alt="" width="640" height="853" loading="lazy" decoding="async"><span>Pulseras</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--paper">
      <div class="wrap">
        <div class="section__head section__head--center">
          <div class="reveal">
            <p class="eyebrow eyebrow--plain">Preguntas frecuentes</p>
            <h2 class="h2">Antes de suscribirte</h2>
          </div>
        </div>
        <div class="faq reveal">
          <details>
            <summary>¿Con qué frecuencia recibiré la newsletter?</summary>
            <p>Enviamos una carta al mes. Solo escribimos fuera de ese calendario para avisarte de algo realmente especial, como una presentación en boutique.</p>
          </details>
          <details>
            <summary>¿Puedo darme de baja cuando quiera?</summary>
            <p>Sí. Puedes pedir la baja en cualquier momento respondiendo a cualquiera de nuestros correos o escribiendo a <a href="mailto:${C.email}">${C.email}</a>.</p>
          </details>
          <details>
            <summary>¿Qué hacéis con mis datos?</summary>
            <p>Usamos tu correo únicamente para enviarte La Carta de Grau. No compartimos tus datos con terceros. Puedes consultar todos los detalles en nuestra <a href="privacidad.html">política de privacidad</a>.</p>
          </details>
          <details>
            <summary>¿Para qué sirve elegir mi boutique?</summary>
            <p>Así podemos invitarte a los eventos y presentaciones de la joyería que te queda más cerca.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="section final">
      <div class="wrap">
        <p class="eyebrow reveal">Únete</p>
        <h2 class="h2 reveal" data-delay="1">Recibe la próxima carta.</h2>
        <p class="reveal" data-delay="2">Déjanos tu correo y recíbela junto a quienes ya forman parte de Grau.</p>
        <div class="nl-box reveal" data-delay="3">
          ${site.newsletterForm({ id: "final", source: "newsletter-final", dark: true })}
          <div class="nl-success nl-success--center" role="status" tabindex="-1">
            <h3 class="h3">Gracias por suscribirte.</h3>
            <p>Hemos recibido tu solicitud. Te escribiremos con la próxima edición.</p>
          </div>
        </div>
      </div>
    </section>
`,
  });
};
