// Bloques con datos: tarjetas de tienda y de marca, artículos del blog y formularios de newsletter.
const fs = require("fs");
const path = require("path");
const C = require("./config");
const { esc, img, sectionHead, direccion } = require("./plantilla");

const ext = ' target="_blank" rel="noopener"';
const blog = {
  posts: JSON.parse(fs.readFileSync(path.join(__dirname, "..", "contenido", "blog.json"), "utf8")),
  categories: JSON.parse(fs.readFileSync(path.join(__dirname, "..", "contenido", "blog-categorias.json"), "utf8")),
};

/* Texto plano de un fragmento HTML, recortado para usar como meta description */
function summary(html, fallback = "", max = 158) {
  const text = String(html).replace(/<(h\d)[^>]*>[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
  if (text.length < 50) return fallback;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}

/* Casillas de marca: una clave de marca enlaza al catálogo filtrado; una ruta .html, a esa página */
const brandTiles = (list, defaultMeta = "") => list.map(([name, target, meta, official]) => {
  const href = target.includes(".html") ? target.replace(/&(?!amp;)/g, "&amp;") : "catalogo.html?marca=" + target;
  return `<a class="brand${official ? " brand--official" : ""}" href="${href}"><span class="brand__name">${esc(name)}</span><span class="brand__meta">${meta || defaultMeta}</span></a>`;
}).join("\n            ");

function storeCard(t, { delay = 0, eyebrow, citaQuery, id = false, level = 2 }) {
  return `<article class="store-card reveal"${delay ? ` data-delay="${delay}"` : ""}${id ? ` id="${t.slug}"` : ""}>
            <div class="store-card__img">${img(t.foto[0], "Fachada de la joyería Grau en " + t.nombre, t.foto[1], t.foto[2])}</div>
            <div class="store-card__body">
              <div><p class="eyebrow">${eyebrow}</p><h${level} class="h2">${t.nombre}</h${level}></div>
              <dl class="store-info">
                <dt>Dirección</dt><dd>${direccion(t)}</dd>
                <dt>Horario</dt><dd>${t.horario}</dd>
                <dt>Teléfono</dt><dd><a href="tel:${t.tel}">${t.telefono}</a></dd>
              </dl>
              <div class="store-card__actions">
                <a class="btn btn--sm" href="cita.html?${citaQuery}">Pedir cita</a>
                <a class="btn btn--ghost btn--sm" href="${t.mapa}"${ext}>Cómo llegar<span class="sr-only"> a Grau ${t.nombre}</span></a>
              </div>
            </div>
          </article>`;
}

function blogCards(category, title) {
  const list = blog.posts.filter((p) => p.categories.includes(category)).slice(0, 3);
  if (!list.length) return "";
  const fecha = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  return `
    <section class="section">
      <div class="wrap">${sectionHead("Del blog", title, `<a class="link-line reveal" href="blog.html#${category}">Ver todos los artículos</a>`)}
        <div class="journal">
          ${list.map((p, i) => `<a class="post reveal"${i ? ` data-delay="${i}"` : ""} href="blog/${p.slug}.html"><div class="post__img">${p.image ? `<img src="${esc(p.image.src)}" alt="${esc(p.alt)}" width="${p.image.width}" height="${p.image.height}" loading="lazy" decoding="async">` : ""}</div><p class="post__tag">${fecha(p.date)}</p><h3 class="h3">${esc(p.title)}</h3><span class="link-line">Leer</span></a>`).join("\n          ")}
        </div>
      </div>
    </section>`;
}

/* Formulario de newsletter. "completo" añade nombre, intereses y boutique (landing). */
function newsletterForm({ id, source, dark = false, completo = false, consentText = "", button = "Suscribirme" }) {
  const field = (name, type, label, extra = "") => `<div class="field">
              <input type="${type}" id="${id}-${name}" name="${name}" placeholder=" "${extra}>
              <label for="${id}-${name}">${label}</label>${/required/.test(extra) ? `\n              <p class="field__error" id="${id}-${name}-error">Introduce un correo válido.</p>` : ""}
            </div>`;
  const email = field("email", "email", completo ? "Correo electrónico *" : "Tu correo electrónico", ` autocomplete="email" required maxlength="160" aria-describedby="${id}-email-error"`);
  return `<form class="nl-form${dark ? " nl-form--dark" : ""}" novalidate data-form="newsletter">
            <input type="hidden" name="tipo" value="newsletter">
            <input type="hidden" name="origen" value="${source}">
            <div class="hp-field" aria-hidden="true"><label for="${id}-web">No rellenar</label><input type="text" id="${id}-web" name="web" tabindex="-1" autocomplete="off"></div>
            ${completo ? `${field("nombre", "text", "Nombre", ' autocomplete="given-name" maxlength="80"')}
            ${email}
            <fieldset class="chips">
              <legend>¿Qué te interesa?</legend>
              ${[["joyeria", "Joyería", 1], ["relojeria", "Relojería"], ["compromiso", "Compromiso"], ["pre-owned", "Pre-owned"]].map(([v, l, on]) => `<label class="chip"><input type="checkbox" name="intereses[]" value="${v}"${on ? " checked" : ""}><span>${l}</span></label>`).join("\n              ")}
            </fieldset>
            <div class="field">
              <select id="${id}-tienda" name="tienda">
                <option value="">Sin preferencia</option>
                ${C.tiendas.map((t) => `<option value="${t.slug}">${t.nombre}</option>`).join("\n                ")}
                <option value="online">Compro online</option>
              </select>
              <label for="${id}-tienda">Tu boutique preferida</label>
            </div>` : `<div class="nl-form__row">
            ${email}
              <button class="btn btn--light" type="submit">${button}</button>
            </div>`}
            <label class="consent">
              <input type="checkbox" name="consent" value="1" required aria-describedby="${id}-consent-error">
              <span class="consent__box"></span>
              <span>He leído y acepto la <a href="privacidad.html"${ext}>política de privacidad</a>${consentText ? " " + consentText : ""}.</span>
            </label>
            <p class="consent__error" id="${id}-consent-error">Necesitamos tu consentimiento para enviarte la newsletter.</p>
            ${completo ? `<button class="btn btn--full" type="submit">${button} <span class="arrow"></span></button>
            <p class="fine">Puedes darte de baja en cualquier momento escribiendo a ${C.email}.</p>` : ""}
            <p class="form-status" role="alert" hidden></p>
          </form>`;
}

/* Ajusta los encabezados del contenido importado: empiezan en h2 y no se saltan niveles */
function fixHeadings(html) {
  const open = [];
  let prev = 1;
  return html.replace(/<(\/?)h([1-6])(\s[^>]*)?>/g, (all, close, level, attrs = "") => {
    if (close) return `</h${open.pop() || level}>`;
    const next = Math.min(Math.max(+level, 2), prev + 1);
    prev = next;
    open.push(next);
    return `<h${next}${attrs}>`;
  });
}

/* Quita el enlace (conserva el texto) a productos que ya no están en el catálogo */
const unlinkRetired = (html, productIds) =>
  html.replace(/<a href="producto\.html\?id=(\d+)"[^>]*>([\s\S]*?)<\/a>/g, (all, id, text) => (productIds.has(+id) ? all : text));

module.exports = { blog, summary, brandTiles, storeCard, blogCards, newsletterForm, fixHeadings, unlinkRetired };
