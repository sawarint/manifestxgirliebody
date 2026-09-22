// Stepdown sync relay: Cloudflare Worker + KV (binding name: SYNC)
// POST /s/<code>  from the iPhone Shortcut  -> stores the Health text for up to 3 days
// GET  /s/<code>  from the app              -> returns it
// DELETE /s/<code> from the app after import -> removes it right away
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const m = new URL(req.url).pathname.match(/^\/s\/([a-z0-9]{16,64})$/);
    if (!m) return new Response("Stepdown sync relay", { status: 404, headers: CORS });
    const key = m[1];
    if (req.method === "POST") {
      const body = await req.text();
      if (!body || body.length > 20000) return new Response("bad size", { status: 413, headers: CORS });
      await env.SYNC.put(key, JSON.stringify({ t: Date.now(), body }), { expirationTtl: 60 * 60 * 24 * 3 });
      return new Response("ok", { headers: CORS });
    }
    if (req.method === "GET") {
      const v = await env.SYNC.get(key);
      if (!v) return new Response(null, { status: 204, headers: CORS });
      return new Response(v, { headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });
    }
    if (req.method === "DELETE") {
      await env.SYNC.delete(key);
      return new Response("ok", { headers: CORS });
    }
    return new Response("method not allowed", { status: 405, headers: CORS });
  },
};
