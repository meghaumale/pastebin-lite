import { kv } from "../../../lib/kv";
import { nowMs } from "../../../lib/time";
import { notFound } from "next/navigation";

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);
  if (!paste) notFound();

  const now = nowMs();

  if (paste.expires_at && now >= paste.expires_at) {
    await kv.del(key);
    notFound();
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    await kv.del(key);
    notFound();
  }

  paste.views += 1;
  await kv.set(key, paste);

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>
      {escapeHtml(paste.content)}
    </pre>
  );
}
