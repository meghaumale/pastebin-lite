
"use client";
import { useState } from "react";

export default function Home() {
  const [c,setC]=useState("");
  const [u,setU]=useState("");
  async function s(){
    const r=await fetch("/api/pastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:c})});
    const j=await r.json(); setU(j.url);
  }
  return (<div style={{padding:20}}>
    <textarea rows={8} value={c} onChange={e=>setC(e.target.value)} />
    <br/><button onClick={s}>Create</button>
    {u && <p><a href={u}>{u}</a></p>}
  </div>);
}
