import crypto from "crypto";
import { kv } from "../../../lib/kv";
import { badRequest } from "../../../lib/validate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.content || typeof body.content !== "string" || !body.content.trim()) {
    return badRequest("Invalid content");
  }

  if (body.ttl_seconds !== undefined &&
      (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1)) {
    return badRequest("Invalid ttl_seconds");
  }

  if (body.max_views !== undefined &&
      (!Number.isInteger(body.max_views) || body.max_views < 1)) {
    return badRequest("Invalid max_views");
  }

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const now = Date.now();

  await kv.set(`paste:${id}`, {
    id,
    content: body.content,
    created_at: now,
    expires_at: body.ttl_seconds ? now + body.ttl_seconds * 1000 : null,
    max_views: body.max_views ?? null,
    views: 0,
  });

  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

  return Response.json({
    id,
    url: `${base}/p/${id}`,
  });
}
