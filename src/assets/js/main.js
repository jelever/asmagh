// Asmagh site behaviour. Plain JS, no dependencies. Every feature is
// progressive: without JS the content is all there, just static.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rtl = document.documentElement.dir === "rtl";

  /* ── Sticky header ─────────────────────────────────────────── */
  var header = document.querySelector("[data-header]");
  if (header) {
    var lastY = window.scrollY;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("is-sticky", y > 40);
      header.classList.toggle("is-hidden-utility", y > lastY && y > 120);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ───────────────────────────────────────────── */
  var burger = document.querySelector("[data-burger]");
  var nav = document.querySelector("[data-nav]");
  if (burger && nav) {
    var label = burger.querySelector("[data-burger-label]");
    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
      if (label) label.textContent = open ? label.dataset.close : label.dataset.open;
    };
    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        setOpen(false);
        burger.focus();
      }
    });
    window.matchMedia("(min-width: 992px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // Sub-menu toggles (accordion on mobile, dropdown on desktop).
  document.querySelectorAll("[data-subtoggle]").forEach(function (btn) {
    var item = btn.closest(".nav__item");
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      item.classList.toggle("is-open", open);
    });
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget) && window.innerWidth >= 992) {
        btn.setAttribute("aria-expanded", "false");
        item.classList.remove("is-open");
      }
    });
  });

  /* ── Hero carousel ─────────────────────────────────────────── */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var slides = root.querySelectorAll("[data-slide]");
    var dots = root.querySelectorAll("[data-dot]");
    if (slides.length < 2) return;
    var current = 0;
    var timer = null;

    var go = function (i) {
      slides[current].classList.remove("is-active");
      slides[current].setAttribute("inert", "");
      dots[current].classList.remove("is-active");
      dots[current].removeAttribute("aria-current");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      slides[current].removeAttribute("inert");
      dots[current].classList.add("is-active");
      dots[current].setAttribute("aria-current", "true");
    };
    var start = function () {
      if (reduceMotion) return;
      stop();
      timer = window.setInterval(function () { go(current + 1); }, 7000);
    };
    var stop = function () {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        go(Number(dot.dataset.dot));
        start();
      });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    start();
  });

  /* ── Scroll-in animations and count-up ─────────────────────── */
  var animated = document.querySelectorAll("[data-animate]");
  var counters = document.querySelectorAll("[data-count]");

  var countUp = function (el) {
    var target = Number(el.dataset.count);
    if (reduceMotion || !target) return;
    var t0 = null;
    var dur = 2000;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) window.requestAnimationFrame(step);
    };
    el.textContent = "0";
    window.requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window && !reduceMotion) {
    document.documentElement.classList.add("js-animate");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.hasAttribute("data-count")) countUp(el);
          else el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    animated.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ── Product showcase: hover swaps the preview photo ───────── */
  document.querySelectorAll("[data-showcase]").forEach(function (root) {
    var previews = root.querySelectorAll("[data-preview]");
    var show = function (key) {
      previews.forEach(function (img) {
        img.classList.toggle("is-active", img.dataset.preview === key);
      });
    };
    root.querySelectorAll("[data-preview-key]").forEach(function (link) {
      var key = link.dataset.previewKey;
      link.addEventListener("mouseenter", function () { show(key); });
      link.addEventListener("focus", function () { show(key); });
    });
  });

  /* ── Industries slider (scroll-snap track + buttons) ───────── */
  document.querySelectorAll("[data-slider]").forEach(function (root) {
    var track = root.querySelector("[data-track]");
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    if (!track) return;
    var by = function (dir) {
      var card = track.firstElementChild;
      var w = card ? card.getBoundingClientRect().width + 24 : 300;
      // In RTL, scrollLeft runs negative, so "next" moves left.
      track.scrollBy({ left: dir * w * (rtl ? -1 : 1), behavior: reduceMotion ? "auto" : "smooth" });
    };
    if (prev) prev.addEventListener("click", function () { by(-1); });
    if (next) next.addEventListener("click", function () { by(1); });
  });

  /* ── Contact form: Formspree via fetch, messages in page language ── */
  var form = document.querySelector("[data-form]");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var product = params.get("product");
    var type = params.get("type");
    var select = form.querySelector("[data-product-select]");
    if (product && select && select.querySelector('option[value="' + CSS.escape(product) + '"]')) {
      select.value = product;
    }
    if (type) {
      var radio = form.querySelector('input[name="request_type"][value="' + CSS.escape(type) + '"]');
      if (radio) radio.checked = true;
    }

    var status = form.querySelector("[data-status]");
    var submit = form.querySelector("[data-submit]");
    var submitText = submit ? submit.textContent : "";
    var say = function (msg, kind) {
      status.textContent = msg;
      status.className = "form__status" + (kind ? " is-" + kind : "");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (form.dataset.connected !== "true") {
        say(form.dataset.msgNotConnected, "error");
        return;
      }
      var data = new FormData(form);
      var subject = form.querySelector("[data-subject]");
      if (subject) {
        data.set("_subject", "Asmagh website: " + (data.get("request_type") || "enquiry") +
          (data.get("product") ? " – " + data.get("product") : ""));
      }
      submit.disabled = true;
      submit.textContent = form.dataset.msgSending;
      say("", "");
      fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          say(form.dataset.msgSuccess, "success");
        })
        .catch(function () {
          say(form.dataset.msgError, "error");
        })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = submitText;
        });
    });
  }
})();
