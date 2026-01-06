"use client";
import { useState } from "react";

export default function Home() {
  const [c, setC] = useState("");
  const [u, setU] = useState("");
  const [err, setErr] = useState("");

  async function s() {
    setErr("");
    setU("");

    const r = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: c }),
    });

    if (!r.ok) {
      const t = await r.text();
      setErr("Failed to create paste: " + t);
      return;
    }

    const j = await r.json();
    setU(j.url);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Pastebin Lite</h2>

      <textarea
        rows={8}
        value={c}
        onChange={(e) => setC(e.target.value)}
        placeholder="Paste your content here..."
        style={{ width: "100%" }}
      />

      <br />
      <button onClick={s} style={{ marginTop: 10 }}>
        Create
      </button>

      {err && <p style={{ color: "red" }}>{err}</p>}

      {u && (
        <p>
          Paste URL: <a href={u}>{u}</a>
        </p>
      )}
    </div>
  );
}
