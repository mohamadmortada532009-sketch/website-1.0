/**
 * Hero "Field Atlas" pointer interactivity.
 *
 * Reports the pointer position over .hero-art as two normalised custom
 * properties (--mx, --my in the range -1..1) and toggles an `is-active` class
 * on enter/leave. All of the actual movement lives in hero-interactive.css, so
 * this file stays a thin, cheap input layer: it writes two values and lets the
 * compositor do the rest via transforms.
 *
 * It also wires the floating device cards ("MacBook Pro 14", "Custom Gaming
 * PC"): clicking one opens the laptop detail dialog (laptop-detail.js) for the
 * device it represents. If a card has no matching detail entry yet, it falls
 * back to running a directory search for its specialty.
 *
 * Degrades gracefully: if the element is missing, or the user prefers reduced
 * motion, or the device has no hover, nothing is bound.
 */
(() => {
  const atlas = document.querySelector('.hero-art');
  if (!atlas) return;

  /* ---------------------------------------------------------------- *
   * Device-card click: open the laptop detail dialog for this device.
   * The dialog owns the data; here we only pass it a key. If no detail
   * entry exists yet we fall back to a directory search.
   * ---------------------------------------------------------------- */
  const jumpToDirectory = (term) => {
    const directory = document.querySelector('#directory');
    const search = document.querySelector('#search');
    const heroSearch = document.querySelector('#hero-search');

    // Keep the two search fields from disagreeing: app.js reads whichever is
    // non-empty, so clear the hero box when we jump with the directory box.
    if (search) {
      if (heroSearch) heroSearch.value = '';
      search.value = term;
      search.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (heroSearch) {
      heroSearch.value = term;
      heroSearch.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (directory) directory.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  atlas.querySelectorAll('[data-search]').forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.dataset.search;
      if (typeof window.openLaptopDetail === 'function') {
        window.openLaptopDetail(key);
      } else {
        // Detail dialog not available — fall back to searching the directory.
        jumpToDirectory(key);
      }
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hasHover = window.matchMedia('(hover: hover)');

  // Keep the pointer listener off entirely when motion is unwelcome or the
  // device cannot hover — the CSS hover fallbacks still apply.
  if (prefersReducedMotion.matches || !hasHover.matches) {
    // Still allow the gentle 'is-active' visual state on desktop hover.
    atlas.addEventListener('mouseenter', () => atlas.classList.add('is-active'));
    atlas.addEventListener('mouseleave', () => atlas.classList.remove('is-active'));
    return;
  }

  let frame = 0;

  /** Normalise the pointer to -1..1 across the atlas box and store it. */
  const paint = (event) => {
    frame = 0;
    const rect = atlas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const mx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const my = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    // Clamp so fast exits past the edge do not fling the layers offscreen.
    const clamp = (value) => Math.max(-1, Math.min(1, value));
    atlas.style.setProperty('--mx', clamp(mx).toFixed(3));
    atlas.style.setProperty('--my', clamp(my).toFixed(3));
  };

  // Coalesce bursts of mousemove into one write per animation frame.
  const onMove = (event) => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => paint(event));
  };

  atlas.addEventListener('mouseenter', () => atlas.classList.add('is-active'));
  atlas.addEventListener('mousemove', onMove);

  atlas.addEventListener('mouseleave', () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    atlas.classList.remove('is-active');
    // Release the parallax so the layers spring back to their resting place.
    atlas.style.setProperty('--mx', '0');
    atlas.style.setProperty('--my', '0');
  });
})();
