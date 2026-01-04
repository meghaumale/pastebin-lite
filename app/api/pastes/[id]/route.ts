
import { kv } from "@/lib/kv";
import { nowMs } from "@/lib/time";

function nf() {
  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" }
  });
}

export async function GET(_: Request, { params }: any) {
  const key = `paste:${params.id}`;
  const p = await kv.get<any>(key);
  if (!p) return nf();

  const now = nowMs();
  if (p.expires_at && now >= p.expires_at) { await kv.del(key); return nf(); }
  if (p.max_views !== null && p.views >= p.max_views) { await kv.del(key); return nf(); }

  p.views++;
  await kv.set(key, p);

  return Response.json({
    content: p.content,
    remaining_views: p.max_views === null ? null : Math.max(0, p.max_views - p.views),
    expires_at: p.expires_at ? new Date(p.expires_at).toISOString() : null
  });
}
