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
      function openMenu() {
        menu.hidden = false;
        burger.setAttribute('aria-expanded', 'true');
        burger.innerHTML = '<i class="ti ti-x"></i>';
        document.addEventListener('keydown', onEsc);
      }
      function closeMenu() {
        menu.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
        burger.innerHTML = '<i class="ti ti-menu-2"></i>';
        document.removeEventListener('keydown', onEsc);
      }
      function onEsc(e) { if (e.key === 'Escape') closeMenu(); }

      burger.addEventListener('click', function () {
        menu.hidden ? openMenu() : closeMenu();
      });

      menu.querySelectorAll('a').forEach(function (l) {
        l.addEventListener('click', closeMenu);
      });

      document.addEventListener('click', function (e) {
        if (!menu.hidden && !menu.contains(e.target) && e.target !== burger) closeMenu();
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
