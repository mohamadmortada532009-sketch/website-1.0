/**
 * Lebanon Computer & Laptop Directory — application entry point.
 *
 * This file wires together small, single-purpose modules that previously lived
 * as one densely-packed script. The behaviour is unchanged; only the structure
 * has been separated so each concern can be read, tested and changed in
 * isolation.
 *
 *   CONFIG              — tunable constants and the offline fallback dataset
 *   DOM / escapeHtml    — tiny DOM + formatting helpers
 *   StoreType           — store classification & condition rules (open for extension)
 *   StoreCsv            — CSV parsing + row-to-store mapping
 *   StoreRepository     — owns the in-memory collection and the load pipeline
 *   StoreFilters        — pure predicate that decides which stores are visible
 *   StoreView           — all DOM rendering (cards, pins, counts, options)
 *   DirectoryController — orchestrates state, rendering and user events
 *
 * Public API preserved: window.getStoreData() still returns the current stores,
 * and the `parseCSV` / `load` names remain available for build.js compatibility.
 */

/* ------------------------------------------------------------------ *
 * 1. CONFIG
 * ------------------------------------------------------------------ */

const CONFIG = Object.freeze({
  csvUrl: 'stores.csv',
  featuredCount: 2,
  maxPins: 24,
  // How many store cards to reveal at once. Keeps the directory from dumping
  // all 80+ results into one endless scroll; 'Load more' reveals the next batch.
  pageSize: 9,
});

/** Offline fallback used when the CSV cannot be fetched. */
const FALLBACK_STORES = [
  {
    name: 'PC and Parts',
    region: 'Top Lebanon Stores',
    location: 'Furn El Chebbak, Mount Lebanon',
    phone: '+961 1 285 222',
    website: 'https://pcandparts.com',
    social: 'https://www.instagram.com/pcandparts/',
    notes: 'Custom PC builder, GPU components, gaming laptops & peripherals',
    type: 'Custom PC Builder',
    condition: 'New',
  },
  {
    name: 'Ayoub Computers',
    region: 'Top Lebanon Stores',
    location: 'Badaro / Hamra / Mar Elias, Beirut',
    phone: '+961 1 388 830',
    website: 'https://ayoubcomputers.com',
    social: 'https://www.instagram.com/ayoubcomputers/',
    notes: 'Major retailer for laptops, gaming hardware, workstations & accessories',
    type: 'Retail & Repairs',
    condition: 'New',
  },
  {
    name: 'Laptops King',
    region: 'Bekaa - Baalbek - Hermel',
    location: 'Joub Jannine, West Bekaa',
    phone: '+961 8 861 111',
    website: 'https://laptopsking.com',
    social: 'https://www.instagram.com/laptopsking.lb/',
    notes: 'Open-box laptop deals, gaming laptops & budget notebooks',
    type: 'Refurbished Specialist',
    condition: 'Open-box',
  },
  {
    name: 'iSTYLE Lebanon',
    region: 'Beirut - Baabda - Mount Leb',
    location: 'City Centre Beirut, Hazmieh / ABC Achrafieh',
    phone: '+961 1 285 555',
    website: 'https://istyle.com.lb',
    social: 'https://www.instagram.com/istylelebanon/',
    notes: 'Official Apple Premium Reseller: MacBooks, iMacs, iPads & service',
    type: 'Apple Reseller',
    condition: 'New',
  },
  {
    name: 'Microcity Lebanon',
    region: 'Bekaa - Baalbek - Hermel',
    location: 'Zahle Main Boulevard, Bekaa',
    phone: '+961 8 810 200',
    website: '',
    social: 'https://www.facebook.com/MicrocityZahle/',
    notes: 'IT center offering laptops, PCs & repair services',
    type: 'Retail & Repairs',
    condition: 'New',
  },
  {
    name: 'Safa Computers',
    region: 'Beirut - Baabda - Mount Leb',
    location: 'Haret Hreik Main Road, Dahyeh / Beirut',
    phone: '+961 1 556 612',
    website: 'https://safalb.com',
    social: 'https://www.instagram.com/safacomputers.lb/',
    notes: 'New & refurbished laptops, desktops, accessories & POS gear',
    type: 'Refurbished Specialist',
    condition: 'Open-box',
  },
];

