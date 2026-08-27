"use client";

import { KeyboardEvent } from "react";
import { CFG, type BS } from "./config";
import { CLASSES, REINOS, type Classe } from "@/types";

// ─── BlankInput ──────────────────────────────────────────────────────────────

function BlankInput({ id, blanks, onChange, onCheck }: {
  id: string;
  blanks: Record<string, BS>;
  onChange: (id: string, val: string) => void;
  onCheck: (id: string) => void;
}) {
  const cfg = CFG[id];
  const b = blanks[id];
  const ok = b.status === "ok";
  const err = b.status === "err";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", verticalAlign: "middle" }}>
      <input
        value={b.val}
        onChange={e => onChange(id, e.target.value)}
        onBlur={() => { if (b.val.trim()) onCheck(id); }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") onCheck(id); }}
        disabled={ok}
        placeholder="?"
        style={{
          width: cfg.w, fontFamily: "monospace", fontSize: "0.78rem",
          padding: "2px 5px", borderRadius: "4px", textAlign: "center",
          border: `1.5px solid ${ok ? "#22c55e" : err ? "#ef4444" : "rgba(124,58,237,0.55)"}`,
          background: ok ? "rgba(34,197,94,0.12)" : err ? "rgba(239,68,68,0.08)" : "rgba(124,58,237,0.08)",
          color: ok ? "#86efac" : "#e2e8f0", outline: "none",
        }}
      />
      {ok && <span style={{ color: "#22c55e", fontSize: "0.65rem" }}>✓</span>}
      {err && <span style={{ color: "#ef4444", fontSize: "0.65rem" }}>✗</span>}
    </span>
  );
}

// ─── Smart Blank — interactive / already done / future step ─────────────────

function B({ id, blanks, onChange, onCheck, stepBlanks }: {
  id: string;
  blanks: Record<string, BS>;
  onChange: (id: string, val: string) => void;
  onCheck: (id: string) => void;
  stepBlanks: string[];
}) {
  const b = blanks[id];
  if (b.status === "ok") {
    return (
      <span style={{ color: "#86efac", fontWeight: 700, fontFamily: "monospace", fontSize: "0.78rem" }}>
        {b.val}
      </span>
    );
  }
  if (!stepBlanks.includes(id)) {
    // Sem borda, sem ícone — apenas texto apagado que não parece interativo
    return (
      <span style={{
        fontFamily: "monospace", fontSize: "0.78rem",
        color: "rgba(148,163,184,0.18)", userSelect: "none",
      }}>···</span>
    );
  }
  return <BlankInput id={id} blanks={blanks} onChange={onChange} onCheck={onCheck} />;
}

// ─── UML Row with hint button ─────────────────────────────────────────────────

