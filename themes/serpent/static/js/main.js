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
  var nav = document.querySelector('.site-nav');
  var overlay = document.getElementById('nav-overlay');

  if (!btn || !nav) return;

  function openNav() {
    nav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function() {
    nav.classList.contains('open') ? closeNav() : openNav();
  });
  if (overlay) overlay.addEventListener('click', closeNav);
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
