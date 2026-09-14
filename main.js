/* Joieria Grau — interacciones. Patrón IIFE, sin módulos. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIGURACIÓN NEWSLETTER
     Pega aquí la URL de envío de tu proveedor (Brevo, Mailchimp, Klaviyo,
     un webhook de Make/Zapier o el endpoint de PrestaShop).
     Mientras esté vacío, el formulario valida y muestra el mensaje de
     éxito, pero NO guarda el email en ningún sitio.
     ------------------------------------------------------------------ */
  var NEWSLETTER_ENDPOINT = "";
  // Igual para el formulario de "Pedir cita" (cita.html)
  var CITA_ENDPOINT = "";

  var doc = document.documentElement;
  doc.classList.remove("no-js");

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[grau] " + name + " falló:", e); }
  }

  /* Cabecera: fondo sólido al hacer scroll */
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
    function set(open) {
      burger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }
    burger.addEventListener("click", function () { set(burger.getAttribute("aria-expanded") !== "true"); });
    drawer.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  /* Aparición suave al entrar en pantalla */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
    // Red de seguridad: nada se queda oculto
    setTimeout(function () { els.forEach(function (el) { el.classList.add("is-in"); }); }, 6000);
  }

  /* Hero: pase de imágenes con selección manual */
  function initHeroSlides() {
    var frame = document.querySelector("[data-hero-slides]");
    if (!frame) return;
    var slides = [].slice.call(frame.querySelectorAll(".hero__slide"));
    var dots = [].slice.call(frame.querySelectorAll(".hero__dots button"));
    var label = frame.querySelector("[data-hero-label]");
    var index = frame.querySelector("[data-hero-index]");
    if (slides.length < 2) return;

    var INTERVAL = 6000;
    var current = 0, timer = null;
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hoverPaused = false;
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
      if (!paused) {
        // reinicia la barra de progreso para que coincida con el temporizador
        var dot = dots[current];
        dot.classList.remove("is-active"); void dot.offsetWidth; dot.classList.add("is-active");
        timer = setTimeout(function () { go(current + 1); }, INTERVAL);
      }
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
    if (cards.length < 2) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

  /* Parallax sutil en imágenes marcadas con data-parallax */
  function initParallax() {
    var items = [].slice.call(document.querySelectorAll("[data-parallax]"));
    if (!items.length) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (img) {
        if (window.innerWidth <= 900) { img.style.transform = ""; return; }
        var box = img.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        var progress = (box.top + box.height / 2 - vh / 2) / vh; // -1..1
        img.style.transform = "translate3d(0," + (progress * -60).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* Formularios de newsletter */
  function initNewsletter() {
    var forms = [].slice.call(document.querySelectorAll("form.nl-form"));
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    forms.forEach(function (form) {
      var box = form.closest(".nl-box") || form.parentElement;
      var email = form.querySelector('input[type="email"]');
      var consent = form.querySelector('.consent input[type="checkbox"]');

      function mark(el, bad) {
        var holder = el.closest(".field") || el.closest(".consent");
        if (holder) holder.classList.toggle("is-invalid", bad);
      }
      if (email) email.addEventListener("input", function () { mark(email, false); });
      if (consent) consent.addEventListener("change", function () { mark(consent, false); });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        if (email && !emailRe.test(email.value.trim())) { mark(email, true); ok = false; }
        if (consent && !consent.checked) { mark(consent, true); ok = false; }
        if (!ok) { (form.querySelector(".is-invalid input") || email).focus(); return; }

        var data = new FormData(form);
        var payload = {
          email: String(data.get("email") || "").trim(),
          nombre: String(data.get("nombre") || "").trim(),
          tienda: String(data.get("tienda") || ""),
          intereses: data.getAll("intereses"),
          origen: form.getAttribute("data-source") || location.pathname,
          consentimiento: true,
          fecha: new Date().toISOString()
        };

        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.setAttribute("aria-busy", "true"); }

        var done = function () {
          box.classList.add("is-sent");
          var msg = box.querySelector(".nl-success");
          if (msg) { msg.setAttribute("tabindex", "-1"); msg.focus({ preventScroll: true }); }
        };

        if (!NEWSLETTER_ENDPOINT) { setTimeout(done, 500); return; }

        fetch(NEWSLETTER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          done();
        }).catch(function () {
          if (btn) { btn.disabled = false; btn.removeAttribute("aria-busy"); }
          alert("No hemos podido completar la suscripción. Inténtalo de nuevo o escríbenos a hola@joieriagrau.com.");
        });
      });
    });
  }

  /* Formulario de cita previa */
  function initCita() {
    var form = document.querySelector("form.cita-form");
    if (!form) return;
    var box = form.closest(".nl-box") || form.parentElement;
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Preselección desde la URL: cita.html?tienda=barcelona&servicio=compromiso
    var params = new URLSearchParams(window.location.search);
    ["tienda", "servicio"].forEach(function (key) {
      var value = params.get(key);
      var select = form.querySelector('[name="' + key + '"]');
      if (value && select && select.querySelector('option[value="' + value + '"]')) select.value = value;
    });

    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

    function holder(el) { return el.closest(".field") || el.closest(".consent"); }
    function valid(el) {
      if (el.type === "checkbox") return el.checked;
      var v = (el.value || "").trim();
      if (!v) return false;
      if (el.type === "email") return emailRe.test(v);
      if (el.type === "tel") return v.replace(/\D/g, "").length >= 9;
      return true;
    }

    [].forEach.call(form.querySelectorAll("[required]"), function (el) {
      el.addEventListener(el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input", function () {
        var hd = holder(el); if (hd) hd.classList.remove("is-invalid");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      [].forEach.call(form.querySelectorAll("[required]"), function (el) {
        var ok = valid(el);
        var hd = holder(el); if (hd) hd.classList.toggle("is-invalid", !ok);
        if (!ok && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }

      var data = new FormData(form);
      var payload = { origen: "cita", fecha_envio: new Date().toISOString() };
      data.forEach(function (value, key) { payload[key] = typeof value === "string" ? value.trim() : value; });

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.setAttribute("aria-busy", "true"); }
      var done = function () {
        box.classList.add("is-sent");
        var msg = box.querySelector(".nl-success");
        if (msg) { msg.setAttribute("tabindex", "-1"); msg.focus({ preventScroll: true }); box.scrollIntoView({ behavior: "smooth", block: "start" }); }
      };
      if (!CITA_ENDPOINT) { setTimeout(done, 500); return; }
      fetch(CITA_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); done(); })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.removeAttribute("aria-busy"); }
          alert("No hemos podido enviar la solicitud. Llámanos al 935 193 303 o escríbenos a hola@joieriagrau.com.");
        });
    });
  }

  /* Blog: filtro por categoría y carga progresiva */
  function initBlog() {
    var grid = document.querySelector("[data-blog-grid]");
    if (!grid) return;
    var buttons = [].slice.call(document.querySelectorAll("[data-blog-cats] button"));
    var more = document.querySelector("[data-blog-more]");
    var posts = [].slice.call(grid.children);
    var STEP = 12, limit = STEP, current = (location.hash || "").replace("#", "");
    function render() {
      var visible = 0;
      posts.forEach(function (p) {
        var match = !current || (" " + p.getAttribute("data-cats") + " ").indexOf(" " + current + " ") >= 0;
        p.hidden = !match || visible >= limit;
        if (match) visible++;
      });
      if (more) more.hidden = visible <= limit;
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === current)); });
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        current = b.getAttribute("data-cat"); limit = STEP;
        history.replaceState(null, "", current ? "#" + current : location.pathname);
        render();
      });
    });
    if (more) more.addEventListener("click", function () { limit += STEP; render(); });
    if (current && !buttons.some(function (b) { return b.getAttribute("data-cat") === current; })) current = "";
    render();
  }

  function initYear() {
    [].forEach.call(document.querySelectorAll("[data-year]"), function (el) { el.textContent = new Date().getFullYear(); });
  }

  function boot() {
    safe(initHeader, "header");
    safe(initDrawer, "drawer");
    safe(initReveal, "reveal");
    safe(initHeroSlides, "hero");
    safe(initHeroStores, "boutiques");
    safe(initParallax, "parallax");
    safe(initNewsletter, "newsletter");
    safe(initCita, "cita");
    safe(initBlog, "blog");
    safe(initYear, "year");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
