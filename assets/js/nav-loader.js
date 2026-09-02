'use strict';

(function () {
  // Detect base path: pages in subfolders need "../"
  var scripts = document.getElementsByTagName('script');
  var loaderSrc = '';
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.indexOf('nav-loader.js') !== -1) {
      loaderSrc = scripts[i].getAttribute('src');
      break;
    }
  }
  var base = loaderSrc.replace('assets/js/nav-loader.js', '');

  // Inject nav.css and footer.css
  function loadCSS(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  loadCSS(base + 'assets/css/nav.css');
  loadCSS(base + 'assets/css/footer.css');

  // Load nav
  var navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    fetch(base + 'nav.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        html = html.replace(/\{\{base\}\}/g, base);
        navPlaceholder.innerHTML = html;
        initNav();
      });
  } else if (document.getElementById('nav')) {
    // Nav already in the DOM (e.g. servicii pages) — just init events
    initNav();
  }

  // Load footer
  var footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch(base + 'footer.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        html = html.replace(/\{\{base\}\}/g, base);
        footerPlaceholder.innerHTML = html;
      });
  }

  var banerOfertaPlaceholder = document.getElementById('baner-oferta-placeholder');
  if (banerOfertaPlaceholder) {
    fetch(base + 'baner-oferta.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        html = html.replace(/\{\{base\}\}/g, base);
        banerOfertaPlaceholder.innerHTML = html;
      });
  }

  function initNav() {
    /* DROPDOWN NAV (desktop) */
    document.querySelectorAll('.nav__trigger').forEach(function (trigger) {
      var dropdown = trigger.closest('.nav__item').querySelector('.nav__dropdown');
      if (!dropdown) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          dropdown.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeAllDropdowns(); trigger.focus(); }
      });
    });

    function closeAllDropdowns() {
      document.querySelectorAll('.nav__dropdown.open').forEach(function (d) {
        d.classList.remove('open');
      });
      document.querySelectorAll('.nav__trigger[aria-expanded="true"]').forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
    }

    document.addEventListener('click', closeAllDropdowns);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllDropdowns();
    });

    /* MOBILE MENU (burger) */
    var burger = document.querySelector('.nav__burger');
    var menu = document.getElementById('mobile-menu');
    if (burger && menu) {
      var svgHamburger = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z" fill="currentColor"/></svg>';
      var svgClose = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z" fill="currentColor"/></svg>';
      function openMenu() {
        menu.hidden = false;
        burger.setAttribute('aria-expanded', 'true');
        burger.innerHTML = svgClose;
        document.addEventListener('keydown', onEsc);
      }
      function closeMenu() {
        menu.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
        burger.innerHTML = svgHamburger;
        document.removeEventListener('keydown', onEsc);
      }
      function onEsc(e) { if (e.key === 'Escape') closeMenu(); }

      burger.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.hidden ? openMenu() : closeMenu();
      });

      menu.querySelectorAll('a').forEach(function (l) {
        l.addEventListener('click', closeMenu);
      });

      document.addEventListener('click', function (e) {
        if (!menu.hidden && !menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
      });
    }

    /* MOBILE MENU — acordeon */
    document.querySelectorAll('.mobile-menu__group-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var items = btn.nextElementSibling;
        var isOpen = items.classList.contains('open');
        document.querySelectorAll('.mobile-menu__group-items.open').forEach(function (el) {
          el.classList.remove('open');
          el.previousElementSibling.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          items.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    /* NAV SHADOW on scroll */
    var nav = document.getElementById('nav');
    if (nav) {
      var tick = false;
      window.addEventListener('scroll', function () {
        if (!tick) {
          requestAnimationFrame(function () {
            nav.style.boxShadow = window.scrollY > 10 ? '0 1px 12px rgba(0,0,0,.08)' : 'none';
            tick = false;
          });
          tick = true;
        }
      });
    }
  }
})();