/* ------------------------------------------------------------------ *
 * 2. Small DOM / formatting helpers
 * ------------------------------------------------------------------ */

const DOM = {
  /** querySelector by CSS selector. */
  select: (selector, root = document) => root.querySelector(selector),
  /** querySelectorAll by CSS selector, returned as a real array. */
  selectAll: (selector, root = document) => Array.from(root.querySelectorAll(selector)),
  /** Bind the same handler to an element if it exists. */
  on: (target, event, handler) => target && target.addEventListener(event, handler),
};

const HTML_ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value before injecting it into innerHTML. */
const escapeHtml = (value) =>
  String(value || '').replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);

/** Derive up-to-two-letter initials from a store name. */
const initialsOf = (name) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/* ------------------------------------------------------------------ *
 * 3. Store classification (rules, not branching)
 *    Adding a new store type is a new rule — the classifier code stays put.
 * ------------------------------------------------------------------ */

const StoreType = (() => {
  // NOTE: the pattern property must NOT be called `test` — a RegExp is not
  // callable, so `rule.test(notes)` would try to invoke the regex object
  // itself and throw "rule.test is not a function". Keep the name distinct
  // from RegExp's own method.
  const TYPE_RULES = [
    { type: 'Apple Reseller', pattern: /apple/i },
    { type: 'Refurbished Specialist', pattern: /refurb|open-box|used|pre-owned|secondhand/i },
    { type: 'Custom PC Builder', pattern: /gaming|custom|gpu|rig/i },
  ];

  const REFURB_CONDITION = /refurb|open-box|used|pre-owned|secondhand/i;

  const classifyType = (notes) =>
    (TYPE_RULES.find((rule) => rule.pattern.test(notes)) || { type: 'Retail & Repairs' }).type;

  const classifyCondition = (notes) => (REFURB_CONDITION.test(notes) ? 'Open-box' : 'New');

  return { classifyType, classifyCondition };
})();

/* ------------------------------------------------------------------ *
 * 4. CSV parsing
 * ------------------------------------------------------------------ */

const StoreCsv = (() => {
  const normalizeUrl = (value) => (value === 'Unknown' ? '' : value);

  /** Split raw CSV text into a matrix of trimmed cells, honouring quotes. */
  const tokenize = (text) => {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"' && inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') i += 1;
        row.push(cell.trim());
        if (row.some(Boolean)) rows.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }

    if (cell || row.length) {
      row.push(cell.trim());
      rows.push(row);
    }
    return rows;
  };

  /** Map one raw CSV row (keyed by lower-cased header) to a Store object. */
  const toStore = (record) => {
    const notes = record['specialties / notes'];
    return {
      name: record['store name'],
      region: record['category / region sheet'],
      location: record['location / address'],
      phone: record['phone number'],
      website: normalizeUrl(record['website link']),
      social: normalizeUrl(record['social media link']),
      notes,
      type: StoreType.classifyType(notes),
      condition: StoreType.classifyCondition(notes),
    };
  };

  /**
   * Parse CSV text into Store objects. The name is kept global for parity with
   * the original script surface.
   */
  const parseCSV = (text) => {
    const rows = tokenize(text);
    if (!rows.length) return [];

    const headers = rows.shift().map((header) => header.toLowerCase());
    return rows.map((row) =>
      toStore(Object.fromEntries(headers.map((header, index) => [header, row[index] || '']))),
    );
  };

  return { parseCSV };
})();

const parseCSV = StoreCsv.parseCSV;

/* ------------------------------------------------------------------ *
 * 5. Store repository — owns the collection and the load pipeline
 * ------------------------------------------------------------------ */

const StoreRepository = (() => {
  let stores = [];

  const getAll = () => stores;

  /** Fetch CSV (or embedded copy), falling back to the bundled dataset. */
  async function load() {
    try {
      if (window.__STORES_CSV) {
        stores = parseCSV(window.__STORES_CSV);
      } else {
        const response = await fetch('stores.csv');
        if (!response.ok) throw Error();
        stores = parseCSV(await response.text());
      }
    } catch {
      stores = FALLBACK_STORES;
    }
    return stores;
  }

  return { getAll, load };
})();

