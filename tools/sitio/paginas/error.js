// Página de error 404 (el servidor la sirve en cualquier ruta, por eso sus enlaces son absolutos).
module.exports = function (site) {
  site.page("404.html", {
    title: "Página no encontrada · Joyería Grau",
    description: "La página que buscas no existe o ha cambiado de dirección.",
    robots: "noindex",
    sitemap: false,
    prefix: "/",
    body: `
    <section class="page-hero page-hero--plain page-hero--error">
      <div class="wrap page-hero__grid">
        <div class="page-hero__text">
          <p class="eyebrow">Error 404</p>
          <h1 class="display page-hero__title">No encontramos esta página</h1>
          <p class="lead">Puede que la dirección haya cambiado o que la página ya no exista. Te ayudamos a encontrar lo que buscas.</p>
          <div class="hero__actions">
            <a class="btn" href="index.html">Ir al inicio <span class="arrow"></span></a>
            <a class="btn btn--ghost" href="catalogo.html">Ver la tienda</a>
          </div>
          <div class="brand-nav">
            <a href="joyas.html">Joyas</a><a href="relojes.html">Relojes</a><a href="compromiso.html">Compromiso</a><a href="tiendas.html">Tiendas</a><a href="cita.html">Pedir cita</a>
          </div>
        </div>
      </div>
    </section>
`,
  });
};
