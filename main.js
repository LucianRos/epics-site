'use strict';

/* ---- DROPDOWN NAV (desktop) ------------------------------- */
(function () {
  // Keyboard: Enter/Space deschide, Escape inchide, Tab navigheza
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
})();

/* ---- MOBILE MENU (burger) --------------------------------- */
(function () {
  var burger = document.querySelector('.nav__burger');
  var menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

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

  // Inchide la click pe link simplu (nu trigger de grup)
  menu.querySelectorAll('a').forEach(function (l) {
    l.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== burger) closeMenu();
  });
})();

/* ---- MOBILE MENU — acordeon ------------------------------- */
(function () {
  document.querySelectorAll('.mobile-menu__group-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var items   = btn.nextElementSibling;
      var isOpen  = items.classList.contains('open');
      // Inchide toate
      document.querySelectorAll('.mobile-menu__group-items.open').forEach(function (el) {
        el.classList.remove('open');
        el.previousElementSibling.setAttribute('aria-expanded', 'false');
      });
      // Deschide acesta daca era inchis
      if (!isOpen) {
        items.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ---- STAT COUNTER ----------------------------------------- */
(function () {
  var counters = document.querySelectorAll('.stat__num[data-target]');
  if (!counters.length) return;
  var observed = new Set();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !observed.has(e.target)) {
        observed.add(e.target);
        var el = e.target, target = parseInt(el.getAttribute('data-target'), 10), start = null, dur = 1200;
        requestAnimationFrame(function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target);
          if (p < 1) requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: .5 });
  counters.forEach(function (el) { observer.observe(el); });
})();

/* ---- NAV SHADOW on scroll --------------------------------- */
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
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
})();

/* ---- SCROLL REVEAL ---------------------------------------- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var targets = document.querySelectorAll(
    '.event-card,.service-row,.about-card,.feature-card,.testimonial,.client-chip,.stat,.blog-card,.reveal-item'
  );
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('reveal', 'visible'); observer.unobserve(e.target); }
    });
  }, { threshold: .1, rootMargin: '0px 0px -20px 0px' });
  targets.forEach(function (el) { el.classList.add('reveal'); observer.observe(el); });
})();

/* ---- SMOOTH SCROLL ---------------------------------------- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(this.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      var navH = document.getElementById('nav') ? document.getElementById('nav').offsetHeight : 0;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
    });
  });
})();

/* ---- CONTACT FORM ----------------------------------------- */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Se trimite...'; btn.disabled = true;
    setTimeout(function () {
      form.innerHTML = '<div style="text-align:center;padding:40px 0"><div style="font-size:40px;margin-bottom:16px">✓</div><div style="font-family:var(--font-display);font-size:22px;font-weight:700;margin-bottom:8px">Mesaj trimis!</div><p style="color:var(--clr-text-muted)">Te vom contacta în cel mai scurt timp posibil.</p></div>';
    }, 1000);
  });
})();
