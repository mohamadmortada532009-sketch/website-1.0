export default async function run(page, ui, ctx) {
  const logs = [];
  page.on('console', (m) => logs.push(`${m.type()}: ${m.text()}`));
  // Wipe any HTTP cache, then hard-reload.
  try {
    await page.context().clearCookies();
  } catch { }
  await page.goto('http://localhost:8124/?v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const info = await page.evaluate(async () => {
    const src = await (await fetch('app.js', { cache: 'no-store' })).text();
    return {
      servedAppHasLoadLog: src.includes('LOAD_RESULT'),
      servedAppLen: src.length,
      count: document.querySelector('#count')?.textContent,
    };
  });
  return { logs, info };
}
