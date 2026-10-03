(function(){
  "use strict";

  // ---------------------------------------------------------------
  // SITE SETTINGS — Ora Lodge should fill these in before going live.
  // Leaving phone/email blank keeps the site from showing invented
  // contact details; once filled in, they appear automatically below.
  // ---------------------------------------------------------------
  var CONFIG = {
    phone: "",            // e.g. "+27 82 123 4567"
    email: "beggymarutla2005@gmail.com",            // e.g. "bookings@oralodge.co.za"
    mapsQuery: "Ora Lodge Ga-Masemola Limpopo"
  };

  function formatTel(p){ return p.replace(/[^\d+]/g, ""); }

  function applyConfig(){
    var phoneBlock = document.getElementById("phone-block");
    var emailBlock = document.getElementById("email-block");
    var headerCall = document.getElementById("header-phone-link");

    if (CONFIG.phone) {
      phoneBlock.className = "";
      phoneBlock.innerHTML = 'Phone: <a class="contact-link" href="tel:' + formatTel(CONFIG.phone) + '">' + CONFIG.phone + "</a>";
      headerCall.href = "tel:" + formatTel(CONFIG.phone);
      headerCall.textContent = CONFIG.phone;
    }
    if (CONFIG.email) {
      emailBlock.className = "";
      emailBlock.innerHTML = 'Email: <a class="contact-link" href="mailto:' + CONFIG.email + '">' + CONFIG.email + "</a>";
    }
    var dirLink = document.getElementById("directions-link");
    dirLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
  }

  // ---------------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------------
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("primary-nav");
  toggle.addEventListener("click", function(){
    var open = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!open));
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
  });
  document.getElementById("nav-list").addEventListener("click", function(e){
    if (e.target.tagName === "A") {
      nav.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // ---------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------
  var ROUTES = {
    "/": "page-home",
    "/rooms": "page-rooms",
    "/gallery": "page-gallery",
    "/about": "page-about",
    "/contact": "page-contact",
    "/privacy-policy": "page-privacy",
    "/terms": "page-terms",
    "/cookies": "page-cookies"
  };

  var TITLES = {
    "/": "Ora Lodge — Guest Cottages in Ga-Masemola, Limpopo",
    "/rooms": "Rooms — Ora Lodge",
    "/gallery": "Gallery — Ora Lodge",
    "/about": "About — Ora Lodge",
    "/contact": "Contact — Ora Lodge",
    "/privacy-policy": "Privacy Policy — Ora Lodge",
    "/terms": "Terms & Conditions — Ora Lodge",
    "/cookies": "Cookies Policy — Ora Lodge"
  };

  function currentPath(){
    var h = window.location.hash.replace(/^#/, "");
    if (!h) return "/";
    return h;
  }

  function render(){
    var path = currentPath();
    var pageId = ROUTES[path] || "page-404";

    document.querySelectorAll(".page").forEach(function(p){ p.classList.remove("active"); });
    document.getElementById(pageId).classList.add("active");

    document.title = TITLES[path] || "Page not found — Ora Lodge";

    document.querySelectorAll('nav a[data-route]').forEach(function(a){
      a.classList.toggle("active", a.getAttribute("data-route") === path);
    });

    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", render);

  // ---------------------------------------------------------------
  // Contact form (no backend attached yet — opens a pre-filled email)
  // ---------------------------------------------------------------
  var form = document.getElementById("contact-form");
  var successMsg = document.getElementById("form-success");
  var errorMsg = document.getElementById("form-error");

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var name = document.getElementById("f-name");
    var email = document.getElementById("f-email");
    var message = document.getElementById("f-message");
    [name, email, message].forEach(function(f){ f.setAttribute("data-touched", "true"); });

    successMsg.classList.remove("show");
    errorMsg.classList.remove("show");

    if (!form.checkValidity()) {
      errorMsg.classList.add("show");
      errorMsg.focus && errorMsg.focus();
      return;
    }

    var phone = document.getElementById("f-phone").value;
    var dates = document.getElementById("f-dates").value;
    var bodyLines = [
      "Name: " + name.value,
      "Email: " + email.value,
      phone ? "Phone: " + phone : null,
      dates ? "Preferred dates: " + dates : null,
      "",
      message.value
    ].filter(Boolean);

    var subject = "Enquiry from Ora Lodge website — " + name.value;
    var body = bodyLines.join("\n");
    var mailtoTarget = CONFIG.email || "";
    var mailto = "mailto:" + mailtoTarget + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    window.location.href = mailto;
    successMsg.classList.add("show");
    form.reset();
  });

  // ---------------------------------------------------------------
  // Footer year + legal page dates
  // ---------------------------------------------------------------
  var year = new Date().getFullYear();
  document.getElementById("copyright-year").textContent = year;
  var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var now = new Date();
  var formatted = monthNames[now.getMonth()] + " " + now.getFullYear();
  document.querySelectorAll("[data-current-date]").forEach(function(el){ el.textContent = formatted; });

  applyConfig();
  render();
})();
