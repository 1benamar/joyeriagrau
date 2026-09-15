/* Joieria Grau — interacciones generales. Patrón IIFE, sin módulos. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.remove("no-js");

  // Rutas relativas a la carpeta de este script (funciona también en blog/ y en la página 404)
  var script = document.currentScript || document.querySelector('script[src*="main.js"]');
  var BASE = script ? script.src.replace(/main\.js(\?.*)?$/, "") : "";
  var FORM_ENDPOINT = BASE + "api/formulario.php";
  var CONTACT = { email: "hola@joieriagrau.com", tel: "+34935193303", telText: "935 193 303", whatsapp: "https://wa.me/34972364222" };

  var reducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.error("[grau] " + name, e); }
  }

  /* Cabecera: sombra al hacer scroll */
  function initHeader() {
    var header = document.querySelector(".header");
    if (!header) return;
    var onScroll = function () { header.classList.toggle("is-solid", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Menú móvil */
  function initDrawer() {
    var burger = document.querySelector(".burger");
    var drawer = document.querySelector(".drawer");
    if (!burger || !drawer) return;
    var isOpen = function () { return burger.getAttribute("aria-expanded") === "true"; };
    function set(open, restoreFocus) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      drawer.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) { var first = drawer.querySelector("a"); if (first) setTimeout(function () { first.focus(); }, 50); }
      else if (restoreFocus) burger.focus();
    }
    burger.addEventListener("click", function () { set(!isOpen(), false); });
    drawer.addEventListener("click", function (e) { if (e.target.closest("a")) set(false, false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen()) set(false, true); });
    // Si se amplía la ventana con el menú abierto, se cierra para no bloquear el scroll
    window.addEventListener("resize", function () { if (isOpen() && window.innerWidth > 900) set(false, false); });
  }

  /* Aparición suave al entrar en pantalla */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    var showAll = function () { els.forEach(function (el) { el.classList.add("is-in"); }); };
    if (reducedMotion || !("IntersectionObserver" in window)) return showAll();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
    // Si el navegador no llega a notificar algún elemento, se muestra igualmente
    setTimeout(showAll, 6000);
  }

  /* Hero: pase de imágenes con selección manual */
  function initHeroSlides() {
    var frame = document.querySelector("[data-hero-slides]");
    if (!frame) return;
    var slides = [].slice.call(frame.querySelectorAll(".hero__slide"));
    var dots = [].slice.call(frame.querySelectorAll(".hero__dots button"));
    var label = frame.querySelector("[data-hero-label]");
    var index = frame.querySelector("[data-hero-index]");
    if (slides.length < 2 || dots.length !== slides.length) return;

    var INTERVAL = 6000;
    var current = 0, timer = null, hoverPaused = false;
    frame.style.setProperty("--hero-interval", INTERVAL / 1000 + "s");

    function go(n) {
      if (n === current) return;
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      dots[current].setAttribute("aria-pressed", "false");
      current = (n + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
      dots[current].setAttribute("aria-pressed", "true");
      if (index) index.textContent = ("0" + (current + 1)).slice(-2);
      if (label) {
        label.classList.add("is-changing");
        setTimeout(function () {
          label.textContent = dots[current].getAttribute("data-label");
          label.setAttribute("href", dots[current].getAttribute("data-href"));
          label.classList.remove("is-changing");
        }, 350);
      }
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      var paused = reducedMotion || hoverPaused || document.hidden;
      frame.classList.toggle("is-paused", paused);
      if (paused) return;
      // Reinicia la barra de progreso para que coincida con el temporizador
      var dot = dots[current];
      dot.classList.remove("is-active"); void dot.offsetWidth; dot.classList.add("is-active");
      timer = setTimeout(function () { go(current + 1); }, INTERVAL);
    }

    dots.forEach(function (dot, i) { dot.addEventListener("click", function () { go(i); }); });
    frame.addEventListener("mouseenter", function () { hoverPaused = true; schedule(); });
    frame.addEventListener("mouseleave", function () { hoverPaused = false; schedule(); });
    frame.addEventListener("focusin", function () { hoverPaused = true; schedule(); });
    frame.addEventListener("focusout", function () { hoverPaused = false; schedule(); });
    document.addEventListener("visibilitychange", schedule);
    schedule();
  }

  /* Hero: tarjeta que va mostrando las boutiques */
  function initHeroStores() {
    var box = document.querySelector("[data-hero-stores]");
    if (!box) return;
    var cards = [].slice.call(box.querySelectorAll(".hero__inset"));
    if (cards.length < 2 || reducedMotion) return;

    var INTERVAL = 4500;
    var current = 0, timer = null, hovering = false;

    function show(n) {
      var prev = cards[current];
      current = (n + cards.length) % cards.length;
      var next = cards[current];
      prev.classList.remove("is-active");
      prev.classList.add("is-leaving");
      prev.setAttribute("aria-hidden", "true");
      prev.setAttribute("tabindex", "-1");
      next.classList.remove("is-leaving");
      next.classList.add("is-active");
      next.removeAttribute("aria-hidden");
      next.removeAttribute("tabindex");
      setTimeout(function () { prev.classList.remove("is-leaving"); }, 750);
    }

    function schedule() {
      clearTimeout(timer);
      if (hovering || document.hidden) return;
      timer = setTimeout(function () { show(current + 1); schedule(); }, INTERVAL);
    }

    box.addEventListener("mouseenter", function () { hovering = true; schedule(); });
    box.addEventListener("mouseleave", function () { hovering = false; schedule(); });
    box.addEventListener("focusin", function () { hovering = true; schedule(); });
    box.addEventListener("focusout", function () { hovering = false; schedule(); });
    document.addEventListener("visibilitychange", schedule);
    schedule();
  }

  /* Parallax sutil en imágenes marcadas con data-parallax (solo escritorio) */
  function initParallax() {
    var items = [].slice.call(document.querySelectorAll("[data-parallax]"));
    if (!items.length || reducedMotion) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (img) {
        if (window.innerWidth <= 900) { img.style.transform = ""; return; }
        var box = img.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        var progress = (box.top + box.height / 2 - vh / 2) / vh;
        img.style.transform = "translate3d(0," + (progress * -60).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------ */
  /* Formularios (newsletter y cita previa)                              */
  /* ------------------------------------------------------------------ */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function holderOf(el) { return el.closest(".field") || el.closest(".consent"); }

  function isValid(el) {
    if (el.type === "checkbox") return el.checked;
    var v = (el.value || "").trim();
    if (!v) return false;
    if (el.type === "email") return emailRe.test(v);
    if (el.type === "tel") return v.replace(/\D/g, "").length >= 9;
    return true;
  }

  function markField(el, bad) {
    var holder = holderOf(el);
    if (holder) holder.classList.toggle("is-invalid", bad);
    if (bad) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
  }

  function setupForm(form, messages) {
    var box = form.closest(".nl-box") || form.parentElement;
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var required = [].slice.call(form.querySelectorAll("[required]"));

    required.forEach(function (el) {
      var evt = el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input";
      el.addEventListener(evt, function () { if (isValid(el)) markField(el, false); });
    });

    function showStatus(html) {
      if (!status) return;
      status.innerHTML = html;
      status.hidden = !html;
    }

    function setBusy(busy) {
      if (!button) return;
      button.disabled = busy;
      if (busy) button.setAttribute("aria-busy", "true"); else button.removeAttribute("aria-busy");
    }

    function success() {
      box.classList.add("is-sent");
      var msg = box.querySelector(".nl-success");
      if (msg) {
        msg.focus({ preventScroll: true });
        var top = box.getBoundingClientRect().top;
        if (top < 80 || top > window.innerHeight * 0.6) box.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showStatus("");
      var firstBad = null;
      required.forEach(function (el) {
        var ok = isValid(el);
        markField(el, !ok);
        if (!ok && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }

      setBusy(true);
      var controller = "AbortController" in window ? new AbortController() : null;
      var timeout = setTimeout(function () { if (controller) controller.abort(); }, 15000);

      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return null; }).then(function (data) {
          if (res.ok && data && data.ok === true) return;
          var error = new Error("HTTP " + res.status);
          error.fields = data && data.campos;
          throw error;
        });
      }).then(function () {
        clearTimeout(timeout);
        setBusy(false);
        success();
      }).catch(function (err) {
        clearTimeout(timeout);
        setBusy(false);
        if (err && err.fields && err.fields.length) {
          var first = null;
          err.fields.forEach(function (name) {
            var el = form.querySelector('[name="' + name + '"]');
            if (el) { markField(el, true); if (!first) first = el; }
          });
          showStatus(messages.invalid);
          if (first) first.focus();
        } else {
          showStatus(messages.failed);
        }
      });
    });
  }

  function initForms() {
    var mail = '<a href="mailto:' + CONTACT.email + '">' + CONTACT.email + "</a>";
    [].forEach.call(document.querySelectorAll('form[data-form="newsletter"]'), function (form) {
      setupForm(form, {
        invalid: "Revisa los campos marcados e inténtalo de nuevo.",
        failed: "No hemos podido completar la suscripción en este momento. Inténtalo de nuevo más tarde o escríbenos a " + mail + "."
      });
    });
    var cita = document.querySelector('form[data-form="cita"]');
    if (cita) {
      prefillCita(cita);
      setupForm(cita, {
        invalid: "Revisa los campos marcados e inténtalo de nuevo.",
        failed: 'No hemos podido enviar tu solicitud en este momento. Llámanos al <a href="tel:' + CONTACT.tel + '">' + CONTACT.telText + '</a>, escríbenos por <a href="' + CONTACT.whatsapp + '" target="_blank" rel="noopener">WhatsApp</a> o a ' + mail + "."
      });
    }
  }

  /* Cita previa: preselección desde la URL (cita.html?tienda=barcelona&servicio=compromiso) */
  function prefillCita(form) {
    var params = new URLSearchParams(window.location.search);
    ["tienda", "servicio"].forEach(function (key) {
      var value = params.get(key);
      var select = form.querySelector('[name="' + key + '"]');
      if (!value || !select) return;
      for (var i = 0; i < select.options.length; i++) if (select.options[i].value === value) { select.value = value; break; }
    });
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
      var now = new Date();
      dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }
  }

  /* Blog: filtro por categoría y carga progresiva */
  function initBlog() {
    var grid = document.querySelector("[data-blog-grid]");
    if (!grid) return;
    var buttons = [].slice.call(document.querySelectorAll("[data-blog-cats] button"));
    var more = document.querySelector("[data-blog-more]");
    var status = document.querySelector("[data-blog-status]");
    var posts = [].slice.call(grid.children);
    var STEP = 12, limit = STEP;
    var current = decodeURIComponent((location.hash || "").slice(1));
    if (!buttons.some(function (b) { return b.getAttribute("data-cat") === current; })) current = "";

    function render(focusFrom) {
      var visible = 0, total = 0, firstNew = null;
      posts.forEach(function (p) {
        var match = !current || (" " + p.getAttribute("data-cats") + " ").indexOf(" " + current + " ") >= 0;
        var show = match && total < limit;
        if (show && focusFrom !== undefined && total === focusFrom) firstNew = p;
        p.hidden = !show;
        if (match) total++;
        if (show) visible++;
      });
      if (more) more.hidden = total <= limit;
      if (status) status.textContent = "Mostrando " + visible + " de " + total + " artículos";
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === current)); });
      if (firstNew) firstNew.focus();
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        current = b.getAttribute("data-cat");
        limit = STEP;
        history.replaceState(null, "", current ? "#" + current : location.pathname);
        render();
      });
    });
    if (more) more.addEventListener("click", function () { var from = limit; limit += STEP; render(from); });
    render();
  }

  function initYear() {
    [].forEach.call(document.querySelectorAll("[data-year]"), function (el) { el.textContent = new Date().getFullYear(); });
  }

  function boot() {
    safe(initHeader, "cabecera");
    safe(initDrawer, "menú");
    safe(initReveal, "animaciones");
    safe(initHeroSlides, "hero");
    safe(initHeroStores, "boutiques");
    safe(initParallax, "parallax");
    safe(initForms, "formularios");
    safe(initBlog, "blog");
    safe(initYear, "año");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
