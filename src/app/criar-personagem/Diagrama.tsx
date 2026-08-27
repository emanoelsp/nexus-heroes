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
    return (
      <span style={{
        display: "inline-block", width: CFG[id].w, textAlign: "center",
        fontFamily: "monospace", fontSize: "0.78rem", color: "rgba(148,163,184,0.2)",
        border: "1px dashed rgba(255,255,255,0.07)", borderRadius: "4px", padding: "2px 4px",
      }}>?</span>
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
  function Bx({ id }: { id: string }) {
    return <B id={id} blanks={blanks} onChange={onChange} onCheck={onCheck} stepBlanks={stepBlanks} />;
  }
  function Row({ ids, children }: { ids: string[]; children: React.ReactNode }) {
    return <UMLRow ids={ids} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks}>{children}</UMLRow>;
  }

  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.82rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ background:"rgba(161,98,7,0.15)", borderBottom:"1px solid var(--border)", padding:"0.5rem 0.9rem", textAlign:"center", fontWeight:800, color:"#fbbf24", letterSpacing:"0.07em" }}>
        Reino
      </div>

      {/* Attributes */}
      <div style={{ borderBottom:"1px solid var(--border)" }}>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>atributos</div>
        <Row ids={["rk-av-nome"]}><Bx id="rk-av-nome" />{" nome : String"}</Row>
        <div style={PRE}>{"- bonus : String"}</div>
        <Row ids={["rk-av-valor", "rk-at-valor"]}><Bx id="rk-av-valor" />{" valorBonus : "}<Bx id="rk-at-valor" /></Row>
      </div>

      {/* Methods */}
      <div>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>métodos</div>
        <Row ids={["rk-mv-getNome", "rk-mr-getNome"]}><Bx id="rk-mv-getNome" />{" getNome() : "}<Bx id="rk-mr-getNome" /></Row>
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
    { k:"nome",     v: nome ? `"${nome}"` : "???",           active: step === 2 && nome.length > 0, dim: step < 2 },
    { k:"classe",   v: info ? info.nome : "???",              active: step === 1 && !!classe, dim: !classe },
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

// ─── Personagem Class Diagram ─────────────────────────────────────────────────

function PersonagemClassDiagram({ blanks, onChange, onCheck, dicaAberta, onToggle, stepBlanks }: {
  blanks: Record<string, BS>;
  onChange: (id: string, val: string) => void;
  onCheck: (id: string) => void;
  dicaAberta: string | null;
  onToggle: (id: string | null) => void;
  stepBlanks: string[];
}) {
  function Bx({ id }: { id: string }) {
    return <B id={id} blanks={blanks} onChange={onChange} onCheck={onCheck} stepBlanks={stepBlanks} />;
  }
  function Row({ ids, children }: { ids: string[]; children: React.ReactNode }) {
    return <UMLRow ids={ids} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks}>{children}</UMLRow>;
  }

  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.82rem", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ background:"rgba(124,58,237,0.18)", borderBottom:"1px solid var(--border)", padding:"0.5rem 0.9rem", textAlign:"center", fontWeight:800, color:"var(--primary-light)", letterSpacing:"0.07em" }}>
        Personagem
      </div>

      {/* Attributes */}
      <div style={{ borderBottom:"1px solid var(--border)" }}>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>atributos</div>
        <Row ids={["pav-reino"]}><Bx id="pav-reino" />{" reinoId : String"}<span style={{ fontSize:"0.65rem", color:"rgba(148,163,184,0.3)", marginLeft:"4px" }}>{"→ Reino"}</span></Row>
        <Row ids={["av-nome"]}><Bx id="av-nome" />{" nome : String"}</Row>
        <Row ids={["av-classe"]}><Bx id="av-classe" />{" classe : String"}</Row>
        <Row ids={["av-nivel", "at-nivel"]}><Bx id="av-nivel" />{" nivel : "}<Bx id="at-nivel" /></Row>
        <div style={PRE}>{"- xp : int"}</div>
        <Row ids={["av-arma"]}><Bx id="av-arma" />{" arma : String"}</Row>
        <div style={PRE}>{"- armadura : String"}</div>
        <Row ids={["av-anel", "at-anel"]}><Bx id="av-anel" />{" anel : "}<Bx id="at-anel" /></Row>
      </div>

      {/* Methods */}
      <div>
        <div style={{ padding:"0.3rem 0.9rem 0.15rem", fontSize:"0.6rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em" }}>métodos</div>
        <Row ids={["mv-ctor"]}><Bx id="mv-ctor" />{" Personagem(nome : String, classe : String, reinoId : String)"}</Row>
        <Row ids={["mv-getNome", "mr-getNome"]}><Bx id="mv-getNome" />{" getNome() : "}<Bx id="mr-getNome" /></Row>
        <div style={PRE}>{"+ getNivel() : int"}</div>
        <div style={PRE}>{"+ getXp() : int"}</div>
        <Row ids={["mv-equArma", "mp-equArma"]}><Bx id="mv-equArma" />{" equiparArma(arma : "}<Bx id="mp-equArma" />{") : void"}</Row>
        <Row ids={["mv-equArmadura", "mr-equArmadura"]}><Bx id="mv-equArmadura" />{" equiparArmadura(armadura : String) : "}<Bx id="mr-equArmadura" /></Row>
        <div style={{ ...PRE, borderBottom:"none" }}>{"+ getClasse() : String"}</div>
      </div>
    </div>
  );
}

