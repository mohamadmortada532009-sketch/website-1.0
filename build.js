// Build a single self-contained demo.html that works offline (file://) on a phone.
// Inlines all local CSS + JS, embeds stores.csv, and patches app.js to use it.
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

let html = read('index.html');
const csv = read('stores.csv');

// 1) Embed the CSV as a JSON string (safest — no escaping issues at all).
const csvJson = JSON.stringify(csv);
const embed = `<script>window.__STORES_CSV = ${csvJson};</script>`;

// 2) Inline local CSS.
html = html.replace(/<link rel="stylesheet" href="([^"]+\.css)">/g, (m, f) => {
  const p = path.join(root, f);
  return fs.existsSync(p) ? `<style>\n${read(f)}\n</style>` : m;
});

// 3) Inline local JS (skip remote http(s) scripts).
html = html.replace(/<script src="([^"]+\.js)"><\/script>/g, (m, f) => {
  if (/^https?:/.test(f)) return m;
  const p = path.join(root, f);
  return fs.existsSync(p) ? `<script>\n${read(f)}\n</script>` : m;
});

// 4) Inject the embedded CSV before </head>.
html = html.replace('</head>', embed + '</head>');

// 5) Ensure load() reads the embedded CSV first.
//
// app.js already prefers window.__STORES_CSV when it is present, so on the
// refactored source the embedded data is picked up with no patching needed.
// For legacy/minified sources we still rewrite the fetch-only loader inline.
// Either way we verify a compatible loader exists before shipping.
const embeddedAwareRegex = /window\.__STORES_CSV[\s\S]{0,120}?parseCSV\(window\.__STORES_CSV\)/;
const alreadyEmbeddedAware = embeddedAwareRegex.test(html);
const oldLoad =
  "try{const response=await fetch('stores.csv');if(!response.ok)throw Error();stores=parseCSV(await response.text());}catch{stores=fallback}";
const newLoad =
  "try{if(window.__STORES_CSV){stores=parseCSV(window.__STORES_CSV);}else{const response=await fetch('stores.csv');if(!response.ok)throw Error();stores=parseCSV(await response.text());}}catch{stores=fallback}";
if (alreadyEmbeddedAware) {
  // Nothing to do — the loader already consumes the embedded CSV.
} else if (html.includes(oldLoad)) {
  html = html.replace(oldLoad, newLoad);
} else {
  console.error('ERROR: load() source not found — aborting so we do not ship a broken build.');
  process.exit(1);
}

const outDir = path.join(root, 'build');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'demo.html');
fs.writeFileSync(outFile, html, 'utf8');
console.log('Wrote', outFile, fs.statSync(outFile).size, 'bytes');
console.log('Embedded CSV chars:', csv.length);
console.log('Loader embeds CSV:', alreadyEmbeddedAware);
console.log('Patched load():', html.includes('if(window.__STORES_CSV){stores=parseCSV'));
