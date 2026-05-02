(function () {
  var overlay = document.getElementById('ds-overlay');
  var newsletterPopup = document.getElementById('ds-newsletter-popup');
  var donationsPopup = document.getElementById('ds-donations-popup');
  var newsletterClose = document.getElementById('ds-newsletter-close');
  var donationsClose = document.getElementById('ds-donations-close');

  if (!overlay || !newsletterPopup) return;

  function isVisible(el) {
    return el && el.style.display === 'block';
  }

  function showPopup(popup) {
    popup.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function hideAll() {
    if (newsletterPopup) newsletterPopup.style.display = 'none';
    if (donationsPopup) donationsPopup.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Close buttons
  if (newsletterClose) newsletterClose.addEventListener('click', hideAll);
  if (donationsClose) donationsClose.addEventListener('click', hideAll);

  // Click outside (overlay)
  overlay.addEventListener('click', hideAll);

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideAll();
  });

  // Newsletter: 8s delay, once per session, sitewide
  if (!sessionStorage.getItem('ds-newsletter-shown')) {
    setTimeout(function () {
      if (!isVisible(newsletterPopup) && !isVisible(donationsPopup)) {
        showPopup(newsletterPopup);
        sessionStorage.setItem('ds-newsletter-shown', '1');
      }
    }, 8000);
  }

  // Donations: 50% scroll, once per session, articles only
  if (donationsPopup && !sessionStorage.getItem('ds-donations-shown')) {
    var donationsTriggered = false;

    function onScroll() {
      if (donationsTriggered) return;

      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (pct >= 50) {
        donationsTriggered = true;
        window.removeEventListener('scroll', onScroll);
        sessionStorage.setItem('ds-donations-shown', '1');

        if (!isVisible(newsletterPopup)) {
          showPopup(donationsPopup);
        } else {
          // Newsletter currently showing — wait for it to be dismissed
          var poll = setInterval(function () {
            if (!isVisible(newsletterPopup) && !isVisible(donationsPopup)) {
              clearInterval(poll);
              showPopup(donationsPopup);
            }
          }, 500);
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
