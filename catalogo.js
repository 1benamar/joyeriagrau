/* Joieria Grau — catálogo (listado, filtros y ficha de producto). Patrón IIFE, sin módulos. */
(function () {
  "use strict";

  var DATA_URL = "data/catalogo.json";
  var PRODUCT_URL = function (id) { return "data/productos/" + id + ".json"; };
  var IMG = function (imgId, slug, size) { return "https://joieriagrau.com/" + imgId + "-" + (size || "medium_default") + "/" + slug + ".jpg"; };
  var WHATSAPP = "34972364222";
  var PAGE = 48;

  // Índices de cada producto en catalogo.json
  var I = { id: 0, slug: 1, name: 2, brand: 3, price: 4, regular: 5, sec: 6, cat: 7, tags: 8, img: 9, img2: 10, stock: 11, rank: 12 };

  var SECTIONS = {
    joyas: { label: "Joyas", lead: "Luce tu verdadera esencia. Anillos, pendientes, collares y pulseras de Grau y de las mejores firmas internacionales." },
    relojes: { label: "Relojes", lead: "El reloj perfecto para hombre y mujer, de las firmas internacionales más prestigiosas." },
    accesorios: { label: "Accesorios", lead: "Escritura, piel, gemelos y complementos de las mejores firmas." },
    preowned: { label: "Pre-owned", lead: "Relojes y joyas excepcionales, restaurados y certificados en nuestro taller." }
  };
  var GROUPS = [
    { key: "cat", label: "Tipo de joya", only: ["joyas"], values: { anillos: "Anillos", pendientes: "Pendientes", collares: "Collares", colgantes: "Colgantes", pulseras: "Pulseras", cadenas: "Cadenas", medallas: "Medallas", charms: "Charms" } },
    { key: "cat", label: "Categoría", only: ["accesorios"], values: { escritura: "Escritura", piel: "Piel", gemelos: "Gemelos", gafas: "Gafas de sol", otros: "Otros accesorios" } },
    { key: "cat", label: "Categoría", only: ["preowned"], values: { "po-relojes": "Relojes pre-owned", "po-joyas": "Joyas pre-owned" } },
    { key: "cat", label: "Categoría", only: [""], values: { anillos: "Anillos", pendientes: "Pendientes", collares: "Collares", colgantes: "Colgantes", pulseras: "Pulseras", relojes: "Relojes", escritura: "Escritura", gemelos: "Gemelos" } },
    { key: "tipo", label: "Mecanismo", only: ["relojes"], values: { automatico: "Automático", cuarzo: "Cuarzo", cuerda: "Cuerda manual", smartwatch: "Smartwatch" } },
    { key: "para", label: "Para", values: { mujer: "Mujer", hombre: "Hombre", unisex: "Unisex", infantil: "Infantil", bebe: "Bebé" } },
    { key: "ocasion", label: "Ocasión", values: { novia: "Novia y boda", compromiso: "Compromiso", comunion: "Comunión", bautizo: "Bautizo" } },
    { key: "coleccion", label: "Colecciones Grau", only: ["joyas", ""], values: { aura: "Aura", halo: "Halo", zodiaco: "Zodiaco", "good-mood": "Good Mood", "my-essence": "My Essence", rainbow: "Rainbow" } },
    { key: "marca", label: "Marca", brands: true },
    { key: "precio", label: "Precio", values: { "0-100": "Hasta 100 €", "100-300": "100 € – 300 €", "300-1000": "300 € – 1.000 €", "1000-3000": "1.000 € – 3.000 €", "3000-10000": "3.000 € – 10.000 €", "10000-": "Más de 10.000 €" } },
    { key: "stock", label: "Disponibilidad", values: { "1": "Solo en stock" } }
  ];
  var LISTS = { novedades: "Novedades", promociones: "Promociones", "mas-vendidos": "Los más vendidos" };
  var SORTS = { destacados: "Destacados", "precio-asc": "Precio: de menor a mayor", "precio-desc": "Precio: de mayor a menor", nombre: "Nombre: A – Z" };

  var money = function (n) {
    if (n == null || !(n > 0)) return "Consultar precio";
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(n);
  };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var norm = function (s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };

  var catalogPromise = null;
  function loadCatalog() {
    if (!catalogPromise) {
      catalogPromise = fetch(DATA_URL).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
    }
    return catalogPromise;
  }

  function cardHTML(p, brands) {
    var brand = brands[p[I.brand]] || "";
    var badge = p[I.sec] === "preowned" ? "Pre-owned" : (p[I.regular] > p[I.price] ? "Oferta" : "");
    var alt = p[I.img2] ? '<img class="pcard__alt" src="' + IMG(p[I.img2], p[I.slug]) + '" alt="" loading="lazy" decoding="async">' : "";
    var img = p[I.img] ? '<img src="' + IMG(p[I.img], p[I.slug]) + '" alt="' + esc(p[I.name]) + '" loading="lazy" decoding="async" width="600" height="600">' : '<span class="pcard__noimg">Grau</span>';
    return '<a class="pcard" href="producto.html?id=' + p[I.id] + '">' +
      '<div class="pcard__img">' + img + alt + (badge ? '<span class="pcard__badge">' + badge + "</span>" : "") + "</div>" +
      '<div class="pcard__body">' + (brand ? '<span class="pcard__brand">' + esc(brand) + "</span>" : "") +
      '<h3 class="pcard__name">' + esc(p[I.name]) + "</h3>" +
      '<span class="pcard__price">' + (p[I.regular] > p[I.price] ? "<s>" + money(p[I.regular]) + "</s> " : "") + money(p[I.price]) + "</span></div></a>";
  }

  /* ------------------------------------------------------------------ */
  /* LISTADO                                                             */
  /* ------------------------------------------------------------------ */
  function initListing() {
    var root = document.querySelector("[data-catalog]");
    if (!root) return;
    var grid = root.querySelector("[data-grid]");
    var countEl = root.querySelector("[data-count]");
    var moreBtn = root.querySelector("[data-more]");
    var progress = root.querySelector("[data-progress]");
    var filtersEl = document.querySelector("[data-filters]");
    var activeEl = root.querySelector("[data-active]");
    var searchEl = root.querySelector("[data-search]");
    var sortEl = root.querySelector("[data-sort]");
    var titleEl = document.querySelector("[data-cat-title]");
    var leadEl = document.querySelector("[data-cat-lead]");
    var crumbEl = document.querySelector("[data-cat-crumb]");
    var sectionsNav = document.querySelector("[data-cat-sections]");

    var state = readState();
    var DB, brands, shown = 0, results = [];

    sortEl.innerHTML = Object.keys(SORTS).map(function (k) { return '<option value="' + k + '">' + SORTS[k] + "</option>"; }).join("");

    function readState() {
      var q = new URLSearchParams(location.search);
      var s = { seccion: q.get("seccion") || "", q: q.get("q") || "", orden: q.get("orden") || "destacados", lista: q.get("lista") || "" };
      GROUPS.forEach(function (g) { s[g.key] = (q.get(g.key) || "").split(",").filter(Boolean); });
      if (!SECTIONS[s.seccion]) s.seccion = "";
      return s;
    }
    function writeState() {
      var q = new URLSearchParams();
      if (state.seccion) q.set("seccion", state.seccion);
      if (state.lista) q.set("lista", state.lista);
      var seen = {};
      GROUPS.forEach(function (g) { if (!seen[g.key] && state[g.key].length) { q.set(g.key, state[g.key].join(",")); seen[g.key] = 1; } });
      if (state.q) q.set("q", state.q);
      if (state.orden && state.orden !== "destacados") q.set("orden", state.orden);
      var url = location.pathname + (q.toString() ? "?" + q.toString() : "");
      history.replaceState(null, "", url);
    }

    function matches(p, skipKey) {
      if (state.seccion && p[I.sec] !== state.seccion) return false;
      var tags = " " + p[I.tags] + " ";
      if (state.lista && tags.indexOf(" l-" + state.lista + " ") < 0) return false;
      for (var gi = 0; gi < GROUPS.length; gi++) {
        var key = GROUPS[gi].key;
        if (key === skipKey || (gi > 0 && GROUPS[gi - 1].key === key)) continue;
        var vals = state[key];
        if (!vals.length) continue;
        var ok = false;
        for (var v = 0; v < vals.length && !ok; v++) {
          var val = vals[v];
          if (key === "marca") ok = p[I.brand] === val;
          else if (key === "cat") ok = p[I.cat] === val || tags.indexOf(" c-" + val + " ") >= 0 || (val === "relojes" && p[I.sec] === "relojes");
          else if (key === "precio") { var r = val.split("-"); var min = +r[0] || 0, max = r[1] ? +r[1] : Infinity; ok = p[I.price] >= min && p[I.price] < max; }
          else if (key === "stock") ok = p[I.stock] === 1;
          else ok = tags.indexOf(" " + key + "-" + val + " ") >= 0;
        }
        if (!ok) return false;
      }
      if (state.q) {
        var terms = norm(state.q).split(/\s+/).filter(Boolean);
        var hay = norm(p[I.name] + " " + (brands[p[I.brand]] || "") + " " + p[I.cat]);
        for (var t = 0; t < terms.length; t++) if (hay.indexOf(terms[t]) < 0) return false;
      }
      return true;
    }

    function sortResults(list) {
      var o = state.orden;
      if (o === "precio-asc") list.sort(function (a, b) { return (a[I.price] || 1e12) - (b[I.price] || 1e12); });
      else if (o === "precio-desc") list.sort(function (a, b) { return (b[I.price] || 0) - (a[I.price] || 0); });
      else if (o === "nombre") list.sort(function (a, b) { return a[I.name].localeCompare(b[I.name], "es"); });
      else list.sort(function (a, b) { return (b[I.stock] - a[I.stock]) || (a[I.rank] - b[I.rank]); });
      return list;
    }

    function groupVisible(g) {
      if (!g.only) return true;
      return g.only.indexOf(state.seccion) >= 0;
    }

    function renderFilters() {
      var html = "";
      var rendered = {};
      GROUPS.forEach(function (g) {
        if (!groupVisible(g) || rendered[g.key]) return;
        // Recuento con el resto de filtros aplicados
        var counts = {};
        for (var i = 0; i < DB.length; i++) {
          var p = DB[i];
          if (!matches(p, g.key)) continue;
          if (g.key === "marca") { if (p[I.brand]) counts[p[I.brand]] = (counts[p[I.brand]] || 0) + 1; }
          else if (g.key === "cat") {
            var cs = {}; cs[p[I.cat]] = 1;
            if (p[I.sec] === "relojes") cs.relojes = 1;
            p[I.tags].split(" ").forEach(function (t) { if (t.indexOf("c-") === 0) cs[t.slice(2)] = 1; });
            Object.keys(cs).forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
          }
          else if (g.key === "precio") Object.keys(g.values).forEach(function (k) { var r = k.split("-"); if (p[I.price] >= (+r[0] || 0) && p[I.price] < (r[1] ? +r[1] : Infinity)) counts[k] = (counts[k] || 0) + 1; });
          else if (g.key === "stock") { if (p[I.stock] === 1) counts["1"] = (counts["1"] || 0) + 1; }
          else p[I.tags].split(" ").forEach(function (t) { if (t.indexOf(g.key + "-") === 0) { var v = t.slice(g.key.length + 1); counts[v] = (counts[v] || 0) + 1; } });
        }
        var entries;
        if (g.brands) {
          entries = Object.keys(counts).map(function (k) { return [k, brands[k] || k, counts[k]]; }).sort(function (a, b) { return a[1].localeCompare(b[1], "es"); });
        } else {
          entries = Object.keys(g.values).map(function (k) { return [k, g.values[k], counts[k] || 0]; });
        }
        entries = entries.filter(function (e) { return e[2] > 0 || state[g.key].indexOf(e[0]) >= 0; });
        if (!entries.length) return;
        rendered[g.key] = true;
        var open = state[g.key].length || ["cat", "marca", "tipo"].indexOf(g.key) >= 0;
        var many = g.brands && entries.length > 10;
        html += '<details class="filter"' + (open ? " open" : "") + '><summary>' + g.label + (state[g.key].length ? " <b>(" + state[g.key].length + ")</b>" : "") + "</summary>" +
          (many ? '<input class="filter__search" type="search" placeholder="Buscar marca" data-brand-search>' : "") +
          '<ul class="filter__list' + (many ? " filter__list--scroll" : "") + '">' +
          entries.map(function (e) {
            var checked = state[g.key].indexOf(e[0]) >= 0;
            return '<li><label class="check"><input type="checkbox" data-key="' + g.key + '" value="' + esc(e[0]) + '"' + (checked ? " checked" : "") + '><span class="check__box"></span><span class="check__label">' + esc(e[1]) + '</span><span class="check__count">' + e[2] + "</span></label></li>";
          }).join("") + "</ul></details>";
      });
      filtersEl.querySelector("[data-filters-body]").innerHTML = html || '<p class="filter__empty">No hay filtros disponibles.</p>';
    }

    function renderActive() {
      var chips = [];
      if (state.lista) chips.push(["lista", state.lista, LISTS[state.lista]]);
      GROUPS.forEach(function (g) {
        state[g.key].forEach(function (v) {
          if (chips.some(function (c) { return c[0] === g.key && c[1] === v; })) return;
          chips.push([g.key, v, g.brands ? (brands[v] || v) : labelFor(g.key, v)]);
        });
      });
      if (state.q) chips.push(["q", state.q, "«" + state.q + "»"]);
      activeEl.innerHTML = chips.map(function (c) { return '<button type="button" class="chip-x" data-remove="' + c[0] + '" data-value="' + esc(c[1]) + '">' + esc(c[2]) + ' <span aria-hidden="true">×</span></button>'; }).join("") +
        (chips.length ? '<button type="button" class="chip-x chip-x--clear" data-clear>Borrar filtros</button>' : "");
    }

    function labelFor(key, value) {
      for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].key === key && GROUPS[i].values && GROUPS[i].values[value]) return GROUPS[i].values[value];
      return value;
    }

    function renderHeader() {
      var sec = SECTIONS[state.seccion];
      var title = sec ? sec.label : "Tienda";
      if (state.lista) title = LISTS[state.lista] || title;
      if (state.coleccion.length === 1) title = "Colección " + labelFor("coleccion", state.coleccion[0]);
      else if (state.cat.length === 1) title = labelFor("cat", state.cat[0]);
      else if (state.tipo.length === 1) title = "Relojes " + labelFor("tipo", state.tipo[0]).toLowerCase();
      if (state.ocasion.length === 1 && !state.cat.length) title = (sec ? sec.label : "Joyas") + " · " + labelFor("ocasion", state.ocasion[0]);
      if (state.para.length === 1) title += " para " + labelFor("para", state.para[0]).toLowerCase();
      if (state.marca.length === 1) title += " " + (brands[state.marca[0]] || state.marca[0]);
      if (state.q && !state.marca.length && !state.cat.length) title = "Resultados para «" + state.q + "»";
      titleEl.textContent = title;
      leadEl.textContent = sec ? sec.lead : "Joyas, relojes y accesorios de Joyería Grau y de las mejores firmas internacionales.";
      document.title = title + " · Joyería Grau";
      if (crumbEl) crumbEl.innerHTML = '<a href="index.html">Inicio</a><i aria-hidden="true"></i><a href="catalogo.html">Tienda</a>' + (sec ? '<i aria-hidden="true"></i><a href="catalogo.html?seccion=' + state.seccion + '">' + sec.label + "</a>" : "");
      if (sectionsNav) [].forEach.call(sectionsNav.querySelectorAll("a"), function (a) {
        var s = new URLSearchParams(a.getAttribute("href").split("?")[1] || "").get("seccion") || "";
        if (s === state.seccion && !state.lista) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
    }

    function run(resetScroll) {
      results = sortResults(DB.filter(function (p) { return matches(p); }));
      shown = 0;
      grid.innerHTML = "";
      renderMore();
      countEl.textContent = results.length === 1 ? "1 producto" : results.length.toLocaleString("es-ES") + " productos";
      renderHeader();
      renderFilters();
      renderActive();
      writeState();
      if (!results.length) grid.innerHTML = '<div class="catalog__empty"><h3 class="h3">No hemos encontrado productos</h3><p>Prueba a quitar algún filtro o a buscar otra palabra. También puedes preguntarnos: te ayudamos a encontrar la pieza.</p><div class="split__actions"><button type="button" class="btn btn--ghost" data-clear>Borrar filtros</button><a class="btn" href="https://wa.me/' + WHATSAPP + '">Preguntar por WhatsApp</a></div></div>';
      if (resetScroll) { var top = root.getBoundingClientRect().top + window.scrollY - 120; if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" }); }
    }

    function renderMore() {
      var next = results.slice(shown, shown + PAGE);
      grid.insertAdjacentHTML("beforeend", next.map(function (p) { return cardHTML(p, brands); }).join(""));
      shown += next.length;
      moreBtn.hidden = shown >= results.length;
      progress.textContent = results.length ? "Mostrando " + shown.toLocaleString("es-ES") + " de " + results.length.toLocaleString("es-ES") : "";
    }

    // Eventos
    moreBtn.addEventListener("click", renderMore);
    filtersEl.addEventListener("change", function (e) {
      var input = e.target.closest("input[data-key]");
      if (!input) return;
      var key = input.getAttribute("data-key");
      var list = state[key];
      var i = list.indexOf(input.value);
      if (input.checked && i < 0) list.push(input.value);
      if (!input.checked && i >= 0) list.splice(i, 1);
      run(true);
    });
    filtersEl.addEventListener("input", function (e) {
      if (!e.target.matches("[data-brand-search]")) return;
      var term = norm(e.target.value);
      [].forEach.call(e.target.nextElementSibling.querySelectorAll("li"), function (li) { li.hidden = term && norm(li.textContent).indexOf(term) < 0; });
    });
    document.addEventListener("click", function (e) {
      var rm = e.target.closest("[data-remove]");
      if (rm) {
        var key = rm.getAttribute("data-remove"), val = rm.getAttribute("data-value");
        if (key === "q") { state.q = ""; searchEl.value = ""; }
        else if (key === "lista") state.lista = "";
        else state[key] = state[key].filter(function (v) { return v !== val; });
        run(true); return;
      }
      if (e.target.closest("[data-clear]")) {
        GROUPS.forEach(function (g) { state[g.key] = []; });
        state.q = ""; state.lista = ""; searchEl.value = "";
        run(true); return;
      }
      var sectionLink = e.target.closest("[data-cat-sections] a");
      if (sectionLink) {
        e.preventDefault();
        var s = new URLSearchParams(sectionLink.getAttribute("href").split("?")[1] || "");
        GROUPS.forEach(function (g) { state[g.key] = []; });
        state.seccion = s.get("seccion") || ""; state.lista = s.get("lista") || ""; state.q = ""; searchEl.value = "";
        run(true);
      }
    });
    var searchTimer;
    searchEl.value = state.q;
    searchEl.addEventListener("input", function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () { state.q = searchEl.value.trim(); run(false); }, 220);
    });
    sortEl.value = SORTS[state.orden] ? state.orden : "destacados";
    sortEl.addEventListener("change", function () { state.orden = sortEl.value; run(false); });

    // Panel de filtros en móvil
    var openBtn = root.querySelector("[data-filters-open]");
    function setPanel(open) {
      filtersEl.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
    }
    if (openBtn) openBtn.addEventListener("click", function () { setPanel(true); });
    [].forEach.call(filtersEl.querySelectorAll("[data-filters-close]"), function (b) { b.addEventListener("click", function () { setPanel(false); }); });

    grid.innerHTML = '<p class="catalog__loading">Cargando el catálogo…</p>';
    loadCatalog().then(function (data) {
      DB = data.items; brands = data.brands;
      if (state.marca.length) state.marca = state.marca.filter(function (m) { return brands[m]; });
      run(false);
    }).catch(function () {
      grid.innerHTML = '<div class="catalog__empty"><h3 class="h3">No se ha podido cargar el catálogo</h3><p>Vuelve a intentarlo en unos segundos o escríbenos por WhatsApp y te ayudamos.</p></div>';
    });
  }

  /* ------------------------------------------------------------------ */
  /* FICHA DE PRODUCTO                                                   */
  /* ------------------------------------------------------------------ */
  function initProduct() {
    var root = document.querySelector("[data-product]");
    if (!root) return;
    var id = +new URLSearchParams(location.search).get("id");
    var fail = function () {
      root.innerHTML = '<div class="wrap catalog__empty" style="padding:80px 0"><h1 class="h2">No encontramos este producto</h1><p>Puede que ya no esté disponible. Explora el catálogo o pregúntanos por WhatsApp.</p><div class="split__actions"><a class="btn" href="catalogo.html">Ver el catálogo</a><a class="btn btn--ghost" href="https://wa.me/' + WHATSAPP + '">WhatsApp</a></div></div>';
    };
    if (!id) return fail();

    Promise.all([fetch(PRODUCT_URL(id)).then(function (r) { if (!r.ok) throw 0; return r.json(); }), loadCatalog()]).then(function (res) {
      var p = res[0], data = res[1], brands = data.brands;
      var brandName = brands[p.brand] || p.brandName || "";
      var sec = SECTIONS[p.sec] ? p.sec : "";
      document.title = p.name + " · Joyería Grau";
      var meta = document.querySelector('meta[name="description"]');
      if (meta && p.short) meta.setAttribute("content", p.short.slice(0, 160));

      var images = (p.images || []).map(function (im) { return { large: IMG(im, p.slug, "large_default"), medium: IMG(im, p.slug, "medium_default") }; });
      var talla = "";
      var waText = function () {
        return "Hola, me interesa este producto de Joyería Grau: " + p.name + (p.reference ? " (Ref. " + p.reference + ")" : "") + (talla ? " · " + talla : "") + ". " + location.href;
      };
      var catLabel = p.cat ? (function () { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].key === "cat" && GROUPS[i].values[p.cat]) return GROUPS[i].values[p.cat]; return ""; })() : "";
      var available = p.stock ? (p.availabilityText || "En stock") : "Consultar disponibilidad";

      root.innerHTML =
        '<div class="wrap">' +
        '<nav class="crumbs" aria-label="Ruta"><a href="index.html">Inicio</a><i aria-hidden="true"></i><a href="catalogo.html">Tienda</a>' +
        (sec ? '<i aria-hidden="true"></i><a href="catalogo.html?seccion=' + sec + '">' + SECTIONS[sec].label + "</a>" : "") +
        (catLabel && sec !== "relojes" ? '<i aria-hidden="true"></i><a href="catalogo.html?seccion=' + sec + "&cat=" + p.cat + '">' + catLabel + "</a>" : "") +
        '<i aria-hidden="true"></i><span aria-current="page">' + esc(p.name) + "</span></nav>" +
        '<div class="pdp">' +
        '<div class="pdp__gallery">' +
        '<figure class="pdp__main">' + (images[0] ? '<img src="' + images[0].large + '" alt="' + esc(p.name) + '" width="1200" height="1200" data-main>' : '<span class="pcard__noimg">Grau</span>') + "</figure>" +
        (images.length > 1 ? '<div class="pdp__thumbs">' + images.map(function (im, i) { return '<button type="button" class="pdp__thumb' + (i ? "" : " is-active") + '" data-large="' + im.large + '" aria-label="Ver imagen ' + (i + 1) + '"><img src="' + im.medium + '" alt="" loading="lazy"></button>'; }).join("") + "</div>" : "") +
        "</div>" +
        '<div class="pdp__info">' +
        (brandName ? '<a class="pdp__brand" href="catalogo.html?marca=' + p.brand + '">' + esc(brandName) + "</a>" : "") +
        '<h1 class="pdp__name">' + esc(p.name) + "</h1>" +
        (p.reference ? '<p class="pdp__ref">Ref. ' + esc(p.reference) + "</p>" : "") +
        '<p class="pdp__price">' + (p.regularPrice > p.price ? "<s>" + money(p.regularPrice) + "</s> " : "") + money(p.price) + (p.price > 0 ? " <small>IVA incluido</small>" : "") + "</p>" +
        '<p class="pdp__stock' + (p.stock ? " is-in" : "") + '">' + esc(available) + "</p>" +
        (p.short ? '<p class="pdp__short">' + esc(p.short) + "</p>" : "") +
        (p.variants && p.variants.length ? p.variants.map(function (v) { return '<fieldset class="chips pdp__variants"><legend>' + esc(v.label) + "</legend>" + v.options.map(function (o) { return '<label class="chip"><input type="radio" name="v-' + esc(v.label) + '" value="' + esc(o) + '" data-variant="' + esc(v.label) + '"><span>' + esc(o) + "</span></label>"; }).join("") + "</fieldset>"; }).join("") : "") +
        '<div class="pdp__actions">' +
        '<a class="btn btn--full" data-wa target="_blank" rel="noopener" href="#">Reservar por WhatsApp <span class="arrow"></span></a>' +
        '<a class="btn btn--ghost btn--full" href="cita.html?producto=' + p.id + (sec === "relojes" ? "&servicio=relojes" : sec === "preowned" ? "&servicio=preowned" : "&servicio=joyas") + '">Pedir cita para verlo en boutique</a>' +
        "</div>" +
        '<ul class="pdp__perks">' +
        "<li>Asesoramiento personalizado de nuestro equipo</li>" +
        "<li>Consulta disponibilidad en nuestras 4 boutiques</li>" +
        "<li>Envío gratuito en pedidos superiores a 75 €</li>" +
        "<li>¿Dudas? Llámanos al <a href=\"tel:+34935193303\">935 193 303</a></li>" +
        "</ul>" +
        '<div class="pdp__acc">' +
        (p.description ? '<details open><summary>Descripción</summary><div class="prose">' + p.description.split("\n").map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("") + "</div></details>" : "") +
        '<details' + (p.description ? "" : " open") + '><summary>Más información</summary><dl class="store-info pdp__specs">' +
        (p.reference ? "<dt>Referencia</dt><dd>" + esc(p.reference) + "</dd>" : "") +
        (brandName ? "<dt>Marca</dt><dd>" + esc(brandName) + "</dd>" : "") +
        (catLabel ? "<dt>Categoría</dt><dd>" + esc(catLabel) + "</dd>" : "") +
        (p.info || []).map(function (kv) { return "<dt>" + esc(kv[0] || "Detalle") + "</dt><dd>" + esc(kv[1]) + "</dd>"; }).join("") +
        "</dl>" + (p.sizeGuide ? '<p style="margin-top:14px"><a class="link-line" href="guia-de-tallas.html">Guía de tallas</a></p>' : "") + "</details>" +
        '<details><summary>Envíos y devoluciones</summary><div class="prose"><p>Envío gratuito en pedidos superiores a 75 €. Consulta las condiciones completas de <a href="envios.html">envío</a> y de <a href="devoluciones.html">devoluciones</a>.</p></div></details>' +
        "</div></div></div></div>";

      // Galería
      var main = root.querySelector("[data-main]");
      root.addEventListener("click", function (e) {
        var t = e.target.closest(".pdp__thumb");
        if (!t || !main) return;
        main.src = t.getAttribute("data-large");
        [].forEach.call(root.querySelectorAll(".pdp__thumb"), function (b) { b.classList.toggle("is-active", b === t); });
      });
      // WhatsApp con el producto y la talla elegida
      var wa = root.querySelector("[data-wa]");
      var updateWa = function () { wa.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(waText()); };
      root.addEventListener("change", function (e) {
        var v = e.target.closest("[data-variant]");
        if (v) { talla = v.getAttribute("data-variant") + ": " + v.value; updateWa(); }
      });
      updateWa();

      // Relacionados
      var byId = {};
      data.items.forEach(function (it) { byId[it[I.id]] = it; });
      var rel = (p.related || []).map(function (rid) { return byId[rid]; }).filter(Boolean);
      if (rel.length < 8) {
        data.items.forEach(function (it) {
          if (rel.length >= 8 || it[I.id] === p.id || rel.indexOf(it) >= 0) return;
          if (it[I.brand] === p.brand && it[I.sec] === p.sec && it[I.stock]) rel.push(it);
        });
      }
      var relEl = document.querySelector("[data-related]");
      if (relEl && rel.length) {
        relEl.hidden = false;
        relEl.querySelector("[data-related-grid]").innerHTML = rel.slice(0, 8).map(function (it) { return cardHTML(it, brands); }).join("");
        var more = relEl.querySelector("[data-related-more]");
        if (more && p.brand) { more.href = "catalogo.html?marca=" + p.brand; more.textContent = "Ver todo " + brandName; }
      }
    }).catch(fail);
  }

  /* Resumen del producto en el formulario de cita */
  function initCitaProduct() {
    var box = document.querySelector("[data-cita-product]");
    if (!box) return;
    var id = +new URLSearchParams(location.search).get("producto");
    if (!id) return;
    fetch(PRODUCT_URL(id)).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (p) {
      box.hidden = false;
      box.innerHTML = (p.images && p.images[0] ? '<img src="' + IMG(p.images[0], p.slug) + '" alt="" width="80" height="80">' : "") +
        '<div><small>Producto que quieres ver</small><b>' + esc(p.name) + "</b>" + (p.reference ? "<span>Ref. " + esc(p.reference) + "</span>" : "") + "</div>" +
        '<input type="hidden" name="producto" value="' + esc(p.name + (p.reference ? " (Ref. " + p.reference + ")" : "") + " · id " + p.id) + '">';
    }).catch(function () {});
  }

  /* Rejilla de productos de una marca (páginas de marca) */
  function initBrandGrid() {
    var grids = document.querySelectorAll("[data-brand-grid]");
    if (!grids.length) return;
    loadCatalog().then(function (data) {
      [].forEach.call(grids, function (grid) {
        var key = grid.getAttribute("data-brand-grid");
        var limit = +grid.getAttribute("data-limit") || 8;
        var list = data.items.filter(function (p) { return p[I.brand] === key; })
          .sort(function (a, b) { return (b[I.stock] - a[I.stock]) || (a[I.rank] - b[I.rank]); }).slice(0, limit);
        grid.innerHTML = list.length ? list.map(function (p) { return cardHTML(p, data.brands); }).join("") : '<p class="catalog__empty">Consulta los modelos disponibles en boutique.</p>';
      });
    }).catch(function () { [].forEach.call(grids, function (g) { g.innerHTML = ""; }); });
  }

  function boot() {
    if (location.hash === "#buscar") { var s = document.querySelector("[data-search]"); if (s) setTimeout(function () { s.focus(); }, 300); }
    [initListing, initProduct, initCitaProduct, initBrandGrid].forEach(function (fn) { try { fn(); } catch (e) { if (window.console) console.warn("[catálogo]", e); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
