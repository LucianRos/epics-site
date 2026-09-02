'use strict';

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

/* ---- TESTIMONIALS CAROUSEL ------------------------------- */
(function () {
  var carousel = document.getElementById('testimonialsCarousel');
  if (!carousel) return;
  var track = carousel.querySelector('.testimonials-track');
  var dotsContainer = document.getElementById('carouselDots');
  var items = Array.prototype.slice.call(track.querySelectorAll('.testimonial'));
  var total = items.length;
  var current = 0;

  function getVisible() { return window.innerWidth >= 768 ? 2 : 1; }

  function buildDots() {
    dotsContainer.innerHTML = '';
    var pages = Math.ceil(total / getVisible());
    for (var i = 0; i < pages; i++) {
      var btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Pagina ' + (i + 1));
      btn.dataset.index = i;
      btn.addEventListener('click', function () { goTo(parseInt(this.dataset.index)); });
      dotsContainer.appendChild(btn);
    }
  }

  function updateDots() {
    var page = Math.round(current / getVisible());
    dotsContainer.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === page);
    });
  }

  function goTo(page) {
    var visible = getVisible();
    var maxPage = Math.ceil(total / visible) - 1;
    page = Math.max(0, Math.min(page, maxPage));
    current = page * visible;
    var gap = 16;
    var itemWidth = items[0].offsetWidth;
    track.scrollTo({ left: current * (itemWidth + gap), behavior: 'smooth' });
    updateDots();
  }

  carousel.querySelector('.carousel-btn--prev').addEventListener('click', function () {
    goTo(Math.round(current / getVisible()) - 1);
  });
  carousel.querySelector('.carousel-btn--next').addEventListener('click', function () {
    goTo(Math.round(current / getVisible()) + 1);
  });

  track.addEventListener('scroll', function () {
    var gap = 16;
    var itemWidth = items[0].offsetWidth;
    current = Math.round(track.scrollLeft / (itemWidth + gap));
    updateDots();
  });

  buildDots();
  window.addEventListener('resize', function () { buildDots(); goTo(0); });
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
