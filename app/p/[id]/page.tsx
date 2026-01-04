
import { kv } from "@/lib/kv";
import { nowMs } from "@/lib/time";
import { notFound } from "next/navigation";

function esc(s: string) {
  return s.replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"} as any)[m]);
}

export default async function Page({ params }: any) {
  const key = `paste:${params.id}`;
  const p = await kv.get<any>(key);
  if (!p) notFound();

  const now = nowMs();
  if (p.expires_at && now >= p.expires_at) { await kv.del(key); notFound(); }
  if (p.max_views !== null && p.views >= p.max_views) { await kv.del(key); notFound(); }

  p.views++;
  await kv.set(key, p);

  return <pre style={{whiteSpace:"pre-wrap",padding:20}}>{esc(p.content)}</pre>;
}
