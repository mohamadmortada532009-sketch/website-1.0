/**
 * SITE-WIDE MAJOR THEME.
 *
 * When a visitor chooses a branch (Electrical Engineering, Civil, Medicine…)
 * the ENTIRE site re-skins: background, buttons, cards, glows and interactive
 * accents all shift to a palette that matches that field. Choosing a different
 * branch smoothly morphs the whole experience.
 *
 * How it works
 * ------------
 * brand-theme.css drives everything from a handful of CSS custom properties
 * on :root (--accent, --accent-2, --glow, --wash). This module simply writes
 * new values for those tokens per branch, so one function re-themes the whole
 * page without touching any component CSS.
 *
 * It also:
 *   - exposes a "theme ribbon" naming the active field
 *   - adds a per-field decorative motif (ring pulse, circuit lines, etc.)
 *   - respects prefers-reduced-motion
 *
 * It listens to #major-select change, so it works whether the branch was
 * picked directly or set by the university-driven program list.
 */
(() => {
  /* Palette per branch. Every entry themes the whole site. */
  const THEMES = {
    electrical: { accent: '#f7b32b', accent2: '#ffd479', glow: 'rgba(247,179,43,.35)', wash: 'rgba(247,179,43,.14)', motif: '⚡', label: 'Electrical Engineering' },
    mechanical: { accent: '#ff8a5c', accent2: '#ffc09a', glow: 'rgba(255,138,92,.35)', wash: 'rgba(255,138,92,.14)', motif: '⚙️', label: 'Mechanical Engineering' },
    civil: { accent: '#7bc96f', accent2: '#b6e6a8', glow: 'rgba(123,201,111,.35)', wash: 'rgba(123,201,111,.14)', motif: '🏗️', label: 'Civil Engineering' },
    chemical: { accent: '#4fd1c5', accent2: '#9bf3ec', glow: 'rgba(79,209,197,.35)', wash: 'rgba(79,209,197,.14)', motif: '⚗️', label: 'Chemical Engineering' },
    biomedical: { accent: '#ff6f91', accent2: '#ffb3c4', glow: 'rgba(255,111,145,.35)', wash: 'rgba(255,111,145,.14)', motif: '🧬', label: 'Biomedical Engineering' },
    mechatronics: { accent: '#8f7cff', accent2: '#cabcff', glow: 'rgba(143,124,255,.35)', wash: 'rgba(143,124,255,.14)', motif: '🤖', label: 'Mechatronics Engineering' },
    software: { accent: '#5aa9ff', accent2: '#a8d0ff', glow: 'rgba(90,169,255,.35)', wash: 'rgba(90,169,255,.14)', motif: '💻', label: 'Software Engineering' },
    'computer-science': { accent: '#6d5efc', accent2: '#a9a0ff', glow: 'rgba(109,94,252,.35)', wash: 'rgba(109,94,252,.14)', motif: '🧠', label: 'Computer Science & AI' },
    telecommunications: { accent: '#39c5bb', accent2: '#8defe8', glow: 'rgba(57,197,187,.35)', wash: 'rgba(57,197,187,.14)', motif: '📡', label: 'Telecommunications Engineering' },
    architecture: { accent: '#e0a34e', accent2: '#ffd39a', glow: 'rgba(224,163,78,.35)', wash: 'rgba(224,163,78,.14)', motif: '📐', label: 'Architecture & Design' },
    medicine: { accent: '#ef4a5e', accent2: '#ff98a4', glow: 'rgba(239,74,94,.35)', wash: 'rgba(239,74,94,.14)', motif: '🩺', label: 'Medicine & Health Sciences' },
    nursing: { accent: '#57b8d6', accent2: '#a3e0f2', glow: 'rgba(87,184,214,.35)', wash: 'rgba(87,184,214,.14)', motif: '💉', label: 'Nursing' },
    business: { accent: '#c79a3e', accent2: '#f0d38a', glow: 'rgba(199,154,62,.35)', wash: 'rgba(199,154,62,.14)', motif: '📈', label: 'Business & Economics' },
    accounting: { accent: '#4caf7d', accent2: '#9fe3bf', glow: 'rgba(76,175,125,.35)', wash: 'rgba(76,175,125,.14)', motif: '🧾', label: 'Accounting & Finance' },
    economics: { accent: '#d4a24b', accent2: '#f3d79a', glow: 'rgba(212,162,75,.35)', wash: 'rgba(212,162,75,.14)', motif: '📊', label: 'Economics & Data' },
    law: { accent: '#a8871f', accent2: '#e5cd86', glow: 'rgba(168,135,31,.35)', wash: 'rgba(168,135,31,.14)', motif: '⚖️', label: 'Law' },
    psychology: { accent: '#b07be0', accent2: '#ddc0f5', glow: 'rgba(176,123,224,.35)', wash: 'rgba(176,123,224,.14)', motif: '🧩', label: 'Psychology & Social Sciences' },
    education: { accent: '#f28c5b', accent2: '#ffc4a1', glow: 'rgba(242,140,91,.35)', wash: 'rgba(242,140,91,.14)', motif: '📚', label: 'Education' },
    media: { accent: '#ff5da2', accent2: '#ffabcf', glow: 'rgba(255,93,162,.35)', wash: 'rgba(255,93,162,.14)', motif: '🎬', label: 'Media & Creative Arts' },
    biology: { accent: '#5fbf6f', accent2: '#aee8b6', glow: 'rgba(95,191,111,.35)', wash: 'rgba(95,191,111,.14)', motif: '🔬', label: 'Biological Sciences' },
    mathematics: { accent: '#7d8bff', accent2: '#c3caff', glow: 'rgba(125,139,255,.35)', wash: 'rgba(125,139,255,.14)', motif: '∑', label: 'Mathematics & Physics' },
    nutrition: { accent: '#9bc25a', accent2: '#d3eaa3', glow: 'rgba(155,194,90,.35)', wash: 'rgba(155,194,90,.14)', motif: '🥗', label: 'Nutrition & Food Sciences' },
    hospitality: { accent: '#e8a33d', accent2: '#ffd79a', glow: 'rgba(232,163,61,.35)', wash: 'rgba(232,163,61,.14)', motif: '🏨', label: 'Hospitality & Tourism' },
    'fine-arts': { accent: '#ff7ac0', accent2: '#ffc0e2', glow: 'rgba(255,122,192,.35)', wash: 'rgba(255,122,192,.14)', motif: '🎨', label: 'Fine Arts & Music' },
    industrial: { accent: '#ff9d4d', accent2: '#ffcf9e', glow: 'rgba(255,157,77,.35)', wash: 'rgba(255,157,77,.14)', motif: '🏭', label: 'Industrial Engineering' },
    petroleum: { accent: '#8a6d3b', accent2: '#d8c39a', glow: 'rgba(138,109,59,.4)', wash: 'rgba(138,109,59,.16)', motif: '🛢️', label: 'Petroleum Engineering' },
    'renewable-energy': { accent: '#7ed957', accent2: '#c3f0a8', glow: 'rgba(126,217,87,.35)', wash: 'rgba(126,217,87,.14)', motif: '🌱', label: 'Renewable Energy Engineering' },
    surveying: { accent: '#d9a441', accent2: '#f2d491', glow: 'rgba(217,164,65,.35)', wash: 'rgba(217,164,65,.14)', motif: '🧭', label: 'Surveying / Geomatics' },
    electronics: { accent: '#49b8e8', accent2: '#a3ddf5', glow: 'rgba(73,184,232,.35)', wash: 'rgba(73,184,232,.14)', motif: '🔌', label: 'Electronics Engineering' },
  };

  const root = document.documentElement;

  /** Apply a branch's palette to the whole site. */
  const applyTheme = (key) => {
    const theme = THEMES[key];
    if (!theme) return;

    // Core brand tokens — brand-theme.css reads these everywhere.
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-2', theme.accent2);
    root.style.setProperty('--glow', theme.glow);
    root.style.setProperty('--wash', theme.wash);

    // Legacy tokens the older stylesheets still reference.
    root.style.setProperty('--major-accent', theme.accent);
    root.style.setProperty('--major-light', theme.accent2);
    root.style.setProperty('--major-glow', theme.glow);

    document.body.dataset.major = key;
    document.body.classList.add('major-active');

    // The floating ribbon that names the active field + its motif.
    let ribbon = document.getElementById('major-ribbon');
    if (!ribbon) {
      ribbon = document.createElement('div');
      ribbon.id = 'major-ribbon';
      ribbon.className = 'major-ribbon';
      document.body.appendChild(ribbon);
    }
    ribbon.innerHTML = `<span class="major-ribbon-motif">${theme.motif}</span>
      <b>${theme.label}</b>
      <small>Experience themed for your field</small>
      <button type="button" aria-label="Clear major theme">×</button>`;
    ribbon.classList.add('is-visible');

    ribbon.querySelector('button').addEventListener('click', clearTheme);
  };

  const clearTheme = () => {
    ['--accent', '--accent-2', '--glow', '--wash', '--major-accent', '--major-light', '--major-glow'].forEach(
      (token) => root.style.removeProperty(token),
    );
    delete document.body.dataset.major;
    document.body.classList.remove('major-active');
    const ribbon = document.getElementById('major-ribbon');
    if (ribbon) ribbon.classList.remove('is-visible');
  };

  /* React to branch changes from the major picker (direct or university-driven). */
  const bind = () => {
    const major = document.getElementById('major-select');
    if (!major) return;
    major.addEventListener('change', () => applyTheme(major.value));
    // If a branch is already selected on load, honour it.
    if (major.value && major.value !== 'default') applyTheme(major.value);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  // Public hook so other modules (e.g. the university-search program list) can
  // apply a branch theme without dispatching a synthetic change event.
  window.applyMajorThemeSite = applyTheme;
  window.clearMajorThemeSite = clearTheme;
})();
