/* Joieria Grau — interacciones generales. Patrón IIFE, sin módulos. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.remove("no-js");
  doc.classList.add("js");

  // Rutas relativas a la carpeta de este script (funciona también en blog/ y en la página 404)
  var script = document.currentScript || document.querySelector('script[src*="main.js"]');
  var BASE = script ? script.src.replace(/main\.js(\?.*)?$/, "") : "";
  var FORM_ENDPOINT = BASE + "api/formulario.php";
  var CONTACT = { email: "hola@joieriagrau.com", tel: "+34935193303", telText: "935 193 303", whatsapp: "https://wa.me/34972364222" };

  var reducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.error("[grau] " + name, e); }
  }

  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
  function media(query) { return window.matchMedia ? window.matchMedia(query) : { matches: false, addEventListener: function () {} }; }
  function onMediaChange(mq, fn) { if (mq.addEventListener) mq.addEventListener("change", fn); else if (mq.addListener) mq.addListener(fn); }

  /* Ejecuta fn como mucho una vez por fotograma mientras se hace scroll */
  function onScrollFrame(fn) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; fn(); });
    }, { passive: true });
  }

  /* Cabecera: fondo al hacer scroll (en la portada lo gestionan los capítulos) */
  function initHeader() {
    var header = document.querySelector(".header");
    if (!header || document.querySelector("[data-chapters]")) return;
    var onScroll = function () { header.classList.toggle("is-solid", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Menú desplegable de escritorio: se abre al pasar el ratón o con su botón, y se cierra con Escape */
  function initMegaMenu() {
    var header = document.querySelector(".header");
    var items = [].slice.call(document.querySelectorAll("[data-mega]"));
    var backdrop = document.querySelector("[data-nav-backdrop]");
    if (!header || !items.length) return;
    var desktop = media("(min-width: 901px)");
    var current = null, openTimer = null, closeTimer = null, hideTimer = null;

    function mark(item, open) {
      item.classList.toggle("is-open", open);
      var button = item.querySelector(".nav__more");
      if (button) button.setAttribute("aria-expanded", String(open));
    }
    function open(item) {
      clearTimeout(closeTimer);
      clearTimeout(hideTimer);
      if (current === item) return;
      if (current) mark(current, false);
      current = item;
      mark(item, true);
      header.classList.add("is-menu");
      if (backdrop) {
        backdrop.hidden = false;
        requestAnimationFrame(function () { backdrop.classList.add("is-visible"); });
      }
    }
    function close(focusItem) {
      clearTimeout(openTimer);
      if (!current) return;
      var item = current;
      current = null;
      mark(item, false);
      header.classList.remove("is-menu");
      if (backdrop) {
        backdrop.classList.remove("is-visible");
        hideTimer = setTimeout(function () { if (!current) backdrop.hidden = true; }, 450);
      }
      if (focusItem) item.querySelector("a").focus();
    }

    items.forEach(function (item) {
      var button = item.querySelector(".nav__more");
      item.addEventListener("mouseenter", function () {
        if (!desktop.matches) return;
        clearTimeout(closeTimer);
        clearTimeout(openTimer);
        openTimer = setTimeout(function () { open(item); }, current ? 0 : 120);
      });
      item.addEventListener("mouseleave", function () {
        clearTimeout(openTimer);
        closeTimer = setTimeout(function () { close(false); }, 200);
      });
      if (button) button.addEventListener("click", function () { if (current === item) close(false); else open(item); });
      item.addEventListener("focusout", function (e) {
        if (current === item && !item.contains(e.relatedTarget)) close(false);
      });
    });
    if (backdrop) backdrop.addEventListener("click", function () { close(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && current) close(true); });
    onMediaChange(desktop, function () { if (!desktop.matches) close(false); });
  }

  /* Menú móvil */
  function initDrawer() {
    var burger = document.querySelector(".burger");
    var drawer = document.querySelector(".drawer");
    var header = document.querySelector(".header");
    if (!burger || !drawer) return;
    var isOpen = function () { return burger.getAttribute("aria-expanded") === "true"; };
    function set(open, restoreFocus) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      drawer.classList.toggle("is-open", open);
      if (header) header.classList.toggle("is-menu", open);
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

  /* Titulares palabra a palabra: cada palabra se envuelve para animarla sin cambiar el texto */
  function initSplit() {
    [].forEach.call(document.querySelectorAll("[data-split]"), function (el) {
      if (!reducedMotion) {
        var n = 0;
        (function walk(node) {
          [].slice.call(node.childNodes).forEach(function (child) {
            if (child.nodeType === 1) { if (child.tagName !== "BR") walk(child); return; }
            if (child.nodeType !== 3) return;
            var frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
              var word = document.createElement("span");
              var inner = document.createElement("span");
              word.className = "w";
              inner.textContent = part;
              inner.style.setProperty("--i", n++);
              word.appendChild(inner);
              frag.appendChild(word);
            });
            node.replaceChild(frag, child);
          });
        })(el);
      } else {
        el.classList.add("is-in");
      }
      el.classList.add("is-split");
    });
  }

  /* Aparición suave al entrar en pantalla */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll(".reveal, .reveal-media, [data-split]"));
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
      n = (n + slides.length) % slides.length;
      if (n === current) return;
      // La imagen de destino vuelve a su posición oculta sin transición para subir en cortina
      var next = slides[n];
      next.style.transition = "none";
      next.classList.remove("was-active");
      void next.offsetWidth;
      next.style.transition = "";
      // La imagen saliente queda debajo mientras la nueva sube
      slides.forEach(function (s) { s.classList.remove("was-active"); });
      slides[current].classList.add("was-active");
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      dots[current].setAttribute("aria-pressed", "false");
      current = n;
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

  /* Parallax sutil: la imagen se desplaza dentro de su marco (data-parallax) */
  function initParallax() {
    var items = [].slice.call(document.querySelectorAll("[data-parallax]"));
    if (!items.length || reducedMotion) return;
    function update() {
      var vh = window.innerHeight;
      items.forEach(function (img) {
        var box = img.parentElement.getBoundingClientRect();
        if (box.bottom < -80 || box.top > vh + 80) return;
        var progress = clamp((box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2), -1, 1);
        img.style.setProperty("--py", (progress * box.height * -0.06).toFixed(1) + "px");
      });
    }
    onScrollFrame(update);
    window.addEventListener("resize", update);
    update();
  }

  /* Portada: capítulos apilados. Marca el capítulo activo, ajusta el tono de la cabecera
     y calcula el efecto cortina (--cover oscurece el capítulo tapado, --enter desplaza la imagen entrante). */
  function initChapters() {
    var root = document.querySelector("[data-chapters]");
    if (!root) return;
    var header = document.querySelector(".header");
    var panels = [].slice.call(root.querySelectorAll("[data-chapter]"));
    var navLinks = [].slice.call(root.querySelectorAll("[data-chapters-nav] a"));
    var mobile = media("(max-width: 900px)");
    var starts = [], top = 0, total = 0, vh = 0, active = -1;

    function measure() {
      vh = window.innerHeight;
      top = root.getBoundingClientRect().top + window.scrollY;
      total = root.offsetHeight;
      var acc = 0;
      starts = panels.map(function (panel) { var start = top + acc; acc += panel.offsetHeight; return start; });
      update();
    }

    function update() {
      var y = window.scrollY;
      var headerH = header ? header.offsetHeight : 0;
      var index = 0;
      for (var i = 0; i < panels.length; i++) if (starts[i] <= y + headerH / 2) index = i;

      if (index !== active) {
        active = index;
        navLinks.forEach(function (a, k) { if (k === index) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
        root.classList.toggle("is-nav-dark", panels[index].getAttribute("data-header") !== "light");
      }
      if (header) {
        header.classList.toggle("is-solid", y >= top + total - headerH);
        var panel = panels[index];
        var tone = (mobile.matches && panel.getAttribute("data-header-mobile")) || panel.getAttribute("data-header");
        header.classList.toggle("is-light", tone === "light");
      }

      if (reducedMotion || y > top + total || y < top - vh) return;
      panels.forEach(function (panel, k) {
        var cover = k < panels.length - 1 ? clamp((y - starts[k + 1] + vh) / vh, 0, 1) : 0;
        var enter = k ? (1 - clamp((y - starts[k] + vh) / vh, 0, 1)) * -0.28 * vh : 0;
        panel.style.setProperty("--cover", cover.toFixed(3));
        panel.style.setProperty("--enter", enter.toFixed(1) + "px");
      });
    }

    // Los enlaces a capítulos calculan la posición real (los capítulos fijados no sirven como ancla)
    [].forEach.call(root.querySelectorAll("[data-chapter-link]"), function (a) {
      a.addEventListener("click", function (e) {
        var k = +a.getAttribute("data-chapter-link");
        if (starts[k] === undefined) return;
        e.preventDefault();
        window.scrollTo({ top: starts[k] + (k ? 1 : 0), behavior: reducedMotion ? "auto" : "smooth" });
        panels[k].setAttribute("tabindex", "-1");
        panels[k].focus({ preventScroll: true });
      });
    });

    // Si el foco entra en un capítulo tapado por el siguiente, se vuelve a mostrar entero
    root.addEventListener("focusin", function (e) {
      var panel = e.target.closest("[data-chapter]");
      var k = panels.indexOf(panel);
      if (k < 0 || k === panels.length - 1 || e.target === panel) return;
      if (window.scrollY > starts[k + 1] - vh + 2) window.scrollTo({ top: starts[k], behavior: "auto" });
    });

    onScrollFrame(update);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    onMediaChange(mobile, measure);
    measure();
  }

  /* Colecciones: en escritorio el scroll vertical desplaza la fila en horizontal; en móvil, deslizamiento nativo */
  function initHScroll() {
    [].forEach.call(document.querySelectorAll("[data-hscroll]"), function (section) {
      var track = section.querySelector("[data-hscroll-track]");
      var cards = section.querySelector("[data-hscroll-cards]");
      var bar = section.querySelector("[data-hscroll-bar]");
      if (!track || !cards) return;
      var wide = media("(min-width: 901px)");
      var pinned = false, distance = 0, top = 0;

      function progress(p) { if (bar) bar.style.setProperty("--progress", Math.max(p, 0.06).toFixed(4)); }

      function layout() {
        var pin = wide.matches && !reducedMotion;
        if (pin !== pinned) {
          pinned = pin;
          section.classList.toggle("is-pinned", pin);
          track.style.transform = "";
          cards.scrollLeft = 0;
        }
        if (pinned) {
          distance = Math.max(0, track.offsetWidth - doc.clientWidth);
          section.style.setProperty("--hscroll-h", Math.round(window.innerHeight + distance) + "px");
          top = section.getBoundingClientRect().top + window.scrollY;
        } else {
          section.style.removeProperty("--hscroll-h");
        }
        update();
      }

      function update() {
        if (pinned) {
          var p = distance ? clamp((window.scrollY - top) / distance, 0, 1) : 0;
          track.style.transform = "translate3d(" + (-p * distance).toFixed(1) + "px,0,0)";
          progress(p);
        } else {
          var max = cards.scrollWidth - cards.clientWidth;
          progress(max > 0 ? cards.scrollLeft / max : 1);
        }
      }

      // Con teclado, la tarjeta enfocada se lleva a la vista
      track.addEventListener("focusin", function (e) {
        if (!pinned || !distance) return;
        var card = e.target.closest(".coll, .hscroll__intro");
        if (!card) return;
        var x = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
        window.scrollTo({ top: top + clamp((x - 120) / distance, 0, 1) * distance, behavior: "auto" });
      });

      onScrollFrame(function () { if (pinned) update(); });
      cards.addEventListener("scroll", function () { if (!pinned) update(); }, { passive: true });
      window.addEventListener("resize", layout);
      window.addEventListener("load", layout);
      onMediaChange(wide, layout);
      layout();
    });
  }

  /* Desplazamiento suave con inercia para la rueda del ratón (escritorio).
     El teclado, la barra de desplazamiento y las pantallas táctiles mantienen su comportamiento nativo. */
  function initSmoothScroll() {
    if (reducedMotion || !media("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches) return;
    var current = 0, target = 0, lastSet = 0, running = false, lastTime = 0;

    function scrollableParent(el) {
      for (; el && el.nodeType === 1 && el !== document.body && el !== doc; el = el.parentElement) {
        if (el.scrollHeight > el.clientHeight + 1) {
          var overflow = getComputedStyle(el).overflowY;
          if (overflow === "auto" || overflow === "scroll") return el;
        }
      }
      return null;
    }
    function stop() {
      running = false;
      doc.style.scrollBehavior = "";
    }
    function loop(time) {
      if (!running) return;
      // Si otra cosa ha movido la página (teclado, ancla, barra), se cede el control
      if (Math.abs(window.scrollY - lastSet) > 4) return stop();
      // Suavizado independiente de la frecuencia de refresco de la pantalla
      var dt = lastTime ? Math.min(time - lastTime, 50) : 16.7;
      lastTime = time;
      current += (target - current) * (1 - Math.pow(0.88, dt / 16.7));
      if (Math.abs(target - current) < 0.5) current = target;
      lastSet = Math.round(current);
      window.scrollTo(0, current);
      lastSet = window.scrollY;
      if (current === target) return stop();
      requestAnimationFrame(loop);
    }

    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (document.body.style.overflow === "hidden" || scrollableParent(e.target)) return;
      var delta = e.deltaY * (e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1);
      e.preventDefault();
      if (!running) {
        current = target = lastSet = window.scrollY;
        lastTime = 0;
        running = true;
        doc.style.scrollBehavior = "auto";
        requestAnimationFrame(loop);
      }
      target = clamp(target + delta, 0, doc.scrollHeight - window.innerHeight);
    }, { passive: false });
  }

  /* Cursor «Ver» que acompaña al ratón sobre las piezas y tarjetas enlazadas */
  function initCursor() {
    if (reducedMotion || !media("(hover: hover) and (pointer: fine)").matches) return;
    var SELECTOR = ".cat, .coll:not(.coll--end), .post, .pcard, .mega__feature, .feature, .mini-product, .model";
    var cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="cursor__dot">Ver</span>';
    document.body.appendChild(cursor);
    doc.classList.add("has-cursor");

    var x = -200, y = -200, tx = -200, ty = -200, active = null, frame = null;
    function loop() {
      x += (tx - x) * 0.25;
      y += (ty - y) * 0.25;
      cursor.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(loop) : null;
    }
    function setActive(el) {
      if (el === active) return;
      if (active) active.removeAttribute("data-cursor-on");
      active = el;
      if (el) el.setAttribute("data-cursor-on", "");
      cursor.classList.toggle("is-visible", !!el);
    }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      if (!active) { x = e.clientX; y = e.clientY; }
      tx = e.clientX;
      ty = e.clientY;
      setActive(e.target.closest ? e.target.closest(SELECTOR) : null);
      if (!frame) frame = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener("mouseout", function (e) { if (!e.relatedTarget) setActive(null); });
    window.addEventListener("scroll", function () {
      if (!active) return;
      var el = document.elementFromPoint(tx, ty);
      setActive(el && el.closest ? el.closest(SELECTOR) : null);
    }, { passive: true });
  }

  /* El pie queda detrás del contenido en escritorio: con teclado se lleva a la vista */
  function initFooterReveal() {
    var footer = document.querySelector(".footer");
    if (!footer) return;
    footer.addEventListener("focusin", function () {
      if (getComputedStyle(footer).position !== "sticky") return;
      var max = doc.scrollHeight - window.innerHeight;
      if (window.scrollY < max - 2) window.scrollTo({ top: max, behavior: "auto" });
    });
  }

  /* Relojería: la imagen cambia al pasar por cada firma */
  function initSwap() {
    var frame = document.querySelector("[data-swap-media]");
    var list = document.querySelector("[data-swap-list]");
    if (!frame || !list) return;
    var images = [].slice.call(frame.querySelectorAll("[data-swap]"));
    var links = [].slice.call(list.querySelectorAll("[data-swap-to]"));
    var caption = frame.querySelector("[data-swap-caption]");
    var shown = -1;
    function show(i) {
      if (i === shown || !images[i]) return;
      shown = i;
      images.forEach(function (img, k) { img.classList.toggle("is-active", k === i); });
      links.forEach(function (a, k) { a.classList.toggle("is-active", k === i); });
      if (caption) caption.textContent = links[i].getAttribute("data-caption");
    }
    links.forEach(function (a) {
      var i = +a.getAttribute("data-swap-to");
      a.addEventListener("mouseenter", function () { show(i); });
      a.addEventListener("focus", function () { show(i); });
    });
    show(0);
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
    safe(initMegaMenu, "menú desplegable");
    safe(initDrawer, "menú");
    safe(initSplit, "titulares");
    safe(initReveal, "animaciones");
    safe(initHeroSlides, "hero");
    safe(initHeroStores, "boutiques");
    safe(initChapters, "capítulos");
    safe(initHScroll, "colecciones");
    safe(initSwap, "relojería");
    safe(initParallax, "parallax");
    safe(initSmoothScroll, "desplazamiento suave");
    safe(initCursor, "cursor");
    safe(initFooterReveal, "pie");
    safe(initForms, "formularios");
    safe(initBlog, "blog");
    safe(initYear, "año");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