// Backwards-compatible global accessor.
window.getStoreData = () => StoreRepository.getAll();

/* ------------------------------------------------------------------ *
 * 6. Filtering — pure, side-effect-free predicate
 * ------------------------------------------------------------------ */

const StoreFilters = (() => {
  const matchesQuery = (store, query) =>
    !query || Object.values(store).join(' ').toLowerCase().includes(query);

  const distinctSorted = (key) =>
    [...new Set(StoreRepository.getAll().map((store) => store[key]))].sort();

  /** Build the FilterState from the current DOM inputs. */
  const readState = () => ({
    query: (DOM.select('#search').value || DOM.select('#hero-search').value).toLowerCase().trim(),
    region: DOM.select('#region').value,
    type: DOM.select('#type').value,
    conditions: DOM.selectAll('.condition:checked').map((input) => input.value),
  });

  /** Apply a FilterState to the repository contents. */
  const apply = (state) =>
    StoreRepository.getAll().filter(
      (store) =>
        matchesQuery(store, state.query) &&
        (state.region === 'all' || store.region === state.region) &&
        (state.type === 'all' || store.type === state.type) &&
        (!state.conditions.length || state.conditions.includes(store.condition)),
    );

  return { readState, apply, distinctSorted };
})();

/* ------------------------------------------------------------------ *
 * 7. View — every DOM write lives here
 * ------------------------------------------------------------------ */

const StoreView = (() => {
  const els = () => ({
    count: DOM.select('#count'),
    cards: DOM.select('#cards'),
    pins: DOM.select('#pins'),
    region: DOM.select('#region'),
    type: DOM.select('#type'),
  });

  const storeCard = (store, index) => {
    const featured = index < CONFIG.featuredCount;
    return `<article class="card ${featured ? 'featured' : ''}">
      <div class="card-top">
        <div class="logo">${initialsOf(store.name)}</div>
        <div class="card-info">
          <h3>${escapeHtml(store.name)} ${featured ? '<span class="verified-mark">✓</span>' : ''}</h3>
          <span class="location">⌖ ${escapeHtml(store.location)}</span>
        </div>
        <span class="verified-mark">${featured ? 'Featured' : ''}</span>
      </div>
      <p class="snippet">${escapeHtml(store.notes)}</p>
      <div class="card-foot">
        <span class="tag">${escapeHtml(store.type)}</span>
        <a class="profile-link" target="_blank" href="${store.website || store.social || '#'}">View profile ↗</a>
      </div>
    </article>`;
  };

  const mapPin = (store, index) =>
    `<button class="map-pin ${index < CONFIG.featuredCount ? 'featured' : ''}" title="${escapeHtml(
      store.name,
    )}" style="left:${18 + ((index * 37) % 68)}%;top:${18 + ((index * 29) % 68)}%"></button>`;

  const EMPTY_STATE =
    '<div class="empty">No stores match those filters.<br><button id="empty-clear">Clear filters</button></div>';

  /** Populate the region/type <select> options. */
  const renderFilterOptions = () => {
    const { region, type } = els();
    const regions = StoreFilters.distinctSorted('region');
    const types = StoreFilters.distinctSorted('type');
    region.innerHTML =
      '<option value="all">All of Lebanon</option>' +
      regions.map((value) => `<option>${escapeHtml(value)}</option>`).join('');
    type.innerHTML =
      '<option value="all">All store types</option>' +
      types.map((value) => `<option>${escapeHtml(value)}</option>`).join('');
  };

  /**
   * Repaint the count, card grid and map pins for a list of stores.
   *
   * `visibleCount` caps how many cards are painted at once so a large result
   * set does not become an endless scroll. When more results remain, a
   * "Load more" control is appended that the controller wires up.
   */
  const render = (list, visibleCount = CONFIG.pageSize) => {
    const { count, cards, pins } = els();
    count.textContent = `${list.length} store${list.length === 1 ? '' : 's'}`;

    if (!list.length) {
      cards.innerHTML = EMPTY_STATE;
      pins.innerHTML = '';
      return;
    }

    const shown = list.slice(0, visibleCount);
    const remaining = list.length - shown.length;

    cards.innerHTML =
      shown.map(storeCard).join('') +
      (remaining > 0
        ? `<div class="directory-more">
             <button class="directory-loadmore" type="button" data-loadmore>
               Load ${Math.min(remaining, CONFIG.pageSize)} more
               <span class="directory-loadmore-count">(${remaining} left)</span>
             </button>
           </div>`
        : '');

    pins.innerHTML = shown.slice(0, CONFIG.maxPins).map(mapPin).join('');
  };

  return { renderFilterOptions, render };
})();

