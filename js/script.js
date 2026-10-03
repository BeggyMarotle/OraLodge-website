(function(){
  "use strict";

  // ---------------------------------------------------------------
  // SITE SETTINGS — Ora Lodge should fill these in before going live.
  // Leaving phone/email blank keeps the site from showing invented
  // contact details; once filled in, they appear automatically below.
  // ---------------------------------------------------------------
  var CONFIG = {
    phone: "+27764751683",            // e.g. "+27 82 123 4567"  (shown as a clickable phone number)
    email: "beggymarutla@gmail.com",            // e.g. "bookings@oralodge.co.za"
    whatsapp: "+27764751683",         // digits only, country code first, no + or spaces, e.g. "27821234567"
    mapsQuery: "Ora Lodge Ga-Masemola Limpopo"
  };

  function formatTel(p){ return p.replace(/[^\d+]/g, ""); }

  function applyConfig(){
    var phoneBlock = document.getElementById("phone-block");
    var emailBlock = document.getElementById("email-block");
    var whatsappBlock = document.getElementById("whatsapp-block");
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
    if (CONFIG.whatsapp) {
      whatsappBlock.className = "";
      whatsappBlock.innerHTML = 'WhatsApp: <a class="contact-link" href="https://wa.me/' + CONFIG.whatsapp + '" target="_blank" rel="noopener">Chat on WhatsApp</a>';
    }

    var waBtn = document.getElementById("btn-send-whatsapp");
    if (!CONFIG.whatsapp) {
      waBtn.setAttribute("aria-disabled", "true");
      waBtn.title = "WhatsApp isn't set up yet";
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
  // Contact form — two send buttons, one shared message.
  // No backend attached: email opens the visitor's email app,
  // WhatsApp opens wa.me with the message pre-filled.
  // ---------------------------------------------------------------
  var form = document.getElementById("contact-form");
  var successMsg = document.getElementById("form-success");
  var errorMsg = document.getElementById("form-error");
  var errorMsgWhatsapp = document.getElementById("form-error-whatsapp");
  var btnWhatsapp = document.getElementById("btn-send-whatsapp");
  var btnEmail = document.getElementById("btn-send-email");

  function hideMessages(){
    successMsg.classList.remove("show");
    errorMsg.classList.remove("show");
    errorMsgWhatsapp.classList.remove("show");
  }

  function buildMessageLines(){
    var name = document.getElementById("f-name");
    var email = document.getElementById("f-email");
    var message = document.getElementById("f-message");
    var phone = document.getElementById("f-phone").value;
    var dates = document.getElementById("f-dates").value;

    return {
      name: name,
      email: email,
      message: message,
      lines: [
        "Name: " + name.value,
        "Email: " + email.value,
        phone ? "Phone: " + phone : null,
        dates ? "Preferred dates: " + dates : null,
        "",
        message.value
      ].filter(Boolean)
    };
  }

  function validateForm(){
    var name = document.getElementById("f-name");
    var email = document.getElementById("f-email");
    var message = document.getElementById("f-message");
    [name, email, message].forEach(function(f){ f.setAttribute("data-touched", "true"); });
    return form.checkValidity();
  }

  function sendByEmail(){
    hideMessages();
    if (!validateForm()) {
      errorMsg.classList.add("show");
      errorMsg.focus && errorMsg.focus();
      return;
    }
    var data = buildMessageLines();
    var subject = "Enquiry from Ora Lodge website — " + data.name.value;
    var body = data.lines.join("\n");
    var mailtoTarget = CONFIG.email || "";
    var mailto = "mailto:" + mailtoTarget + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    window.location.href = mailto;
    successMsg.textContent = "Thanks — your message is ready to send in your email app.";
    successMsg.classList.add("show");
    form.reset();
  }

  function sendByWhatsapp(){
    hideMessages();
    if (!CONFIG.whatsapp) {
      errorMsgWhatsapp.classList.add("show");
      errorMsgWhatsapp.focus && errorMsgWhatsapp.focus();
      return;
    }
    if (!validateForm()) {
      errorMsg.classList.add("show");
      errorMsg.focus && errorMsg.focus();
      return;
    }
    var data = buildMessageLines();
    var text = "New enquiry from the Ora Lodge website\n\n" + data.lines.join("\n");
    var waLink = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);

    window.open(waLink, "_blank", "noopener");
    successMsg.textContent = "Thanks — WhatsApp should open in a new tab with your message ready to send.";
    successMsg.classList.add("show");
    form.reset();
  }

  btnEmail.addEventListener("click", sendByEmail);
  btnWhatsapp.addEventListener("click", sendByWhatsapp);

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