// ─── Reino Reference Badge (shown in steps 1+) ───────────────────────────────

function ReinoBadge({ reinoId }: { reinoId: string }) {
  const r = REINOS[reinoId];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.35rem 0.75rem", background:`${r.cor}10`, border:`1px solid ${r.cor}25`, borderRadius:"8px", marginBottom:"0.6rem", fontSize:"0.75rem" }}>
      <span>{r.emoji}</span>
      <span style={{ fontWeight:700, color:r.cor }}>{reinoId}</span>
      <span style={{ color:"rgba(148,163,184,0.4)" }}>: Reino</span>
      <span style={{ marginLeft:"auto", color:"rgba(148,163,184,0.35)", fontSize:"0.62rem" }}>associado ao Personagem →</span>
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

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
        <span style={{ fontSize:"0.7rem", color: done ? "#22c55e" : "var(--muted)" }}>
          {done ? "✅ Concluído!" : `${corretos} de ${total} campos`}
        </span>
        <span style={{ fontSize:"0.7rem", color:"var(--primary-light)" }}>{pct}%</span>
      </div>
      <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"99px", overflow:"hidden", marginBottom:"1rem" }}>
        <div style={{ height:"100%", borderRadius:"99px", transition:"width 0.4s ease", background: done ? "#22c55e" : "linear-gradient(90deg,#7c3aed,#a78bfa)", width:`${pct}%` }} />
      </div>

      {/* Step 0: side-by-side Reino object + class */}
      {step === 0 && reinoId && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.15fr", gap:"0.65rem" }}>
          <div>
            <div style={{ fontSize:"0.65rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.4rem" }}>objeto</div>
            <ReinoObjectDiagram reinoId={reinoId} />
          </div>
          <div>
            <div style={{ fontSize:"0.65rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.4rem" }}>classe</div>
            <ReinoClassDiagram blanks={blanks} onChange={onChange} onCheck={onCheck} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks} />
          </div>
        </div>
      )}

      {/* Step 0 without selection */}
      {step === 0 && !reinoId && (
        <div style={{ textAlign:"center", padding:"2rem", color:"var(--muted)", fontSize:"0.85rem", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:"12px" }}>
          👆 Selecione um reino para ver os diagramas
        </div>
      )}

      {/* Steps 1+: Personagem diagrams */}
      {step > 0 && (
        <>
          {reinoId && <ReinoBadge reinoId={reinoId} />}
          <PersonagemObjectDiagram nome={nome} classe={classe} armaId={armaId} reinoId={reinoId} step={step} />
          <PersonagemClassDiagram blanks={blanks} onChange={onChange} onCheck={onCheck} dicaAberta={dicaAberta} onToggle={onToggle} stepBlanks={stepBlanks} />
        </>
      )}

      {/* Legend */}
      <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem", fontSize:"0.65rem", color:"var(--muted)", flexWrap:"wrap" }}>
        <span><b style={{ color:"rgba(148,163,184,0.6)" }}>+</b> = public</span>
        <span><b style={{ color:"rgba(148,163,184,0.6)" }}>-</b> = private</span>
        <span style={{ color:"rgba(124,58,237,0.65)" }}>■ = campo desta etapa</span>
        <span style={{ color:"rgba(148,163,184,0.25)" }}>? = próxima etapa</span>
        <span>💡 = dica · Enter = verificar</span>
      </div>
    </div>
  );
}
