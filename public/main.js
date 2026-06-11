(function(){
  'use strict';

  var loader = document.getElementById('loader');
  var loaderLogo = document.getElementById('loaderLogo');
  if (loaderLogo) {
    setTimeout(function(){ loaderLogo.classList.add('visible'); }, 200);
    setTimeout(function(){
      if (loader) loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 1600);
    setTimeout(function(){
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    }, 2200);
  } else {
    document.body.classList.add('loaded');
  }

  function animateHero() {
    if (window.startHeroCanvasAnimation) {
      window.startHeroCanvasAnimation();
    }
    var els = ['heroLabel','heroLine1','heroLine2','heroLine3','heroSub','heroCta','heroStats'];
    els.forEach(function(id, i) {
      var el = document.getElementById(id);
      if (el) {
        setTimeout(function(){ el.classList.add('animate'); }, i * 150);
      }
    });
  }

  // === GOLDEN DIAGONAL LINES CANVAS ===
  (function(){
    var c = document.getElementById('heroCanvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    var W = 0, H = 0;
    var ANGLE = 35 * Math.PI / 180;
    var COS = Math.cos(ANGLE), SIN = Math.sin(ANGLE);
    var lineData = [];

    function resize() {
      var p = c.parentElement;
      if (!p) return;
      var r = p.getBoundingClientRect();
      W = c.width = Math.round(r.width);
      H = c.height = Math.round(r.height);
    }

    function build() {
      lineData = [];
      var px = -SIN, py = COS;
      var corners = [
        0, W*px + 0*py,
        W*px + 0, 0 + H*py,
        W*px + H*py
      ];
      var mn = Infinity, mx = -Infinity;
      for (var k = 0; k < corners.length; k++) {
        if (corners[k] < mn) mn = corners[k];
        if (corners[k] > mx) mx = corners[k];
      }
      var span = mx - mn;
      
      var sp = 55;
      
      var n = Math.max(1, Math.round(span / sp));
      var step = span / (n + 1);

      var rA = [0, W*COS, H*SIN, W*COS + H*SIN];
      var rn = Infinity, rx = -Infinity;
      for (var k = 0; k < rA.length; k++) {
        if (rA[k] < rn) rn = rA[k];
        if (rA[k] > rx) rx = rA[k];
      }
      var diag = (rx - rn) * 1.4;

      var op = '0.35';
      var lw = 1.6;

      for (var i = 0; i < n; i++) {
        var pv = mn + (i + 1) * step;
        var ox = pv * px, oy = pv * py;
        lineData.push({
          x1: ox - diag * COS, y1: oy - diag * SIN,
          x2: ox + diag * COS, y2: oy + diag * SIN,
          opacity: op, lw: lw,
          p: 0 // Propiedad de progreso para GSAP
        });
      }
      return n;
    }

    function drawLine(d, p) {
      var dx = d.x2 - d.x1, dy = d.y2 - d.y1;
      if (p < 0.005) return;
      var eX = d.x1 + dx * p, eY = d.y1 + dy * p;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(d.x1, d.y1);
      ctx.lineTo(eX, eY);
      ctx.strokeStyle = 'rgba(220, 190, 80, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }

    resize();
    var totalLines = build();

    function drawAll() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < totalLines; i++) {
        drawLine(lineData[i], lineData[i].p);
      }
    }

    var canvasTl = null;
    window.startHeroCanvasAnimation = function() {
      if (canvasTl) canvasTl.kill();
      // Ensure GSAP is loaded
      if (typeof gsap === 'undefined') {
        drawAll(); // fallback
        return;
      }
      
      lineData.forEach(function(d) { d.p = 0; });
      gsap.ticker.add(drawAll);
      
      canvasTl = gsap.to(lineData, {
        p: 1,
        duration: 3,
        ease: "power2.inOut",
        onComplete: function() {
          gsap.ticker.remove(drawAll);
          drawAll(); // draw one last time cleanly
        }
      });
    };

    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        if (canvasTl) canvasTl.kill();
        if (typeof gsap !== 'undefined') gsap.ticker.remove(drawAll);
        resize();
        totalLines = build();
        // Cuando se redimensiona, dibujar todo completo instantáneamente
        lineData.forEach(function(d) { d.p = 1; });
        drawAll();
      }, 200);
    });
  })();

  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- GSAP + SCROLLTRIGGER — ALL SECTIONS --------------------------------
  var gsapAnims = [];
  function initGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    function ad(targets, vars) { gsapAnims.push(gsap.from(targets, vars)); }
    var ac = document.querySelector('.about-collage');
    var at = document.querySelector('.about-text');
    var ap = document.querySelectorAll('.about-collage .collage-card');
    var cf = document.querySelector('.collage-inner');
    if (ap.length) {
      ad(ap, { scrollTrigger: { trigger: ac, start: 'top 82%' }, opacity: 0, y: 40, scale: 0.96, duration: 0.8, stagger: 0.18, ease: 'power3.out' });
      if (cf) ad(cf, { scrollTrigger: { trigger: ac, start: 'top 82%' }, opacity: 0, scale: 0.92, duration: 0.7, delay: 0.1, ease: 'power2.out' });
    }
    if (at) ad(at, { scrollTrigger: { trigger: at, start: 'top 82%' }, opacity: 0, x: 60, duration: 0.9, ease: 'power3.out' });
    var sh = document.querySelector('.services-header');
    var sc = document.querySelectorAll('.service-card');
    if (sh) ad(sh, { scrollTrigger: { trigger: sh, start: 'top 85%' }, opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' });
    if (sc.length) ad(sc, { scrollTrigger: { trigger: sc[0].parentElement, start: 'top 82%' }, opacity: 0, y: 50, stagger: 0.12, duration: 0.7, ease: 'back.out(1.2)' });
    var sb = document.querySelector('.services-bottom');
    if (sb) ad(sb, { scrollTrigger: { trigger: sb, start: 'top 90%' }, opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' });
    var gh = document.querySelector('.gallery-header');
    var gf = document.querySelector('.gallery-filters');
    var gi = document.querySelectorAll('.gallery-item');
    if (gh) ad(gh, { scrollTrigger: { trigger: gh, start: 'top 85%' }, opacity: 0, y: 30, duration: 0.7, ease: 'power2.out' });
    if (gf) ad(gf, { scrollTrigger: { trigger: gf, start: 'top 85%' }, opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
    if (gi.length) ad(gi, { scrollTrigger: { trigger: gi[0].parentElement, start: 'top 80%' }, opacity: 0, y: 40, stagger: 0.06, duration: 0.6, ease: 'power2.out' });
    var wv = document.getElementById('whyVideo');
    var wr = document.getElementById('whyRight');
    var wi = document.querySelectorAll('.why-feat-item');
    if (wv) ad(wv, { scrollTrigger: { trigger: wv, start: 'top 80%' }, opacity: 0, x: -50, scale: 0.95, duration: 0.9, ease: 'power3.out' });
    if (wr) ad(wr, { scrollTrigger: { trigger: wr, start: 'top 80%' }, opacity: 0, x: 60, duration: 0.9, ease: 'power3.out' });
    if (wi.length) ad(wi, { scrollTrigger: { trigger: wi[0].parentElement, start: 'top 80%' }, opacity: 0, y: 30, stagger: 0.12, duration: 0.6, ease: 'power2.out' });
    var ct = document.querySelector('.cert-text');
    var cv = document.querySelector('.cert-visual');
    if (ct) ad(ct, { scrollTrigger: { trigger: ct, start: 'top 82%' }, opacity: 0, x: -50, duration: 0.9, ease: 'power3.out' });
    if (cv) ad(cv, { scrollTrigger: { trigger: cv, start: 'top 82%' }, opacity: 0, rotationY: -15, scale: 0.95, duration: 1, ease: 'power3.out', transformOrigin: 'center center' });
    var sg = document.querySelector('#social-proof .social-grid');
    if (sg && sg.children.length) ad(sg.children, { scrollTrigger: { trigger: sg, start: 'top 85%' }, opacity: 0, y: 30, stagger: 0.15, duration: 0.7, ease: 'power2.out' });
    var ci = document.querySelector('.contact-inner');
    if (ci) ad(ci, { scrollTrigger: { trigger: ci, start: 'top 85%' }, opacity: 0, y: 40, scale: 0.97, duration: 0.9, ease: 'power3.out' });
  }
  function killGsap() {
    gsapAnims.forEach(function(a) { if (a.scrollTrigger) a.scrollTrigger.kill(); a.kill(); });
    gsapAnims = [];
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.getAll().forEach(function(t) { t.kill(); });
  }
  initGsap();
  document.addEventListener('astro:page-load', function() { killGsap(); initGsap(); });

  // ---- COUNT-UP ----
  var countObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        var current = 0;
        var duration = 1200;
        var start = performance.now();
        function step(now) {
          var p = Math.min((now - start) / duration, 1);
          var val = Math.round(p * target);
          el.textContent = val + (target >= 500 ? '+' : '');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-count]').forEach(function(el) {
    countObserver.observe(el);
  });

  // ---- CORTES OVERLAY (standalone — only on button click) --------------------
  var cortesFloat = document.getElementById('cortesFloat');
  var cortesFloatBtn = document.getElementById('cortesFloatBtn');
  var cortesSection = document.getElementById('cortes');
  var cortesClose = document.getElementById('cortesClose');
  var cortesOkBtn = document.getElementById('cortesOkBtn');
  var heroSec = document.getElementById('hero');
  var serviciosSec = document.getElementById('servicios');
  if (cortesFloat && serviciosSec) {
    var serviciosObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        cortesFloat.classList.toggle('visible', entry.isIntersecting);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -20% 0px' });
    serviciosObs.observe(serviciosSec);
  }

  var cortesScroll = document.getElementById('cortesScroll');
  function onCortesWheel(e) {
    if (!cortesSection.classList.contains('open')) return;
    var el = document.getElementById('cortesScroll');
    if (!el) return;
    var dx = (e.deltaY || e.deltaX) * 4;
    el.scrollLeft += dx;
    if (dx !== 0) e.preventDefault();
  }
  function openCortes() {
    if (!cortesSection) return;
    cortesSection.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function() {
      cortesSection.classList.add('open');
      if (cortesScroll) cortesScroll.scrollLeft = 0;
      if (typeof gsap !== 'undefined') {
        var cards = cortesSection.querySelectorAll('.cortes-card, .cortes-card-end');
        gsap.from(cards, { opacity: 0, x: 80, stagger: 0.08, duration: 0.7, ease: 'power3.out' });
      }
    });
    window.addEventListener('wheel', onCortesWheel, { passive: false });
  }
  function closeCortes() {
    if (!cortesSection) return;
    cortesSection.classList.remove('open');
    document.body.style.overflow = '';
    window.removeEventListener('wheel', onCortesWheel, { passive: false });
    setTimeout(function() {
      cortesSection.style.display = 'none';
      if (serviciosSec) serviciosSec.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }
  if (cortesFloatBtn) cortesFloatBtn.addEventListener('click', openCortes);
  if (cortesClose) cortesClose.addEventListener('click', closeCortes);
  if (cortesOkBtn) cortesOkBtn.addEventListener('click', closeCortes);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cortesSection && cortesSection.classList.contains('open')) closeCortes();
  });

  // ---- VISAGISMO OVERLAY (standalone — only on nav click) -------------------
  var visOverlay = document.getElementById('visagismoOverlay');
  var visClose = document.getElementById('visagismoClose');
  window.openVisagismo = function() {
    if (!visOverlay) return;
    visOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function() {
      visOverlay.classList.add('open');
      var header = visOverlay.querySelector('.visagismo-header');
      var cards = visOverlay.querySelectorAll('.vf-card');
      if (typeof gsap !== 'undefined') {
        var tl = gsap.timeline();
        if (header) tl.from(header, { opacity: 0, y: 30, duration: 0.5, ease: 'power2.out' });
        if (cards.length) tl.from(cards, { opacity: 0, y: 40, stagger: 0.06, duration: 0.5, ease: 'back.out(1.2)' }, '-=0.2');
      }
    });
  };
  function closeVisagismo() {
    if (!visOverlay) return;
    visOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function() {
      visOverlay.style.display = 'none';
    }, 300);
  }
  if (visClose) visClose.addEventListener('click', closeVisagismo);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && visOverlay && visOverlay.classList.contains('open')) closeVisagismo();
  });

  // ---- 3D tilt on cert frame ------------------------------------------------
  var certVisual = document.querySelector('.cert-visual');
  if (certVisual && !('ontouchstart' in window)) {
    var frame = certVisual.querySelector('.cert-frame');
    var maxTilt = 12;
    var tiltTimer;
    
    certVisual.addEventListener('mouseenter', function() {
      frame.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
      clearTimeout(tiltTimer);
      tiltTimer = setTimeout(function() {
        frame.style.transition = 'none'; // Remove transition during continuous move
      }, 150);
    });

    certVisual.addEventListener('mousemove', function(e) {
      requestAnimationFrame(function() {
        var rect = certVisual.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        var tiltX = -dy * maxTilt;
        var tiltY = dx * maxTilt;
        frame.style.transform = 'perspective(1200px) rotateX(' + tiltX.toFixed(1) + 'deg) rotateY(' + tiltY.toFixed(1) + 'deg) translateZ(20px) scale(1.01)';
        frame.style.boxShadow = '0 0 60px rgba(201,168,76,.18), 0 20px 60px rgba(0,0,0,.4)';
      });
    });

    certVisual.addEventListener('mouseleave', function() {
      clearTimeout(tiltTimer);
      frame.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease';
      frame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
      frame.style.boxShadow = '0 0 40px rgba(201,168,76,.08)';
      
      tiltTimer = setTimeout(function() {
        frame.style.transition = '';
      }, 500);
    });
  }



  var filterBtns = document.querySelectorAll('.gallery-filters button');
  var galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      galleryItems.forEach(function(item) {
        var cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.opacity = '0';
          setTimeout(function(){ if (item.getAttribute('data-category') !== filter && filter !== 'all') item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ---- HERO animation kicks off on load ----
  setTimeout(animateHero, 1700);


  window.toggleVisagismo = function(btn) {
    var card = btn.closest('.vf-card');
    if (!card) return;
    var expanded = card.classList.toggle('expanded');
    var arrow = btn.querySelector('.arrow');
    if (arrow) arrow.textContent = expanded ? '↑' : '↓';
    btn.textContent = expanded ? 'Ocultar ' : 'Ver cortes ';
    if (arrow) btn.appendChild(arrow);
  };

  // Bloquear pinch-zoom en móvil (Safari iOS / Android)
  if (window.matchMedia('(pointer: coarse)').matches) {
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(function(type) {
      document.addEventListener(type, function(e) {
        e.preventDefault();
      }, { passive: false });
    });

    document.addEventListener('touchmove', function(e) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }
})();