/* ------------------------------------------------------------------ *
 * 8. Controller — orchestration + event wiring
 * ------------------------------------------------------------------ */

const DirectoryController = (() => {
  // How many cards are currently shown in the directory. Reset to one page
  // whenever the filters change, so a new search always starts small.
  let visibleCount = CONFIG.pageSize;

  const renderCurrent = () => {
    const list = StoreFilters.apply(StoreFilters.readState());
    // Never show more than the matches, and never fewer than one page.
    visibleCount = Math.min(Math.max(visibleCount, CONFIG.pageSize), list.length || CONFIG.pageSize);
    StoreView.render(list, visibleCount);
  };

  /**
   * Re-run the filters and start from the first page again. Used by every
   * filter input, so a new search never inherits a previously expanded list.
   */
  const renderFresh = () => {
    visibleCount = CONFIG.pageSize;
    renderCurrent();
  };

  /** Reveal the next batch of results (called by the "Load more" button). */
  const showMore = () => {
    visibleCount += CONFIG.pageSize;
    renderCurrent();
  };

  const resetFilters = () => {
    ['search', 'hero-search'].forEach((id) => {
      DOM.select(`#${id}`).value = '';
    });
    DOM.select('#region').value = 'all';
    DOM.select('#type').value = 'all';
    DOM.selectAll('.condition').forEach((input) => {
      input.checked = false;
    });
    renderFresh();
  };

  const bindSearchInputs = () => {
    // Filter changes always start a fresh, first-page result set.
    ['search', 'hero-search'].forEach((id) => DOM.on(DOM.select(`#${id}`), 'input', renderFresh));
    ['region', 'type'].forEach((id) => DOM.on(DOM.select(`#${id}`), 'change', renderFresh));
    DOM.selectAll('.condition').forEach((input) => DOM.on(input, 'change', renderFresh));
    DOM.on(DOM.select('#clear'), 'click', resetFilters);
    DOM.on(DOM.select('#hero-button'), 'click', () => DOM.select('#directory').scrollIntoView());
    DOM.on(document, 'click', (event) => {
      if (event.target.id === 'empty-clear') resetFilters();
      // The "Load more" control is re-rendered with the grid, so delegate.
      if (event.target.closest('[data-loadmore]')) showMore();
    });
  };

  const bindCategoryButtons = () => {
    DOM.selectAll('.category').forEach((button) =>
      DOM.on(button, 'click', () => {
        DOM.selectAll('.category').forEach((other) => other.classList.remove('active'));
        button.classList.add('active');
        resetFilters();
        if (button.dataset.region) DOM.select('#region').value = button.dataset.region;
        if (button.dataset.condition) {
          DOM.select(`.condition[value="${button.dataset.condition}"]`).checked = true;
        }
        renderCurrent();
        DOM.select('#directory').scrollIntoView({ behavior: 'smooth' });
      }),
    );
  };

  const bindVendorDialog = () => {
    const dialog = DOM.select('#vendor');
    DOM.selectAll('[data-vendor]').forEach((button) =>
      DOM.on(button, 'click', () => dialog.showModal()),
    );
    DOM.on(DOM.select('[data-close]'), 'click', () => dialog.close());
    DOM.on(DOM.select('#vendor-form'), 'submit', (event) => {
      event.preventDefault();
      event.target.innerHTML =
        '<p class="verified">✓ <span><b>Welcome to the portal.</b><small>Your vendor dashboard is ready for the next step.</small></span></p>';
    });
  };

  async function init() {
    await StoreRepository.load();
    StoreView.renderFilterOptions();
    renderCurrent();
    bindSearchInputs();
    bindCategoryButtons();
    bindVendorDialog();
  }

  return { init };
})();

DirectoryController.init();