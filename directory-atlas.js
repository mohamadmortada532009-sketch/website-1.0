/**
 * Directory atlas — schematic Lebanon (not satellite / OSM).
 * Store pins use neighborhood lat/lng projected onto the same outline.
 */
(function () {
  const BOUNDS = { west: 35.05, east: 36.68, south: 33.02, north: 34.75 };
  const VB = { w: 520, h: 640, pad: 36 };

  const project = (lat, lng) => {
    const x =
      VB.pad + ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * (VB.w - VB.pad * 2);
    const y =
      VB.pad + ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * (VB.h - VB.pad * 2);
    return [x, y];
  };

  const toPath = (ring) =>
    ring
      .map((pt, i) => {
        const [x, y] = project(pt[0], pt[1]);
        return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z';

  /* Simplified political outline of Lebanon (coast, then south and east borders). */
  const LEBANON_RING = [
    [34.641, 35.978],
    [34.55, 35.9],
    [34.436, 35.83],
    [34.32, 35.73],
    [34.255, 35.658],
    [34.12, 35.65],
    [34.005, 35.618],
    [33.92, 35.56],
    [33.901, 35.47],
    [33.868, 35.468],
    [33.73, 35.448],
    [33.563, 35.365],
    [33.4, 35.28],
    [33.273, 35.195],
    [33.115, 35.138],
    [33.089, 35.26],
    [33.09, 35.48],
    [33.16, 35.64],
    [33.24, 35.78],
    [33.32, 35.84],
    [33.5, 35.86],
    [33.67, 35.91],
    [33.85, 36.05],
    [34.005, 36.24],
    [34.22, 36.47],
    [34.4, 36.54],
    [34.55, 36.4],
    [34.691, 36.33],
    [34.68, 36.12],
    [34.655, 36.02],
  ];

  const RIDGE = [
    [34.5, 36.05],
    [34.25, 35.92],
    [33.98, 35.78],
    [33.82, 35.68],
    [33.55, 35.55],
    [33.32, 35.48],
  ];

  const COAST_ROAD = [
    [34.45, 35.84],
    [34.25, 35.67],
    [33.98, 35.62],
    [33.89, 35.51],
    [33.56, 35.38],
    [33.27, 35.22],
  ];

  const DAMASCUS_ROAD = [
    [33.89, 35.52],
    [33.85, 35.64],
    [33.82, 35.85],
    [33.85, 36.05],
  ];

  /* Longer keys first so "zahle highway" wins over "beirut". */
  const PLACES = [
    ['joub jannine', 33.627, 35.782],
    ['qabb elias', 33.794, 35.823],
    ['nabi chit', 33.97, 36.12],
    ['furn el chebbak', 33.86, 35.525],
    ['haret hreik', 33.853, 35.51],
    ['hadi nasrallah', 33.85, 35.508],
    ['al jamous', 33.852, 35.505],
    ['corniche el mazraa', 33.878, 35.5],
    ['beirut central', 33.896, 35.506],
    ['downtown beirut', 33.896, 35.506],
    ['city centre', 33.853, 35.535],
    ['abc achrafieh', 33.887, 35.522],
    ['achrafieh', 33.887, 35.522],
    ['mar elias', 33.878, 35.495],
    ['sin el fil', 33.875, 35.542],
    ['jal el dib', 33.909, 35.585],
    ['zouk mosbeh', 33.955, 35.62],
    ['zouk mikael', 33.968, 35.618],
    ['jounieh', 33.9808, 35.6178],
    ['keserwan', 33.98, 35.64],
    ['mansourieh', 33.858, 35.564],
    ['dekwaneh', 33.875, 35.545],
    ['hadath', 33.837, 35.528],
    ['hazmieh', 33.853, 35.535],
    ['baabda', 33.833, 35.544],
    ['bsalim', 33.888, 35.577],
    ['dhour zahle', 33.86, 35.915],
    ['ksara', 33.822, 35.89],
    ['chtaura', 33.815, 35.855],
    ['zahle', 33.8463, 35.902],
    ['baalbek', 34.005, 36.204],
    ['hermel', 34.398, 36.396],
    ['al-ain', 34.226, 36.378],
    ['rashaya', 33.503, 35.846],
    ['ras el ain', 34.004, 36.21],
    ['tripoli', 34.4363, 35.8493],
    ['saida', 33.557, 35.372],
    ['sidon', 33.557, 35.372],
    ['tyre', 33.27, 35.204],
    ['nabatieh', 33.378, 35.484],
    ['hamra', 33.896, 35.482],
    ['badaro', 33.877, 35.515],
    ['verdun', 33.888, 35.483],
    ['jnah', 33.868, 35.478],
    ['ghobeiry', 33.858, 35.505],
    ['dahyeh', 33.853, 35.51],
    ['dora', 33.893, 35.555],
    ['metn', 33.88, 35.58],
    ['bekaa', 33.83, 35.9],
    ['beirut', 33.8938, 35.5018],
    ['mount lebanon', 33.88, 35.57],
    ['north', 34.436, 35.85],
    ['south', 33.45, 35.35],
  ];

  const LABELS = [
    { name: 'Tripoli', lat: 34.436, lng: 35.85, dx: 18, dy: -8 },
    { name: 'Beirut', lat: 33.894, lng: 35.5, dx: -52, dy: 4 },
    { name: 'Jounieh', lat: 33.981, lng: 35.618, dx: 16, dy: -6 },
    { name: 'Zahle', lat: 33.846, lng: 35.902, dx: 14, dy: 2 },
    { name: 'Baalbek', lat: 34.005, lng: 36.204, dx: 14, dy: -4 },
    { name: 'Sidon', lat: 33.557, lng: 35.372, dx: 16, dy: 4 },
    { name: 'Tyre', lat: 33.27, lng: 35.204, dx: 16, dy: 8 },
    { name: 'Hermel', lat: 34.398, lng: 36.396, dx: 12, dy: -8 },
  ];

  const REGION_LABELS = [
    { name: 'North', lat: 34.52, lng: 36.05 },
    { name: 'Mount Lebanon', lat: 34.05, lng: 35.82 },
    { name: 'Bekaa', lat: 33.78, lng: 36.18 },
    { name: 'South', lat: 33.38, lng: 35.55 },
  ];

  const esc = (value) =>
    String(value || '').replace(/[&<>"']/g, (ch) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]),
    );

  const coordsForStore = (store) => {
    const text = `${store.location || ''} ${store.region || ''}`.toLowerCase();
    const hit = PLACES.find(([key]) => text.includes(key));
    return hit ? [hit[1], hit[2]] : [33.8547, 35.8623];
  };

  const uniqueStores = (list) => {
    const seen = new Set();
    return list.filter((store) => {
      const key = store.name;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const spreadPins = (points) => {
    const placed = [];
    return points.map((point) => {
      let { x, y } = point;
      let guard = 0;
      while (guard < 12 && placed.some((p) => Math.hypot(p.x - x, p.y - y) < 9)) {
        const a = guard * 2.3;
        x = point.x + Math.cos(a) * (6 + guard * 3);
        y = point.y + Math.sin(a) * (6 + guard * 3);
        guard += 1;
      }
      placed.push({ x, y });
      return { ...point, x, y };
    });
  };

  const polyline = (pts, cls) => {
    const d = pts
      .map((pt, i) => {
        const [x, y] = project(pt[0], pt[1]);
        return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    return `<path class="${cls}" d="${d}" fill="none"/>`;
  };

  const gridLines = () => {
    let html = '';
    for (let lng = 35.2; lng <= 36.6; lng += 0.3) {
      const [x1, y1] = project(BOUNDS.north, lng);
      const [x2, y2] = project(BOUNDS.south, lng);
      html += `<line class="atlas-grid" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
    for (let lat = 33.2; lat <= 34.6; lat += 0.3) {
      const [x1, y1] = project(lat, BOUNDS.west);
      const [x2, y2] = project(lat, BOUNDS.east);
      html += `<line class="atlas-grid" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
    return html;
  };

  const openPopup = (map, store, pin) => {
    map.querySelectorAll('.atlas-pin.is-active').forEach((el) => el.classList.remove('is-active'));
    pin.classList.add('is-active');
    let popup = map.querySelector('.atlas-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'atlas-popup';
      map.appendChild(popup);
    }
    popup.innerHTML = `<button type="button" aria-label="Close">×</button><b>${esc(
      store.name,
    )}</b><small>${esc(store.location)}</small><span>${esc(
      store.type || 'Technology store',
    )}</span><a target="_blank" rel="noopener" href="${esc(
      store.website || store.social || '#',
    )}">Open store profile ↗</a>`;
    popup.querySelector('button').onclick = () => {
      popup.remove();
      pin.classList.remove('is-active');
    };
  };

  const refreshDirectoryAtlas = () => {
    const map = document.querySelector('.map');
    const cards = [...document.querySelectorAll('#cards .card')];
    if (!map) return;

    let atlas = map.querySelector('.directory-atlas');
    if (!atlas) {
      atlas = document.createElement('div');
      atlas.className = 'directory-atlas';
      map.appendChild(atlas);
    }

    const source = window.getStoreData ? window.getStoreData() : [];
    const visible = source.filter((store) => cards.some((card) => card.textContent.includes(store.name)));
    const list = uniqueStores(visible.length ? visible : source);

    const pins = spreadPins(
      list.map((store, index) => {
        const [lat, lng] = coordsForStore(store);
        const [x, y] = project(lat, lng);
        return { store, x, y, index };
      }),
    );

    atlas.innerHTML = `
      <svg class="atlas-svg" viewBox="0 0 ${VB.w} ${VB.h}" role="img" aria-label="Schematic map of Lebanon with store locations">
        <defs>
          <linearGradient id="atlas-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#141c32"/>
            <stop offset="100%" stop-color="#0c1222"/>
          </linearGradient>
          <filter id="atlas-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect class="atlas-sea" x="0" y="0" width="${VB.w}" height="${VB.h}"/>
        ${gridLines()}
        <text class="atlas-water-label" x="${project(33.9, 35.18)[0]}" y="${project(33.9, 35.18)[1]}" transform="rotate(-78 ${project(
          33.9,
          35.18,
        ).join(' ')})">Mediterranean</text>
        <path class="atlas-land-fill" d="${toPath(LEBANON_RING)}"/>
        <path class="atlas-land-stroke" d="${toPath(LEBANON_RING)}" filter="url(#atlas-glow)"/>
        ${polyline(RIDGE, 'atlas-ridge')}
        ${polyline(COAST_ROAD, 'atlas-road')}
        ${polyline(DAMASCUS_ROAD, 'atlas-road')}
        ${REGION_LABELS.map((label) => {
          const [x, y] = project(label.lat, label.lng);
          return `<text class="atlas-region-label" x="${x}" y="${y}">${label.name}</text>`;
        }).join('')}
        ${LABELS.map((label) => {
          const [x, y] = project(label.lat, label.lng);
          return `<g class="atlas-city">
            <circle cx="${x}" cy="${y}" r="2.2"/>
            <text x="${x + label.dx}" y="${y + label.dy}">${label.name}</text>
          </g>`;
        }).join('')}
        ${pins
          .map(
            (pin) => `<g class="atlas-pin" tabindex="0" role="button" data-store-name="${esc(
              pin.store.name,
            )}" transform="translate(${pin.x.toFixed(1)} ${pin.y.toFixed(1)})">
              <circle class="atlas-pin-halo" r="9"/>
              <circle class="atlas-pin-dot" r="4.2"/>
            </g>`,
          )
          .join('')}
      </svg>
      <div class="atlas-legend">
        <b>${list.length} listings</b>
        <span>Placed by neighborhood on a schematic of Lebanon</span>
      </div>`;

    atlas.querySelectorAll('.atlas-pin').forEach((pin) => {
      const store = list.find((item) => item.name === pin.dataset.storeName);
      if (!store) return;
      const activate = () => openPopup(map, store, pin);
      pin.addEventListener('click', activate);
      pin.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    });
  };

  const waitForCards = () => {
    const cards = document.getElementById('cards');
    if (!cards) return;
    new MutationObserver(() => refreshDirectoryAtlas()).observe(cards, { childList: true });
    refreshDirectoryAtlas();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForCards, 350));
  } else {
    setTimeout(waitForCards, 350);
  }
})();
