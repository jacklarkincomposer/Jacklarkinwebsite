/* ============================================================
   JACK LARKIN COMPOSER — Shared JS v2.0
   Navigation, mobile menu, scroll effects, JLPlayer
============================================================ */
(function () {
  'use strict';

  /* ── Mobile menu ── */
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
    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        panel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active nav link ── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile-panel a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Scroll CTA: show nav CTA when announce-bar leaves viewport ── */
  var announceBar = document.querySelector('.announce-bar');
  var nav = document.querySelector('.nav');
  if (announceBar && nav) {
    var obs = new IntersectionObserver(function (entries) {
      nav.classList.toggle('nav--scrolled', !entries[0].isIntersecting);
    }, { threshold: 0 });
    obs.observe(announceBar);
  }

  /* ── Background parallax ── */
  var siteBg = document.querySelector('.site-bg');
  if (siteBg) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var maxShift = window.innerHeight * 0.08;
          var shift = Math.min(maxShift, window.scrollY * 0.04);
          siteBg.style.transform = 'translateY(-' + shift + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Links dropdown ── */
  document.querySelectorAll('.nav__dropdown').forEach(function (dd) {
    var toggle = dd.querySelector('.nav__dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      dd.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target)) dd.classList.remove('open');
    });
  });

}());

