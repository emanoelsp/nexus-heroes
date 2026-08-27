"use client";

import Link from "next/link";
import { CFG, type BS } from "./config";
import { CLASSES, REINOS, ARMAS, type Classe } from "@/types";

function ans(id: string, blanks: Record<string, BS>) {
  const b = blanks[id];
  return b?.status === "ok" ? b.val.trim() : CFG[id].ans;
}
function filled(id: string, blanks: Record<string, BS>) {
  return !!id && blanks[id]?.status === "ok";
}

export default function SuccessScreen({ nome, classe, armaId, reinoId, blanks }: {
  nome: string; classe: Classe; armaId: string; reinoId: string; blanks: Record<string, BS>;
}) {
  const info    = CLASSES[classe];
  const reino   = reinoId ? REINOS[reinoId] : null;
  const armaInf = ARMAS.find(a => a.id === armaId);
  const armaNome = armaInf?.nome ?? "null";

  const varNome  = nome.split(",")[0].trim().replace(/[^a-zA-Z]/g,"").toLowerCase() || "heroi";

  const allDone = Object.keys(CFG).every(id => blanks[id]?.status === "ok");

  // ── Personagem attribute rows ─────────────────────────────────────────────
  const ATTRS: { bid: string; line: string }[] = [
    { bid:"pav-reino",  line:` reinoId : String → Reino` },
    { bid:"pav-classe", line:` classeId : String → Classe` },
    { bid:"av-nome",    line:` nome : String` },
    { bid:"av-nivel",   line:` nivel : ${ans("at-nivel", blanks)}` },
    { bid:"",           line:`- xp : int` },
    { bid:"av-arma",    line:` arma : String` },
    { bid:"",           line:`- armadura : String` },
    { bid:"av-anel",    line:` anel : ${ans("at-anel", blanks)}` },
  ];

  const METHODS: { bid: string; line: string }[] = [
    { bid:"mv-ctor",        line:` Personagem(nome, classeId, reinoId)` },
    { bid:"mv-getNome",     line:` getNome() : ${ans("mr-getNome", blanks)}` },
    { bid:"",               line:`+ getNivel() : int` },
    { bid:"",               line:`+ getXp() : int` },
    { bid:"mv-equArma",     line:` equiparArma(arma : ${ans("mp-equArma", blanks)}) : void` },
    { bid:"mv-equArmadura", line:` equiparArmadura(armadura : String) : ${ans("mr-equArmadura", blanks)}` },
    { bid:"",               line:`+ getClasse() : Classe` },
  ];

  // ── Classe attribute rows ─────────────────────────────────────────────────
  const CLASSE_ATTRS: { bid: string; line: string }[] = [
    { bid:"ck-av-nome",  line:` nome : String` },
    { bid:"ck-av-emoji", line:` emoji : String` },
    { bid:"",            line:`- cor : String` },
  ];

  const CLASSE_METHODS: { bid: string; line: string }[] = [
    { bid:"ck-mv-getNome", line:` getNome() : ${ans("ck-mr-getNome", blanks)}` },
    { bid:"",              line:`+ getEmoji() : String` },
    { bid:"",              line:`+ getCor() : String` },
  ];

  return (
    <div style={{ minHeight:"100vh" }}>
      <style>{`
        @keyframes heroFloat { 0%,100%{transform:translateY(0) rotateY(4deg);}50%{transform:translateY(-16px) rotateY(-4deg);} }
        @keyframes glow      { 0%,100%{box-shadow:0 0 30px ${info.cor}35;}50%{box-shadow:0 0 55px ${info.cor}60,0 0 90px ${info.cor}25;} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
      `}</style>

      <nav className="nav">
        <Link href="/dashboard" className="nav-logo gold-text">⚔️ NEXUS</Link>
      </nav>

      <main className="container" style={{ paddingTop:"2.5rem", paddingBottom:"5rem" }}>

        {/* ── Hero card ── */}
        <div style={{ textAlign:"center", marginBottom:"2.5rem", animation:"fadeUp 0.5s ease both" }}>
          <div className="card-3d-wrapper" style={{ display:"inline-block", marginBottom:"1rem" }}>
            <div className="card card-3d" style={{ width:"140px", padding:"1.75rem 1rem", textAlign:"center", borderColor:`${info.cor}45`, background:info.corFundo, animation:"glow 3s ease-in-out infinite" }}>
              <div style={{ fontSize:"3rem", marginBottom:"0.5rem", filter:`drop-shadow(0 0 18px ${info.cor})`, animation:"heroFloat 3s ease-in-out infinite", display:"inline-block" }}>{info.emoji}</div>
              <div style={{ fontWeight:900, color:info.cor, fontSize:"0.85rem" }}>{info.nome}</div>
              {reino && <div style={{ fontSize:"0.67rem", color:reino.cor, marginTop:"0.15rem" }}>{reino.emoji} {reino.nome}</div>}
              <div style={{ fontSize:"0.67rem", color:"var(--muted)", marginTop:"0.1rem" }}>Nível 1</div>
            </div>
          </div>
          <h1 style={{ fontSize:"clamp(1.4rem,4vw,2rem)", fontWeight:900, marginBottom:"0.2rem" }}>{nome} foi forjado!</h1>
          <p style={{ color:"var(--muted)", fontSize:"0.85rem" }}>{info.desc}</p>
          {allDone && (
            <div style={{ display:"inline-flex", gap:"0.4rem", alignItems:"center", marginTop:"0.6rem", padding:"0.2rem 0.65rem", borderRadius:"99px", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", fontSize:"0.72rem", color:"#86efac" }}>
              ✓ Diagrama 100% completo!
            </div>
          )}
        </div>

        {/* ── Object diagrams (3 side by side) ── */}
        <div style={{ animation:"fadeUp 0.5s 0.1s ease both", opacity:0, animationFillMode:"forwards", marginBottom:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.75rem" }}>
            <span>📦</span>
            <h2 style={{ fontSize:"0.95rem", fontWeight:800 }}>Diagramas de Objeto</h2>
            <span style={{ fontSize:"0.7rem", color:"var(--muted)" }}>— instâncias criadas</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(175px, 1fr))", gap:"0.65rem" }}>
            {/* Reino object */}
            {reino ? (
              <div style={{ fontFamily:"monospace", fontSize:"0.75rem", background:`${reino.cor}08`, border:`1px solid ${reino.cor}25`, borderRadius:"12px", overflow:"hidden" }}>
                <div style={{ background:`${reino.cor}12`, borderBottom:`1px solid ${reino.cor}20`, padding:"0.4rem 0.85rem", fontWeight:800, color:reino.cor }}>
                  {reinoId} : <span style={{ color:`${reino.cor}bb` }}>Reino</span>
                </div>
                {[
                  { k:"nome",       v:`"${reino.nome}"` },
                  { k:"bonus",      v:`"${reino.bonus}"`, note:`${reino.atributo}` },
                  { k:"valorBonus", v:String(reino.valorBonus) },
                ].map(r => (
                  <div key={r.k} style={{ padding:"0.22rem 0.85rem", display:"flex", gap:"0.35rem", alignItems:"baseline", borderBottom:"1px solid rgba(255,255,255,0.02)" }}>
                    <span style={{ color:`${reino.cor}60`, minWidth:"75px" }}>{r.k}</span>
                    <span style={{ color:"rgba(148,163,184,0.25)" }}>=</span>
                    <span style={{ color:"#93c5fd" }}>{r.v}</span>
                    {"note" in r && r.note && <span style={{ fontSize:"0.58rem", color:`${reino.cor}55`, fontStyle:"italic", marginLeft:"0.35rem" }}>{r.note}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:"12px", color:"var(--muted)", fontSize:"0.78rem", minHeight:"80px" }}>
                Sem reino associado
              </div>
            )}

            {/* Classe object */}
            <div style={{ fontFamily:"monospace", fontSize:"0.75rem", background:`${info.cor}08`, border:`1px solid ${info.cor}30`, borderRadius:"12px", overflow:"hidden" }}>
              <div style={{ background:`${info.cor}15`, borderBottom:`1px solid ${info.cor}25`, padding:"0.4rem 0.85rem", fontWeight:800, color:info.cor }}>
                {classe} : <span style={{ color:`${info.cor}bb` }}>Classe</span>
              </div>
              {[
                { k:"nome",  v:`"${info.nome}"` },
                { k:"emoji", v:`"${info.emoji}"` },
                { k:"cor",   v:`"${info.cor}"` },
              ].map(r => (
                <div key={r.k} style={{ padding:"0.22rem 0.85rem", display:"flex", gap:"0.35rem", borderBottom:"1px solid rgba(255,255,255,0.02)" }}>
                  <span style={{ color:`${info.cor}60`, minWidth:"52px" }}>{r.k}</span>
                  <span style={{ color:"rgba(148,163,184,0.25)" }}>=</span>
                  <span style={{ color:"#93c5fd" }}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* Personagem object */}
            <div style={{ fontFamily:"monospace", fontSize:"0.75rem", background:"rgba(59,130,246,0.05)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:"12px", overflow:"hidden" }}>
              <div style={{ background:"rgba(59,130,246,0.12)", borderBottom:"1px solid rgba(59,130,246,0.2)", padding:"0.4rem 0.85rem", fontWeight:800, color:"#93c5fd" }}>
                {varNome} : <span style={{ color:"#60a5fa" }}>Personagem</span>
              </div>
              {[
                { k:"reinoId",  v:`"${reinoId}"`,   c:"#93c5fd" },
                { k:"classeId", v:`"${classe}"`,     c:"#93c5fd" },
                { k:"nome",     v:`"${nome}"`,        c:"#93c5fd" },
                { k:"nivel",    v:"1",                c:"rgba(148,163,184,0.5)" },
                { k:"xp",       v:"0",                c:"rgba(148,163,184,0.5)" },
                { k:"arma",     v: armaId ? `"${armaNome}"` : "null", c: armaId ? "#93c5fd" : "rgba(148,163,184,0.3)" },
                { k:"armadura", v:"null",             c:"rgba(148,163,184,0.3)" },
                { k:"anel",     v:"null",             c:"rgba(148,163,184,0.3)" },
              ].map(r => (
                <div key={r.k} style={{ padding:"0.22rem 0.85rem", display:"flex", gap:"0.35rem", borderBottom:"1px solid rgba(255,255,255,0.02)" }}>
                  <span style={{ color:"rgba(148,163,184,0.4)", minWidth:"60px" }}>{r.k}</span>
                  <span style={{ color:"rgba(148,163,184,0.25)" }}>=</span>
                  <span style={{ color:r.c }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Class diagrams (3 side by side) ── */}
        <div style={{ animation:"fadeUp 0.5s 0.2s ease both", opacity:0, animationFillMode:"forwards", marginBottom:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.75rem" }}>
            <span>📐</span>
            <h2 style={{ fontSize:"0.95rem", fontWeight:800 }}>Diagramas de Classe</h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(175px, 1fr))", gap:"0.65rem" }}>
            {/* Reino class */}
            <div style={{ fontFamily:"monospace", fontSize:"0.75rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden" }}>
              <div style={{ background:"rgba(161,98,7,0.15)", borderBottom:"1px solid var(--border)", padding:"0.45rem 0.85rem", textAlign:"center", fontWeight:800, color:"#fbbf24", fontSize:"0.82rem" }}>
                Reino
              </div>
              <div style={{ borderBottom:"1px solid var(--border)", paddingBottom:"0.2rem" }}>
                {[
                  { bid:"rk-av-nome",  line:` nome : String` },
                  { bid:"",            line:`- bonus : String` },
                  { bid:"rk-av-valor", line:` valorBonus : ${ans("rk-at-valor", blanks)}` },
                ].map((a, i) => (
                  <div key={i} style={{ padding:"0.2rem 0.85rem", display:"flex", gap:"0.2rem", color: filled(a.bid, blanks) ? "#86efac" : "rgba(148,163,184,0.4)" }}>
                    <span style={{ fontWeight:700, color: filled(a.bid, blanks) ? "#22c55e" : "rgba(148,163,184,0.3)" }}>
                      {a.bid ? ans(a.bid, blanks) : a.line.charAt(0)}
                    </span>
                    <span>{a.bid ? a.line : a.line.slice(1)}</span>
                  </div>
                ))}
              </div>
              <div style={{ paddingBottom:"0.2rem" }}>
                {[
                  { bid:"rk-mv-getNome", line:` getNome() : ${ans("rk-mr-getNome", blanks)}` },
                  { bid:"",              line:`+ getBonus() : String` },
                  { bid:"",              line:`+ getValorBonus() : int` },
                ].map((m, i) => (
                  <div key={i} style={{ padding:"0.2rem 0.85rem", display:"flex", gap:"0.2rem", color: filled(m.bid, blanks) ? "#86efac" : "rgba(148,163,184,0.4)" }}>
                    <span style={{ fontWeight:700, color: filled(m.bid, blanks) ? "#22c55e" : "rgba(148,163,184,0.3)" }}>
                      {m.bid ? ans(m.bid, blanks) : m.line.charAt(0)}
                    </span>
                    <span>{m.bid ? m.line : m.line.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Classe class */}
            <div style={{ fontFamily:"monospace", fontSize:"0.75rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden" }}>
              <div style={{ background:"rgba(16,185,129,0.12)", borderBottom:"1px solid var(--border)", padding:"0.45rem 0.85rem", textAlign:"center", fontWeight:800, color:"#6ee7b7", fontSize:"0.82rem" }}>
                Classe
              </div>
              <div style={{ borderBottom:"1px solid var(--border)", paddingBottom:"0.2rem" }}>
                {CLASSE_ATTRS.map((a, i) => (
                  <div key={i} style={{ padding:"0.2rem 0.85rem", display:"flex", gap:"0.2rem", color: filled(a.bid, blanks) ? "#86efac" : "rgba(148,163,184,0.4)" }}>
                    <span style={{ fontWeight:700, color: filled(a.bid, blanks) ? "#22c55e" : "rgba(148,163,184,0.3)" }}>
                      {a.bid ? ans(a.bid, blanks) : a.line.charAt(0)}
                    </span>
                    <span>{a.bid ? a.line : a.line.slice(1)}</span>
                  </div>
                ))}
              </div>
              <div style={{ paddingBottom:"0.2rem" }}>
                {CLASSE_METHODS.map((m, i) => (
                  <div key={i} style={{ padding:"0.2rem 0.85rem", display:"flex", gap:"0.2rem", color: filled(m.bid, blanks) ? "#86efac" : "rgba(148,163,184,0.4)" }}>
                    <span style={{ fontWeight:700, color: filled(m.bid, blanks) ? "#22c55e" : "rgba(148,163,184,0.3)" }}>
                      {m.bid ? ans(m.bid, blanks) : m.line.charAt(0)}
                    </span>
                    <span>{m.bid ? m.line : m.line.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personagem class */}
            <div style={{ fontFamily:"monospace", fontSize:"0.75rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden" }}>
              <div style={{ background:"rgba(124,58,237,0.18)", borderBottom:"1px solid var(--border)", padding:"0.45rem 0.85rem", textAlign:"center", fontWeight:800, color:"var(--primary-light)", fontSize:"0.82rem" }}>
                Personagem
              </div>
              <div style={{ borderBottom:"1px solid var(--border)", paddingBottom:"0.2rem" }}>
                {ATTRS.map((a, i) => (
                  <div key={i} style={{ padding:"0.2rem 0.85rem", display:"flex", alignItems:"center", gap:"0.2rem", color: filled(a.bid, blanks) ? "#86efac" : "rgba(148,163,184,0.4)" }}>
                    <span style={{ fontWeight:700, color: filled(a.bid, blanks) ? "#22c55e" : "rgba(148,163,184,0.3)" }}>
                      {a.bid ? ans(a.bid, blanks) : a.line.charAt(0)}
                    </span>
                    <span>{a.bid ? a.line : a.line.slice(1)}</span>
                    {filled(a.bid, blanks) && <span style={{ marginLeft:"auto", fontSize:"0.55rem", color:"#22c55e" }}>✓</span>}
                  </div>
                ))}
              </div>
              <div style={{ paddingBottom:"0.2rem" }}>
                {METHODS.map((m, i) => (
                  <div key={i} style={{ padding:"0.2rem 0.85rem", display:"flex", alignItems:"center", gap:"0.2rem", color: filled(m.bid, blanks) ? "#86efac" : "rgba(148,163,184,0.4)" }}>
                    <span style={{ fontWeight:700, color: filled(m.bid, blanks) ? "#22c55e" : "rgba(148,163,184,0.3)" }}>
                      {m.bid ? ans(m.bid, blanks) : m.line.charAt(0)}
                    </span>
                    <span>{m.bid ? m.line : m.line.slice(1)}</span>
                    {filled(m.bid, blanks) && <span style={{ marginLeft:"auto", fontSize:"0.55rem", color:"#22c55e" }}>✓</span>}
                  </div>
                ))}
              </div>
              {/* Association labels */}
              <div style={{ padding:"0.3rem 0.85rem", borderTop:"1px solid var(--border)", fontSize:"0.6rem", color:"rgba(148,163,184,0.3)", fontStyle:"italic" }}>
                Personagem ──uses──▶ Classe, Reino
              </div>
            </div>
          </div>
        </div>

        {/* ── Student Task ── */}
        <div style={{ animation:"fadeUp 0.5s 0.3s ease both", opacity:0, animationFillMode:"forwards", background:"rgba(15,23,42,0.7)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"16px", padding:"1.25rem 1.5rem", marginBottom:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.75rem" }}>
            <span style={{ fontSize:"1.4rem" }}>☕</span>
            <div>
              <h2 style={{ fontSize:"1rem", fontWeight:900 }}>Agora é com você!</h2>
              <p style={{ fontSize:"0.76rem", color:"var(--muted)", marginTop:"0.1rem" }}>
                Implemente as 3 classes no Java e instancie o mesmo herói que você criou aqui.
              </p>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:"0.5rem" }}>
            {[
              { emoji:reino?.emoji ?? "🏰", label:`classe Reino`, cor:reino?.cor ?? "#fbbf24", desc:`Atributos: nome, bonus, valorBonus` },
              { emoji:info.emoji, label:`classe Classe`, cor:info.cor, desc:`Atributos: nome, emoji, cor` },
              { emoji:"⚔️",       label:`classe Personagem`, cor:"#a78bfa", desc:`Referencia Reino e Classe` },
            ].map(card => (
              <div key={card.label} style={{ padding:"0.75rem", background:`${card.cor}08`, border:`1px solid ${card.cor}25`, borderRadius:"10px" }}>
                <div style={{ fontSize:"1.25rem", marginBottom:"0.25rem" }}>{card.emoji}</div>
                <div style={{ fontWeight:700, color:card.cor, fontSize:"0.78rem" }}>{card.label}</div>
                <div style={{ fontSize:"0.67rem", color:"var(--muted)", marginTop:"0.2rem" }}>{card.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:"0.75rem", padding:"0.6rem 0.85rem", background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"8px", fontSize:"0.73rem", color:"#86efac" }}>
            💡 Dica: instancie <b>{varNome}</b> com reino <b>{reinoId}</b> e classe <b>{info.nome}</b> — os valores já estão nos diagramas de objeto acima!
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"center", flexWrap:"wrap", animation:"fadeUp 0.5s 0.45s ease both", opacity:0, animationFillMode:"forwards" }}>
          <Link href="/dashboard" className="btn btn-primary">Ver meus heróis</Link>
          <Link href="/criar-personagem" className="btn btn-ghost">Criar outro herói</Link>
        </div>
      </main>
    </div>
  );
}
