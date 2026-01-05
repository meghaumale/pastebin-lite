import { kv } from "../../../../lib/kv";
import { nowMs } from "../../../../lib/time";

function notFound() {
  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) return notFound();

  const now = nowMs();

  if (paste.expires_at && now >= paste.expires_at) {
    await kv.del(key);
    return notFound();
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    await kv.del(key);
    return notFound();
  }

  paste.views += 1;
  await kv.set(key, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(0, paste.max_views - paste.views),
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
