/**
 * Laptop detail dialog.
 *
 * Clicking a hero device card opens a modal that shows a laptop's picture,
 * specs, price and what it is good for.
 *
 * ── HOW TO ADD REAL DATA ──────────────────────────────
 * Fill in (or add to) the LAPTOPS object below. Each entry is keyed by the
 * card's data-search value and has exactly the four sections the dialog
 * renders:
 *
 *   name    string        – display name
 *   image   string|null   – image URL; null shows a placeholder panel
 *   specs   string[]      – bullet list of hardware specs
 *   price   string        – price or price range, e.g. '$1,499'
 *   uses    string[]      – "what it's good for" use cases
 *
 * Anything still marked PLACEHOLDER is demo content and safe to replace.
 * Adding a new device is just a new key here — no code changes elsewhere.
 * ─────────────────────
 */
(() => {
  const LAPTOPS = {
    macbook: {
      name: 'MacBook Pro 14"',
      image: null, // PLACEHOLDER – set to an image URL when available
      specs: [
        'PLACEHOLDER · Apple M-series chip',
        'PLACEHOLDER · 16 GB unified memory',
        'PLACEHOLDER · 512 GB SSD',
        'PLACEHOLDER · 14-inch Liquid Retina XDR display',
      ],
      price: 'PLACEHOLDER · $1,799',
      uses: [
        'PLACEHOLDER · Design, photo & video editing',
        'PLACEHOLDER · Software development',
        'PLACEHOLDER · Everyday study & office work',
      ],
    },
    gaming: {
      name: 'Custom Gaming PC',
      image: null, // PLACEHOLDER – set to an image URL when available
      specs: [
        'PLACEHOLDER · Core i7 / Ryzen 7 CPU',
        'PLACEHOLDER · 32 GB RAM',
        'PLACEHOLDER · 1 TB NVMe SSD',
        'PLACEHOLDER · RTX-class dedicated GPU',
      ],
      price: 'PLACEHOLDER · $1,299',
      uses: [
        'PLACEHOLDER · 1080p/1440p gaming',
        'PLACEHOLDER · 3D rendering & AI workloads',
        'PLACEHOLDER · Streaming & content creation',
      ],
    },
  };

  // Build the dialog shell once and reuse it for every laptop.
  const buildDialog = () => {
    const dialog = document.createElement('dialog');
    dialog.id = 'laptop-detail';
    dialog.className = 'laptop-detail';
    dialog.innerHTML =
      '<button class="close" type="button" data-laptop-close aria-label="Close">×</button>' +
      '<div class="laptop-detail-body" data-laptop-body></div>';
    document.body.appendChild(dialog);
    return dialog;
  };

  /** Render one laptop entry into the body element. */
  const renderBody = (host, laptop) => {
    const specs = laptop.specs.map((item) => `<li>${item}</li>`).join('');
    const uses = laptop.uses.map((item) => `<li>${item}</li>`).join('');
    const visual = laptop.image
      ? `<img src="${laptop.image}" alt="${laptop.name}">`
      : '<span class="laptop-detail-placeholder">Image placeholder</span>';

    host.innerHTML = `
      <div class="laptop-detail-visual">${visual}</div>
      <div class="laptop-detail-info">
        <p class="eyebrow">DEVICE DETAIL</p>
        <h2>${laptop.name}</h2>
        <ul class="laptop-detail-specs">${specs}</ul>
        <p class="laptop-detail-price">${laptop.price}</p>
        <div class="laptop-detail-uses">
          <small>WHAT IT'S GOOD FOR</small>
          <ul>${uses}</ul>
        </div>
      </div>`;
  };

  const dialog = buildDialog();
  const body = dialog.querySelector('[data-laptop-body]');

  const open = (key) => {
    const laptop = LAPTOPS[key];
    if (!laptop) return;
    renderBody(body, laptop);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  const close = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  dialog.querySelector('[data-laptop-close]').addEventListener('click', close);

  // Clicking the dim backdrop (outside the body) closes the dialog.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  // Expose the open hook so the hero cards can trigger it.
  window.openLaptopDetail = open;
})();