function UMLRow({ ids, children, dicaAberta, onToggle, stepBlanks }: {
  ids: string[];
  children: React.ReactNode;
  dicaAberta: string | null;
  onToggle: (id: string | null) => void;
  stepBlanks: string[];
}) {
  const hasHint = ids.some(id => stepBlanks.includes(id));
  const open = ids.some(id => id === dicaAberta);
  const mainId = ids[0];
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.025)" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "0.28rem 0.9rem", gap: "0.4rem" }}>
        <span style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.2rem", flexWrap: "wrap" }}>
          {children}
        </span>
        {hasHint && (
          <button
            type="button"
            onClick={() => onToggle(open ? null : mainId)}
            style={{ border:"none", cursor:"pointer", fontSize:"0.78rem", padding:"0.1rem 0.25rem", borderRadius:"4px", flexShrink:0, color: open ? "#f59e0b" : "rgba(148,163,184,0.25)", background: open ? "rgba(245,158,11,0.1)" : "transparent" }}
          >💡</button>
        )}
      </div>
      {open && (
        <div style={{ margin:"0 0.9rem 0.4rem", padding:"0.5rem 0.7rem", background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:"8px" }}>
          {ids.filter(id => stepBlanks.includes(id)).map(id => (
            <div key={id} style={{ marginBottom:"0.35rem" }}>
              <p style={{ fontSize:"0.74rem", color:"rgba(253,230,138,0.9)", lineHeight:1.5 }}>{CFG[id].dica}</p>
              <p style={{ fontSize:"0.63rem", color:"rgba(148,163,184,0.45)", marginTop:"0.1rem" }}>
                Formato: <code style={{ color:"rgba(148,163,184,0.65)" }}>{CFG[id].ex}</code>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PRE helper ──────────────────────────────────────────────────────────────

const PRE: React.CSSProperties = {
  padding:"0.28rem 0.9rem", color:"rgba(148,163,184,0.38)",
  fontFamily:"monospace", fontSize:"0.82rem",
  borderBottom:"1px solid rgba(255,255,255,0.025)",
};

// ─── Reino Object Diagram ─────────────────────────────────────────────────────

function ReinoObjectDiagram({ reinoId }: { reinoId: string }) {
  const r = REINOS[reinoId];
  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.8rem", background:`${r.cor}08`, border:`1px solid ${r.cor}30`, borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ background:`${r.cor}15`, borderBottom:`1px solid ${r.cor}25`, padding:"0.5rem 0.9rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
        <span style={{ filter:`drop-shadow(0 0 6px ${r.cor})` }}>{r.emoji}</span>
        <span style={{ fontWeight:800, color:r.cor }}>{reinoId}</span>
        <span style={{ color:"rgba(148,163,184,0.4)" }}>: <span style={{ color:`${r.cor}cc` }}>Reino</span></span>
      </div>
      {[
        { k:"nome",       v:`"${r.nome}"` },
        { k:"bonus",      v:`"${r.bonus}"` },
        { k:"valorBonus", v:String(r.valorBonus), note:`representa: ${r.atributo}` },
      ].map(row => (
        <div key={row.k} style={{ padding:"0.25rem 0.9rem", display:"flex", gap:"0.4rem", alignItems:"baseline", borderBottom:"1px solid rgba(255,255,255,0.02)" }}>
          <span style={{ color:`${r.cor}80`, minWidth:"80px" }}>{row.k}</span>
          <span style={{ color:"rgba(148,163,184,0.3)" }}>=</span>
          <span style={{ color:"#93c5fd" }}>{row.v}</span>
          {"note" in row && row.note && <span style={{ marginLeft:"0.5rem", fontSize:"0.6rem", color:`${r.cor}60`, fontStyle:"italic" }}>{row.note}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Reino Class Diagram ──────────────────────────────────────────────────────

function ReinoClassDiagram({ blanks, onChange, onCheck, dicaAberta, onToggle, stepBlanks }: {
  blanks: Record<string, BS>;
  onChange: (id: string, val: string) => void;
  onCheck: (id: string) => void;
  dicaAberta: string | null;
  onToggle: (id: string | null) => void;
  stepBlanks: string[];
}) {
  // Funções regulares (não componentes) — evita desmonte/remonte no digitar
  const bx = (id: string) => (
    <B id={id} blanks={blanks} onChange={onChange} onCheck={onCheck} stepBlanks={stepBlanks} />
  );
  const row = (ids: string[], children: React.ReactNode) => (
    <UMLRow ids={ids} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks}>{children}</UMLRow>
  );

  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.82rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ background:"rgba(161,98,7,0.15)", borderBottom:"1px solid var(--border)", padding:"0.5rem 0.9rem", textAlign:"center", fontWeight:800, color:"#fbbf24", letterSpacing:"0.07em" }}>
        Reino
      </div>

      {/* Attributes */}
      <div style={{ borderBottom:"1px solid var(--border)" }}>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>atributos</div>
        {row(["rk-av-nome"], <>{bx("rk-av-nome")}{" nome : String"}</>)}
        <div style={PRE}>{"- bonus : String"}</div>
        {row(["rk-av-valor", "rk-at-valor"], <>{bx("rk-av-valor")}{" valorBonus : "}{bx("rk-at-valor")}</>)}
      </div>

      {/* Methods */}
      <div>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>métodos</div>
        {row(["rk-mv-getNome", "rk-mr-getNome"], <>{bx("rk-mv-getNome")}{" getNome() : "}{bx("rk-mr-getNome")}</>)}
        <div style={PRE}>{"+ getBonus() : String"}</div>
        <div style={{ ...PRE, borderBottom:"none" }}>{"+ getValorBonus() : int"}</div>
      </div>
    </div>
  );
}

// ─── Personagem Object Diagram ────────────────────────────────────────────────

function PersonagemObjectDiagram({ nome, classe, armaId, reinoId, step }: {
  nome: string; classe: Classe | null; armaId: string; reinoId: string; step: number;
}) {
  const info = classe ? CLASSES[classe] : null;
  const reino = reinoId ? REINOS[reinoId] : null;
  const armaFake = armaId;

  type Row = { k: string; v: string; active: boolean; dim: boolean };
  const rows: Row[] = [
    { k:"reinoId",  v: reinoId ? `"${reinoId}"` : "???",     active: step === 1 && !!reinoId, dim: !reinoId },
    { k:"classeId", v: info ? `"${classe}"` : "???",          active: step === 1 && !!classe, dim: !classe },
    { k:"nome",     v: nome ? `"${nome}"` : "???",           active: step === 2 && nome.length > 0, dim: step < 2 },
    { k:"nivel",    v: "1",                                   active: false, dim: step < 2 },
    { k:"xp",       v: "0",                                   active: false, dim: step < 2 },
    { k:"arma",     v: armaFake ? `"${armaFake}"` : "null",  active: step === 3 && !!armaFake, dim: false },
    { k:"armadura", v: "null",                                active: false, dim: step < 4 },
    { k:"anel",     v: "null",                                active: false, dim: step < 4 },
  ];

  const varName = nome ? nome.split(",")[0].trim().replace(/[^a-zA-Z]/g,"").toLowerCase() || "heroi" : "heroi";

  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.78rem", background:"rgba(59,130,246,0.05)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:"12px", overflow:"hidden", marginBottom:"0.65rem" }}>
      <div style={{ background:"rgba(59,130,246,0.12)", borderBottom:"1px solid rgba(59,130,246,0.2)", padding:"0.45rem 0.9rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>
        <span style={{ fontSize:"0.6rem", color:"rgba(148,163,184,0.4)", textTransform:"uppercase" }}>objeto</span>
        <span style={{ fontWeight:800, color:"#93c5fd" }}>{varName} : <span style={{ color:"#60a5fa" }}>Personagem</span></span>
      </div>
      {rows.map(r => (
        <div key={r.k} style={{ padding:"0.22rem 0.9rem", display:"flex", gap:"0.4rem", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.02)", background: r.active ? "rgba(59,130,246,0.06)" : "transparent", transition:"background 0.3s" }}>
          <span style={{ color: r.active ? "#93c5fd" : "rgba(148,163,184,0.4)", minWidth:"68px" }}>{r.k}</span>
          <span style={{ color:"rgba(148,163,184,0.25)" }}>=</span>
          <span style={{ color: r.active ? "#93c5fd" : r.dim || r.v === "null" ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.5)", fontStyle: r.dim ? "italic" : "normal" }}>
            {r.dim ? "···" : r.v}
          </span>
          {r.active && !r.dim && <span style={{ marginLeft:"auto", fontSize:"0.58rem", color:"#60a5fa" }}>← agora</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Classe Object Diagram ────────────────────────────────────────────────────

function ClasseObjectDiagram({ classe }: { classe: Classe | null }) {
  if (!classe) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80px", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:"12px", color:"var(--muted)", fontSize:"0.75rem" }}>
        selecione uma classe
      </div>
    );
  }
  const info = CLASSES[classe];
  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.78rem", background:`${info.cor}08`, border:`1px solid ${info.cor}30`, borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ background:`${info.cor}15`, borderBottom:`1px solid ${info.cor}25`, padding:"0.45rem 0.9rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
        <span style={{ filter:`drop-shadow(0 0 6px ${info.cor})` }}>{info.emoji}</span>
        <span style={{ fontWeight:800, color:info.cor }}>{classe}</span>
        <span style={{ color:"rgba(148,163,184,0.4)" }}>: <span style={{ color:`${info.cor}cc` }}>Classe</span></span>
      </div>
      {[
        { k:"nome",  v:`"${info.nome}"` },
        { k:"emoji", v:`"${info.emoji}"` },
        { k:"cor",   v:`"${info.cor}"` },
      ].map(r => (
        <div key={r.k} style={{ padding:"0.22rem 0.9rem", display:"flex", gap:"0.4rem", alignItems:"baseline", borderBottom:"1px solid rgba(255,255,255,0.02)" }}>
          <span style={{ color:`${info.cor}70`, minWidth:"52px" }}>{r.k}</span>
          <span style={{ color:"rgba(148,163,184,0.3)" }}>=</span>
          <span style={{ color:"#93c5fd" }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Classe Class Diagram ─────────────────────────────────────────────────────

function ClasseClassDiagram({ blanks, onChange, onCheck, dicaAberta, onToggle, stepBlanks }: {
  blanks: Record<string, BS>;
  onChange: (id: string, val: string) => void;
  onCheck: (id: string) => void;
  dicaAberta: string | null;
  onToggle: (id: string | null) => void;
  stepBlanks: string[];
}) {
  const bx = (id: string) => (
    <B id={id} blanks={blanks} onChange={onChange} onCheck={onCheck} stepBlanks={stepBlanks} />
  );
  const row = (ids: string[], children: React.ReactNode) => (
    <UMLRow ids={ids} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks}>{children}</UMLRow>
  );

  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.82rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ background:"rgba(16,185,129,0.12)", borderBottom:"1px solid var(--border)", padding:"0.5rem 0.9rem", textAlign:"center", fontWeight:800, color:"#6ee7b7", letterSpacing:"0.07em" }}>
        Classe
      </div>
      <div style={{ borderBottom:"1px solid var(--border)" }}>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>atributos</div>
        {row(["ck-av-nome"], <>{bx("ck-av-nome")}{" nome : String"}</>)}
        {row(["ck-av-emoji"], <>{bx("ck-av-emoji")}{" emoji : String"}</>)}
        <div style={PRE}>{"- cor : String"}</div>
      </div>
      <div>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>métodos</div>
        {row(["ck-mv-getNome", "ck-mr-getNome"], <>{bx("ck-mv-getNome")}{" getNome() : "}{bx("ck-mr-getNome")}</>)}
        <div style={PRE}>{"+ getEmoji() : String"}</div>
        <div style={{ ...PRE, borderBottom:"none" }}>{"+ getCor() : String"}</div>
      </div>
    </div>
  );
}

// ─── Personagem Class Diagram ─────────────────────────────────────────────────

function PersonagemClassDiagram({ blanks, onChange, onCheck, dicaAberta, onToggle, stepBlanks }: {
  blanks: Record<string, BS>;
  onChange: (id: string, val: string) => void;
  onCheck: (id: string) => void;
  dicaAberta: string | null;
  onToggle: (id: string | null) => void;
  stepBlanks: string[];
}) {
  // Funções regulares (não componentes) — evita desmonte/remonte no digitar
  const bx = (id: string) => (
    <B id={id} blanks={blanks} onChange={onChange} onCheck={onCheck} stepBlanks={stepBlanks} />
  );
  const row = (ids: string[], children: React.ReactNode) => (
    <UMLRow ids={ids} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks}>{children}</UMLRow>
  );

  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.82rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ background:"rgba(124,58,237,0.18)", borderBottom:"1px solid var(--border)", padding:"0.5rem 0.9rem", textAlign:"center", fontWeight:800, color:"var(--primary-light)", letterSpacing:"0.07em" }}>
        Personagem
      </div>

      {/* Attributes */}
      <div style={{ borderBottom:"1px solid var(--border)" }}>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>atributos</div>
        {row(["pav-reino"], <>{bx("pav-reino")}{" reinoId : String"}<span style={{ fontSize:"0.65rem", color:"rgba(148,163,184,0.3)", marginLeft:"4px" }}>{"→ Reino"}</span></>)}
        {row(["pav-classe"], <>{bx("pav-classe")}{" classeId : String"}<span style={{ fontSize:"0.65rem", color:"rgba(148,163,184,0.3)", marginLeft:"4px" }}>{"→ Classe"}</span></>)}
        {row(["av-nome"], <>{bx("av-nome")}{" nome : String"}</>)}
        {row(["av-nivel", "at-nivel"], <>{bx("av-nivel")}{" nivel : "}{bx("at-nivel")}</>)}
        <div style={PRE}>{"- xp : int"}</div>
        {row(["av-arma"], <>{bx("av-arma")}{" arma : String"}</>)}
        <div style={PRE}>{"- armadura : String"}</div>
        {row(["av-anel", "at-anel"], <>{bx("av-anel")}{" anel : "}{bx("at-anel")}</>)}
      </div>

      {/* Methods */}
      <div>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>métodos</div>
        {row(["mv-ctor"], <>{bx("mv-ctor")}{" Personagem(nome, classeId, reinoId)"}</>)}
        {row(["mv-getNome", "mr-getNome"], <>{bx("mv-getNome")}{" getNome() : "}{bx("mr-getNome")}</>)}
        <div style={PRE}>{"+ getNivel() : int"}</div>
        <div style={PRE}>{"+ getXp() : int"}</div>
        {row(["mv-equArma", "mp-equArma"], <>{bx("mv-equArma")}{" equiparArma(arma : "}{bx("mp-equArma")}{") : void"}</>)}
        {row(["mv-equArmadura", "mr-equArmadura"], <>{bx("mv-equArmadura")}{" equiparArmadura(armadura : String) : "}{bx("mr-equArmadura")}</>)}
        <div style={{ ...PRE, borderBottom:"none" }}>{"+ getClasse() : Classe"}</div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DiagramaStep({ step, blanks, onChange, onCheck, dicaAberta, onToggle, nome, classe, armaId, reinoId, stepBlanks, corretos, total }: {
  step: number;
  blanks: Record<string, BS>;
  onChange: (id: string, val: string) => void;
  onCheck: (id: string) => void;
  dicaAberta: string | null;
  onToggle: (id: string | null) => void;
  nome: string;
  classe: Classe | null;
  armaId: string;
  reinoId: string;
  stepBlanks: string[];
  corretos: number;
  total: number;
}) {
  const done = corretos === total;
  const pct = Math.round((corretos / total) * 100);
  const stepDone = stepBlanks.every(id => blanks[id]?.status === "ok");
  const stepCorretos = stepBlanks.filter(id => blanks[id]?.status === "ok").length;

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
        <span style={{ fontSize:"0.7rem", color: done ? "#22c55e" : "var(--muted)" }}>
          {done ? "✅ Todos os campos concluídos!" : `${corretos} de ${total} campos totais`}
        </span>
        <span style={{ fontSize:"0.7rem", color:"var(--primary-light)" }}>{pct}%</span>
      </div>
      <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"99px", overflow:"hidden", marginBottom:"0.75rem" }}>
        <div style={{ height:"100%", borderRadius:"99px", transition:"width 0.4s ease", background: done ? "#22c55e" : "linear-gradient(90deg,#7c3aed,#a78bfa)", width:`${pct}%` }} />
      </div>

      {/* Step completion banner */}
      {stepDone && !done && (
        <div style={{ padding:"1rem", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:"10px", marginBottom:"0.75rem", textAlign:"center" }}>
          <div style={{ fontSize:"1.3rem", marginBottom:"0.25rem" }}>✅</div>
          <div style={{ fontWeight:700, color:"#86efac", fontSize:"0.85rem", marginBottom:"0.2rem" }}>
            Etapa {step + 1} concluída!
          </div>
          <div style={{ fontSize:"0.75rem", color:"rgba(148,163,184,0.6)" }}>
            Feche o diagrama e clique em <b style={{ color:"#86efac" }}>Avançar →</b> para desbloquear os próximos campos.
          </div>
        </div>
      )}
      {!stepDone && (
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.4rem 0.85rem", background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.18)", borderRadius:"8px", marginBottom:"0.75rem", fontSize:"0.72rem", color:"var(--primary-light)" }}>
          <span>📝</span>
          <span>Preencha os <b>{stepBlanks.length - stepCorretos}</b> campo{stepBlanks.length - stepCorretos !== 1 ? "s" : ""} desta etapa — os demais são desbloqueados nas próximas etapas.</span>
        </div>
      )}

      {/* ── DIAGRAMAS DE CLASSES ─────────────────────────────────────────────── */}
      <div style={{ marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.4rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <span>📐 diagramas de classes</span>
          <span style={{ color:"rgba(148,163,184,0.15)", fontSize:"0.55rem" }}>Personagem usa ──▶ Classe, Reino</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:"0.5rem" }}>
          <ReinoClassDiagram blanks={blanks} onChange={onChange} onCheck={onCheck} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks} />
          <ClasseClassDiagram blanks={blanks} onChange={onChange} onCheck={onCheck} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks} />
          <PersonagemClassDiagram blanks={blanks} onChange={onChange} onCheck={onCheck} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks} />
        </div>
      </div>

      {/* ── DIAGRAMAS DE OBJETOS ─────────────────────────────────────────────── */}
      <div style={{ marginBottom:"0.5rem" }}>
        <div style={{ fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.4rem" }}>
          📦 diagramas de objetos
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(175px, 1fr))", gap:"0.5rem" }}>
          <div>
            <div style={{ fontSize:"0.55rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.3rem", textAlign:"center" }}>instância: reino</div>
            {reinoId ? <ReinoObjectDiagram reinoId={reinoId} /> : (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80px", border:"1px dashed rgba(255,255,255,0.06)", borderRadius:"12px", color:"var(--muted)", fontSize:"0.7rem" }}>selecione um reino</div>
            )}
          </div>
          <div>
            <div style={{ fontSize:"0.55rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.3rem", textAlign:"center" }}>instância: classe</div>
            <ClasseObjectDiagram classe={classe} />
          </div>
          <div>
            <div style={{ fontSize:"0.55rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"0.3rem", textAlign:"center" }}>instância: personagem</div>
            <PersonagemObjectDiagram nome={nome} classe={classe} armaId={armaId} reinoId={reinoId} step={step} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.6rem", fontSize:"0.64rem", color:"var(--muted)", flexWrap:"wrap" }}>
        <span><b style={{ color:"rgba(148,163,184,0.6)" }}>+</b> = public</span>
        <span><b style={{ color:"rgba(148,163,184,0.6)" }}>-</b> = private</span>
        <span style={{ color:"rgba(148,163,184,0.3)" }}>··· = desbloqueado na próxima etapa</span>
        <span>💡 = dica</span>
        <span>Enter = verificar</span>
      </div>
    </div>
  );
}
