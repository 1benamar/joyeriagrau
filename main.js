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

  function initYear() {
    [].forEach.call(document.querySelectorAll("[data-year]"), function (el) { el.textContent = new Date().getFullYear(); });
  }

  function boot() {
    safe(initHeader, "header");
    safe(initDrawer, "drawer");
    safe(initReveal, "reveal");
    safe(initParallax, "parallax");
    safe(initNewsletter, "newsletter");
    safe(initYear, "year");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
