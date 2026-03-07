/* ============================================================
   JACK LARKIN COMPOSER — Shared JS
   Navigation, mobile menu, scroll effects
   ============================================================ */
(function () {
  'use strict';

  // ── Mobile menu ──
  var toggle = document.getElementById('navToggle');
  var panel  = document.getElementById('mobilePanel');
  var close  = document.getElementById('mobileClose');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    if (close) {
      close.addEventListener('click', function () {
        panel.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    // Close on link click
    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        panel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Active nav link ──
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile-panel a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

}());
