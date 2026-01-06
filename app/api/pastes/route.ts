import { nowMs } from "../../../lib/time";
import { kv } from "../../../lib/kv";
import { badRequest } from "../../../lib/validate";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.content) {
    return badRequest("Content is required");
  }

  const id = nanoid(8);
  const paste = {
    content: body.content,
    createdAt: nowMs(),
    expiresAt: nowMs() + 24 * 60 * 60 * 1000, // 24h expiry
    views: 0,
    maxViews: 10
  };

  await kv.set(`paste:${id}`, paste);

  return new Response(
  JSON.stringify({ url: `/p/${id}` }),
  { status: 200, headers: { "Content-Type": "application/json" } }
);
}