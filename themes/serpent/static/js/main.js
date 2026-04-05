// ── Dark mode ──
(function() {
  var toggle = document.getElementById('dark-toggle');
  var saved = localStorage.getItem('ds-theme');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ds-theme', theme);
    if (toggle) toggle.textContent = theme === 'dark' ? '☀' : '☽';
  }

  if (saved) setTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();

// ── Mobile nav drawer ──
(function() {
  var btn = document.querySelector('.nav-toggle');
  var closeBtn = document.getElementById('nav-close');
  var nav = document.querySelector('.site-nav');

  if (!btn || !nav) return;

  function openNav() {
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function() {
    nav.classList.contains('open') ? closeNav() : openNav();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  // Close when a nav link is clicked
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeNav);
  });
})();

// ── Netlify Identity ──
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', function(user) {
    if (!user) {
      window.netlifyIdentity.on('login', function() {
        document.location.href = '/admin/';
      });
    }
  });
}

// ── Reading progress bar ──
(function() {
  var bar = document.getElementById('progress-bar');
  if (!bar) return;

  // Only show on article pages
  var article = document.querySelector('.post-content');
  if (!article) return;

  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
})();

// ── Back to top button ──
(function() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function() {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── Scroll fade-in ──
(function() {
  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(function(el) { observer.observe(el); });
})();

// ── Article hero parallax ──
(function() {
  var hero = document.querySelector('.post-hero-img');
  if (!hero) return;

  function onScroll() {
    var scrolled = window.scrollY;
    hero.style.transform = 'translateY(' + (scrolled * 0.25) + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── Keyboard shortcuts ──
(function() {
  document.addEventListener('keydown', function(e) {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // D = dark mode toggle
    if (e.key === 'd' || e.key === 'D') {
      var current = document.documentElement.getAttribute('data-theme');
      var toggle = document.getElementById('dark-toggle');
      if (toggle) toggle.click();
    }

    // F = focus search
    if (e.key === 'f' || e.key === 'F') {
      var searchInput = document.getElementById('filter-search') ||
                        document.querySelector('.pagefind-ui__search-input');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      } else {
        window.location.href = '/search/';
      }
    }
  });
})();

// ── Carousel ──
(function() {
  var track = document.querySelector('.carousel-track');
  var slides = document.querySelectorAll('.carousel-slide');
  var dots = document.querySelectorAll('.carousel-dot');
  var prev = document.querySelector('.carousel-btn.prev');
  var next = document.querySelector('.carousel-btn.next');

  if (!track || !slides.length) return;

  var current = 0;
  var total = slides.length;
  var autoTimer;

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoTimer = setInterval(function() { goTo(current + 1); }, 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prev) prev.addEventListener('click', function() { goTo(current - 1); resetAuto(); });
  if (next) next.addEventListener('click', function() { goTo(current + 1); resetAuto(); });

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); resetAuto(); });
  });

  // Touch/swipe support
  var startX = 0;
  track.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  }, { passive: true });

  startAuto();
})();
