// GET /api/health on Cloudflare Pages
export function onRequestGet() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
