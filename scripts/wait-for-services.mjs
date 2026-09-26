const urls = [process.env.API_HEALTH_URL ?? 'http://localhost:3000/api/v1/health/ready', process.env.WEB_URL ?? 'http://localhost:5173'];
const deadline = Date.now() + 60_000;
for (const url of urls) {
  let ready = false;
  while (Date.now() < deadline) {
    try { const response = await fetch(url, { signal: AbortSignal.timeout(2000) }); if (response.ok) { ready = true; break; } } catch { /* startup in progress */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error(`Service did not become ready: ${url}`);
  console.log(`Ready: ${url}`);
}
