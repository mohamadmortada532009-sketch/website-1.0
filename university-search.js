/**
 * University search + accurate per-university program filtering.
 *
 * Upgrades the recommendation form's plain <select> into a searchable field
 * and rebuilds the PROGRAM list from universities-data.js so that:
 *
 *   - the university list is filterable by typing (search bar)
 *   - the program list shows ONLY the branches that university actually
 *     offers (e.g. Electrical appears for AUB but not for a university that
 *     does not teach it)
 *   - engineering branches are grouped and labelled clearly
 *
 * It is additive: if the data file or the form is missing it does nothing.
 */
(() => {
  const data = window.lebanonUniversityData;
  if (!data || !Array.isArray(data.universities)) return;

  const UNIVERSITIES = data.universities;
  const BRANCHES = data.engineeringBranches || {};
  const ALIASES = data.branchProfileAliases || {};

  /*
   * The recommendation form is injected at runtime by recommendation-engine.js,
   * so #university-select may not exist yet when this file first runs. Wait for
   * it (bounded), then set everything up.
   */
  const ready = (callback, tries = 0) => {
    const select = document.getElementById('university-select');
    const programSelect = document.getElementById('program-select');
    if (select && programSelect) {
      callback(select, programSelect);
    } else if (tries < 60) {
      setTimeout(() => ready(callback, tries + 1), 50);
    }
  };

  const init = (select, programSelect) => {

  /* ---------------------------------------------------------------- *
   * 1. Populate the native university <select> from the data file, so
   *    every university in the research is present and de-duplicated.
   * ---------------------------------------------------------------- */
  const fillUniversitySelect = () => {
    select.innerHTML =
      '<option value="">Choose your university</option>' +
      UNIVERSITIES.map((u) => `<option value="${u.name}">${u.name}</option>`).join('');
  };

  /* ---------------------------------------------------------------- *
   * 2. Build the searchable field that sits above the <select>.
   *    Typing filters the <select>; picking updates it and fires change.
   * ---------------------------------------------------------------- */
  const buildSearchField = () => {
    const label = select.closest('label');
    const host = label || select.parentElement;

    const wrap = document.createElement('div');
    wrap.className = 'uni-search';
    wrap.innerHTML = `
      <input type="search" class="uni-search-input" placeholder="Search your university…"
             autocomplete="off" aria-label="Search university" />
      <ul class="uni-search-list" role="listbox" hidden></ul>`;
    host.insertBefore(wrap, select);

    const input = wrap.querySelector('.uni-search-input');
    const list = wrap.querySelector('.uni-search-list');

    const renderList = (term) => {
      const q = term.trim().toLowerCase();
      const matches = UNIVERSITIES.filter((u) => !q || u.name.toLowerCase().includes(q));
      list.innerHTML = matches
        .map(
          (u) =>
            `<li role="option" data-name="${u.name}">${u.name}<small> · ${u.city}</small></li>`,
        )
        .join('');
      list.hidden = matches.length === 0;
    };

    const choose = (name) => {
      select.value = name;
      input.value = name;
      list.hidden = true;
      // Drive the existing engine: changing the select re-renders programs.
      select.dispatchEvent(new Event('change', { bubbles: true }));
    };

    input.addEventListener('focus', () => renderList(input.value));
    input.addEventListener('input', () => renderList(input.value));
    list.addEventListener('click', (event) => {
      const li = event.target.closest('li[data-name]');
      if (li) choose(li.dataset.name);
    });
    input.addEventListener('blur', () => setTimeout(() => (list.hidden = true), 150));
  };

  /* ---------------------------------------------------------------- *
   * 3. Rebuild the PROGRAM list for the chosen university.
   *    Only branches that university offers are shown, grouped and
   *    labelled; missing branch profiles fall back to a close alias.
   * ---------------------------------------------------------------- */
  /**
   * Paint the PROGRAM list for the selected university, then sync the major
   * picker. Runs on a short delay so it lands AFTER the legacy renderers in
   * program-availability.js / catalog-expansion.js, which also listen for the
   * university change and would otherwise overwrite this list.
   */
  const rebuildPrograms = () => {
    const uni = UNIVERSITIES.find((u) => u.name === select.value);
    const profiles = window.expandedPrograms || {};

    if (!uni) {
      // No university chosen — fall back to the full catalogue.
      programSelect.innerHTML = Object.entries(profiles)
        .map(([key, p]) => `<option value="${key}">${p.label}</option>`)
        .join('');
      return;
    }

    /** Prettify a raw key when no curated label is available. */
    const prettify = (key) => {
      const spaced = key.split('-').join(' ');
      return spaced.charAt(0).toUpperCase() + spaced.slice(1);
    };

    /** Turn a branch/program key into a human-readable label. */
    const labelFor = (key) => {
      if (BRANCHES[key]) return BRANCHES[key];
      if (profiles[key] && profiles[key].label) return profiles[key].label;
      return prettify(key);
    };

    const optionFor = (key, group) => {
      const profileKey = profiles[key] ? key : ALIASES[key] || key;
      return `<option value="${profileKey}" data-major-key="${profileKey}" data-branch="${key}" data-group="${group}">${labelFor(key)}</option>`;
    };

    const engineering = (uni.engineering || []).map((key) => optionFor(key, 'Engineering')).join('');
    const others = (uni.programs || []).map((key) => optionFor(key, 'Other programs')).join('');

    programSelect.innerHTML =
      (engineering ? `<optgroup label="Engineering branches">${engineering}</optgroup>` : '') +
      (others ? `<optgroup label="Other programs">${others}</optgroup>` : '');

    /*
     * Sync #major-select WITHOUT firing a `change` event.
     *
     * catalog-expansion.js listens for a major change and rewrites the program
     * list from that major's catalogue — which would wipe the accurate,
     * university-specific list we just built. Setting .value silently keeps the
     * two fields consistent while leaving our list intact; we apply the theme
     * ourselves below.
     */
    const first = programSelect.options[0];
    const major = document.getElementById('major-select');
    if (first && major) {
      const target = first.dataset.majorKey || first.value;
      if (major.value !== target) {
        major.value = target;
      }
      // Re-apply the site theme for the newly selected branch directly.
      if (typeof window.applyMajorThemeSite === 'function') {
        window.applyMajorThemeSite(target);
      }
    }
  };

  /** Rebuild now and once more after other listeners have had their turn. */
  const scheduleRebuild = () => {
    rebuildPrograms();
    setTimeout(rebuildPrograms, 30);
  };

  /* ---------------------------------------------------------------- *
   * 4. Wire everything together.
   * ---------------------------------------------------------------- */
  fillUniversitySelect();
  buildSearchField();
  select.addEventListener('change', scheduleRebuild);

  /*
   * React when the user picks a program, keeping #major-select (and the site
   * theme) in sync — again WITHOUT dispatching a change event, so the legacy
   * catalogue renderer does not wipe this university-specific list.
   */
  programSelect.addEventListener('change', () => {
    const opt = programSelect.selectedOptions[0];
    const major = document.getElementById('major-select');
    if (!opt) return;
    const target = opt.dataset.majorKey || opt.value;
    if (major && major.value !== target) major.value = target;
    if (typeof window.applyMajorThemeSite === 'function') window.applyMajorThemeSite(target);
  });
  };

  ready(init);
})();
