import { kv } from "../../../lib/kv";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "development") {
      return Response.json({ ok: true });
    }

    await kv.ping();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
