// ── Carousel ──────────────────────────────────────────────────────────────────
(function () {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let current = 0;
  let timer;

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5500);
  }

  document.querySelector('.carousel-btn.next')?.addEventListener('click', () => { next(); startTimer(); });
  document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => { prev(); startTimer(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startTimer(); }));

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startTimer(); }
  }, { passive: true });

  goTo(0);
  startTimer();
})();

// ── Mobile nav ────────────────────────────────────────────────────────────────
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
})();

// Dark mode
(function() {
  var toggle = document.getElementById('dark-toggle');
  var saved = localStorage.getItem('ds-theme');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ds-theme', theme);
    if (toggle) toggle.textContent = theme === 'dark' ? '☀' : '☽';
  }

  // Apply saved preference immediately
  if (saved) setTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();