/* ============================================================
   JLPlayer — Unified video player overlay
   Usage: JLPlayer.open(videosArray, startIndex)
   Video object: { type:'youtube'|'cloudflare', ytId, src, thumb, title, badge, desc:[] }
============================================================ */
window.JLPlayer = (function () {
  'use strict';

  var _videos  = [];
  var _idx     = 0;
  var _infoOpen = false;
  var _overlay = null;
  var _els     = {};

  /* ── Build the overlay HTML (once) ── */
  function _build() {
    if (_overlay) return;
    var o = document.createElement('div');
    o.id = 'jlpOverlay';
    o.className = 'jlp-overlay';
    o.setAttribute('role', 'dialog');
    o.setAttribute('aria-modal', 'true');
    o.setAttribute('aria-label', 'Video player');
    o.innerHTML = [
      '<div class="jlp-container" id="jlpContainer">',
        '<div class="jlp-bar">',
          '<button class="jlp-btn" id="jlpBack">',
            '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
            ' BACK',
          '</button>',
          '<span class="jlp-bar-title" id="jlpBarTitle"></span>',
          '<div class="jlp-bar-actions">',
            '<button class="jlp-btn" id="jlpInfo">',
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8.5" stroke-width="3"/><line x1="12" y1="11" x2="12" y2="16"/></svg>',
              ' INFO',
            '</button>',
            '<button class="jlp-btn" id="jlpPrev">',
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
              ' PREV',
            '</button>',
            '<button class="jlp-btn" id="jlpNext">',
              'NEXT ',
              '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>',
            '</button>',
          '</div>',
        '</div>',
        '<div class="jlp-stage">',
          '<div class="jlp-video-col">',
            '<div class="jlp-ratio" id="jlpRatio"></div>',
          '</div>',
          '<div class="jlp-wing" id="jlpWing">',
            '<div class="jlp-wing-inner" id="jlpWingInner">',
              '<div class="jlp-wing-title" id="jlpWingTitle"></div>',
              '<div class="jlp-wing-divider"></div>',
              '<div class="jlp-wing-body" id="jlpWingBody">',
                '<div class="jlp-skel"></div><div class="jlp-skel"></div>',
                '<div class="jlp-skel"></div><div class="jlp-skel"></div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
        '<a class="jlp-yt-link hidden" id="jlpYtLink" href="#" target="_blank" rel="noopener">',
          '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
          ' OPEN IN YOUTUBE',
        '</a>',
      '</div>'
    ].join('');
    document.body.appendChild(o);
    _overlay = o;

    _els.back      = document.getElementById('jlpBack');
    _els.info      = document.getElementById('jlpInfo');
    _els.prev      = document.getElementById('jlpPrev');
    _els.next      = document.getElementById('jlpNext');
    _els.barTitle  = document.getElementById('jlpBarTitle');
    _els.ratio     = document.getElementById('jlpRatio');
    _els.wing      = document.getElementById('jlpWing');
    _els.wingTitle = document.getElementById('jlpWingTitle');
    _els.wingBody  = document.getElementById('jlpWingBody');
    _els.ytLink    = document.getElementById('jlpYtLink');

    _els.back.addEventListener('click', _close);
    _els.info.addEventListener('click', _toggleInfo);
    _els.prev.addEventListener('click', function () { _goto(_idx - 1); });
    _els.next.addEventListener('click', function () { _goto(_idx + 1); });

    _overlay.addEventListener('click', function (e) {
      if (e.target === _overlay) _close();
    });
    document.addEventListener('keydown', function (e) {
      if (!_overlay || !_overlay.classList.contains('open')) return;
      if (e.key === 'Escape') { _infoOpen ? _toggleInfo() : _close(); }
      if (e.key === 'i' || e.key === 'I') _toggleInfo();
      if (e.key === 'ArrowLeft')  _goto(_idx - 1);
      if (e.key === 'ArrowRight') _goto(_idx + 1);
    });

    /* Mobile swipe down on bar to close */
    var touchY = 0;
    _els.back.addEventListener('touchstart', function (e) { touchY = e.touches[0].clientY; }, { passive: true });
    _overlay.addEventListener('touchstart', function (e) { touchY = e.touches[0].clientY; }, { passive: true });
    _overlay.addEventListener('touchend', function (e) {
      if (e.changedTouches[0].clientY - touchY > 100 && !_infoOpen) _close();
    }, { passive: true });
  }

  function _stopMedia() {
    var v = _els.ratio.querySelector('video');
    if (v) { v.pause(); v.src = ''; }
    var i = _els.ratio.querySelector('iframe');
    if (i) { i.src = ''; }
    _els.ratio.innerHTML = '';
  }

  function _loadVideo(v) {
    _stopMedia();
    _els.barTitle.textContent = v.title || '';
    if (v.type === 'youtube') {
      _els.ratio.innerHTML = '<iframe src="https://www.youtube.com/embed/' + v.ytId +
        '?autoplay=1&rel=0&playsinline=1&modestbranding=1" frameborder="0" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen></iframe>';
      _els.ytLink.href = 'https://www.youtube.com/watch?v=' + v.ytId;
      _els.ytLink.classList.remove('hidden');
    } else {
      _els.ratio.innerHTML = '<video src="' + v.src + '" controls playsinline preload="metadata"></video>';
      var vid = _els.ratio.querySelector('video');
      if (vid) vid.play().catch(function () {});
      _els.ytLink.classList.add('hidden');
    }
  }

  function _loadInfo(v) {
    _els.wingTitle.textContent = v.title || '';
    if (v.desc && v.desc.length) {
      _els.wingBody.innerHTML = v.desc.map(function (p) {
        return '<p>' + p + '</p>';
      }).join('');
    } else {
      _els.wingBody.innerHTML = '<div class="jlp-skel"></div><div class="jlp-skel"></div><div class="jlp-skel"></div>';
    }
  }

  function _updateNav() {
    _els.prev.disabled = _idx <= 0;
    _els.next.disabled = _idx >= _videos.length - 1;
  }

  function _goto(i) {
    if (i < 0 || i >= _videos.length) return;
    _idx = i;
    var v = _videos[_idx];
    _loadVideo(v);
    _loadInfo(v);
    _updateNav();
    if (_infoOpen) {
      _els.wing.classList.add('open');
      _els.info.classList.add('active');
    } else {
      _els.wing.classList.remove('open');
      _els.info.classList.remove('active');
    }
  }

  function _toggleInfo() {
    _infoOpen = !_infoOpen;
    _els.wing.classList.toggle('open', _infoOpen);
    _els.info.classList.toggle('active', _infoOpen);
    if (_infoOpen) {
      var v = _videos[_idx];
      if (v) _loadInfo(v);
    }
  }

  function _open(videos, startIdx) {
    _build();
    _videos = videos || [];
    _idx = startIdx || 0;
    _infoOpen = false;
    _els.wing.classList.remove('open');
    _els.info.classList.remove('active');

    var v = _videos[_idx];
    if (!v) return;
    _loadVideo(v);
    _loadInfo(v);
    _updateNav();

    document.body.style.overflow = 'hidden';
    _overlay.classList.add('open');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        _overlay.classList.add('visible');
      });
    });
    setTimeout(function () { _els.back.focus(); }, 240);
  }

  function _close() {
    if (!_overlay) return;
    _overlay.classList.remove('visible');
    setTimeout(function () {
      _overlay.classList.remove('open');
      _stopMedia();
      _infoOpen = false;
      document.body.style.overflow = '';
    }, 240);
  }

  return { open: _open, close: _close };

}());
