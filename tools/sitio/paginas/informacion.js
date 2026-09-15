// Páginas de ayuda y legales. El contenido está en contenido/informacion/*.html.
const fs = require("fs");
const path = require("path");
const C = require("../lib/config");
const { pageHero } = require("../lib/plantilla");

const PAGES = [
  ["envios", "Envíos", "Ayuda"],
  ["devoluciones", "Política de devoluciones", "Ayuda"],
  ["preguntas-frecuentes", "Preguntas frecuentes", "Ayuda"],
  ["guia-de-tallas", "Guía de tallas", "Ayuda"],
  ["aviso-legal", "Aviso legal", "Legal"],
  ["terminos", "Términos y condiciones de uso", "Legal"],
  ["privacidad", "Política de privacidad", "Legal"],
  ["cookies", "Política de cookies", "Legal"],
  ["codigo-etico", "Código ético", "Legal"],
  ["accesibilidad", "Accesibilidad", "Legal"],
];

module.exports = function (site) {
  const nav = (current) => `<nav class="info-nav" aria-label="Información y ayuda">
            ${PAGES.map(([slug, title]) => `<a href="${slug}.html"${slug + ".html" === current ? ' aria-current="page"' : ""}>${title}</a>`).join("\n            ")}
            <a href="cita.html">Contacto y cita previa</a>
          </nav>`;

  for (const [slug, title, group] of PAGES) {
    const file = slug + ".html";
    const content = site.prose(fs.readFileSync(path.join(__dirname, "..", "contenido", "informacion", file), "utf8").trim());
    site.page(file, {
      title: `${title} · Joyería Grau`,
      description: site.summary(content, `${title} de Joyería Grau.`),
      body: pageHero({
        crumb: title, eyebrow: group, title,
        lead: group === "Ayuda"
          ? `Estamos aquí para resolver cualquier duda. Si no encuentras lo que buscas, escríbenos a ${C.email} o llámanos al ${C.telefono.texto}.`
          : "Información legal de Joieria Grau.",
      }) + `
    <section class="section">
      <div class="wrap info-layout">
        ${nav(file)}
        <article class="prose">
${content}
        </article>
      </div>
    </section>
`,
    });
  }
};
