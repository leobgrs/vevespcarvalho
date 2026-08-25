(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};

  function esc(value) {
    return String(value || "");
  }

  function whatsappUrl(message) {
    var number = esc(config.contato && config.contato.whatsappNumber).replace(/\D/g, "");
    var msg = message || esc(config.contato && config.contato.whatsappMessage);
    var url = "https://wa.me/" + number;
    return msg ? url + "?text=" + encodeURIComponent(msg) : url;
  }

  function formatPhone(raw) {
    var digits = esc(raw).replace(/\D/g, "");
    if (digits.length === 13) {
      return "+" + digits.slice(0, 2) + " (" + digits.slice(2, 4) + ") " + digits.slice(4, 9) + "-" + digits.slice(9);
    }
    return digits;
  }

  function setText(attr, value) {
    document.querySelectorAll("[" + attr + "]").forEach(function (el) {
      el.textContent = value;
    });
  }

  function setAttr(attr, name, value) {
    document.querySelectorAll("[" + attr + "]").forEach(function (el) {
      el.setAttribute(name, value);
    });
  }

  function initData() {
    var d = config.dentista || {};
    var ct = config.contato || {};
    var loc = config.local || {};

    setText("data-name", d.nome);
    setText("data-specialty", d.especialidade);
    setText("data-cro", d.cro);
    setText("data-formation", d.formacao);
    setText("data-city", loc.cidade + " – " + loc.estado);
    setText("data-address", loc.endereco);
    setText("data-hours", loc.horario);
    setText("data-instagram-handle", d.instagramHandle);
    setText("data-phone-display", formatPhone(ct.whatsappNumber));
    setText("data-year", String(new Date().getFullYear()));

    document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      var custom = el.getAttribute("data-whatsapp-msg");
      el.setAttribute("href", whatsappUrl(custom));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    setAttr("data-instagram-url", "href", d.instagramUrl);
    setAttr("data-instagram-url", "target", "_blank");
    setAttr("data-instagram-url", "rel", "noopener");
  }

  function initHeader() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (!header || !toggle || !menu) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });

    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  function initMobileCta() {
    var bar = document.querySelector(".mobile-cta");
    if (!bar) return;
    function onScroll() {
      bar.classList.toggle("is-visible", window.scrollY > 560);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  function initAccordion() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var summary = item.querySelector("summary");
      if (!summary) return;
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpen = item.open;
        items.forEach(function (other) { other.open = false; });
        item.open = !isOpen;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initData();
    initHeader();
    initMobileCta();
    initReveal();
    initAccordion();
  });
})();
