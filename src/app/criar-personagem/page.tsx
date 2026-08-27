"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
// dynamic import — avoids SSR issues with document/window
const swal = async (opts: object) => {
  const { default: Swal } = await import("sweetalert2");
  return (swal as (opts: object) => Promise<unknown>)(opts);
};
import { useAuth } from "@/contexts/AuthContext";
import { CLASSES, REINOS, ARMAS, type Classe } from "@/types";
import { BLANK_IDS, initBlanks, STEP_DEFS, type BS, type StepDef } from "./config";

const DiagramaStep = dynamic(() => import("./Diagrama"), { ssr: false });
const SuccessScreen  = dynamic(() => import("./Sucesso"),  { ssr: false });

const CLASSES_LISTA = Object.entries(CLASSES) as [Classe, (typeof CLASSES)[Classe]][];
const REINOS_LISTA  = Object.entries(REINOS);
const TOTAL_STEPS   = STEP_DEFS.length; // 5

type HeroData = { nome: string; classe: Classe; armaId: string; reinoId: string; blanks: Record<string, BS> };

export default function CriarPersonagemPage() {
  const { user } = useAuth();

  const [step, setStep]       = useState(0);
  const [reinoId, setReinoId] = useState("");
  const [classe, setClasse]   = useState<Classe | null>(null);
  const [nome, setNome]       = useState("");
  const [armaId, setArmaId]   = useState("");
  const [blanks, setBlanks]   = useState<Record<string, BS>>(initBlanks);
  const [dicaAberta, setDicaAberta] = useState<string | null>(null);
  const [diagAberto, setDiagAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [heroCriado, setHeroCriado] = useState<HeroData | null>(null);

  const stepDef: StepDef  = STEP_DEFS[step];
  const stepBlanks         = stepDef.blankIds;
  const stepCorretos        = stepBlanks.filter(id => blanks[id]?.status === "ok").length;
  const totalCorretos       = BLANK_IDS.filter(id => blanks[id]?.status === "ok").length;

  function changeBlank(id: string, val: string) {
    setBlanks(p => ({ ...p, [id]: { ...p[id], val, status: "idle" } }));
  }

  function checkBlank(id: string) {
    import("./config").then(({ CFG }) => {
      const val = blanks[id].val.trim();
      const ok  = val.toLowerCase() === CFG[id].ans.toLowerCase();
      setBlanks(p => ({ ...p, [id]: { ...p[id], status: ok ? "ok" : "err" } }));
    });
  }

  function avancar() {
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
    setDiagAberto(false);
    setDicaAberta(null);
  }

  function voltar() {
    setStep(s => Math.max(s - 1, 0));
    setDiagAberto(false);
    setDicaAberta(null);
  }

  async function handleForjar() {
    if (!classe || !user || !nome.trim()) return;
    setCarregando(true);

    const cInfo = CLASSES[classe];
    const rInfo = reinoId ? REINOS[reinoId] : null;

    // Start Firestore in background while animation plays
    let heroErr = false;
    const heroPromise = (async () => {
      try {
        const { criarPersonagem, equiparItem } = await import("@/services/personagens");
        const id = await criarPersonagem(user.uid, nome.trim(), classe, reinoId || undefined);
        if (armaId) await equiparItem(id, "arma", armaId);
      } catch {
        heroErr = true;
      }
    })();

    await swal({
      html: `
        <div style="font-family:system-ui;text-align:center;padding:0.5rem 0">
          <div style="font-size:3.5rem;margin-bottom:0.4rem;filter:drop-shadow(0 0 20px ${cInfo.cor})">${cInfo.emoji}</div>
          ${rInfo ? `<div style="font-size:1.4rem;margin-bottom:0.5rem;filter:drop-shadow(0 0 10px ${rInfo.cor})">${rInfo.emoji}</div>` : ""}
          <div style="font-size:1.6rem;font-weight:900;color:${cInfo.cor};margin-bottom:0.25rem">${nome}</div>
          <div style="color:rgba(148,163,184,0.65);font-size:0.9rem;margin-bottom:0.75rem">${cInfo.nome}${rInfo ? ` · ${rInfo.nome}` : ""}</div>
          ${rInfo ? `<div style="display:inline-block;padding:0.25rem 0.75rem;border-radius:99px;background:${rInfo.cor}22;border:1px solid ${rInfo.cor}40;color:${rInfo.cor};font-size:0.78rem;margin-bottom:0.75rem">${rInfo.bonus}</div>` : ""}
          <div style="color:rgba(148,163,184,0.3);font-size:0.72rem;letter-spacing:0.08em;margin-top:0.5rem">✦ forjando na bigorna do destino… ✦</div>
        </div>
      `,
      timer: 2800,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      background: "#0f172a",
      color: "#e2e8f0",
    });

    await heroPromise;

    if (heroErr) {
      setCarregando(false);
      await swal({ icon:"error", title:"Erro ao forjar", text:"Tente novamente.", background:"#0f172a", color:"#e2e8f0", confirmButtonColor:"#7c3aed" });
      return;
    }

    setHeroCriado({ nome: nome.trim(), classe, armaId, reinoId, blanks });
  }

  const canAdvance =
    step === 0 ? !!reinoId :
    step === 1 ? !!classe  :
    step === 2 ? nome.trim().length >= 2 :
    step === 3 ? true :
    false;

  const isLastStep   = step === TOTAL_STEPS - 1;
  const armasFilt    = classe ? ARMAS.filter(a => a.clases.includes(classe)) : ARMAS;
  const reinoInfo    = reinoId ? REINOS[reinoId] : null;
  const classeInfo   = classe ? CLASSES[classe] : null;

  if (heroCriado) {
    return (
      <SuccessScreen
        nome={heroCriado.nome}
        classe={heroCriado.classe}
        armaId={heroCriado.armaId}
        reinoId={heroCriado.reinoId}
        blanks={heroCriado.blanks}
      />
    );
  }

  return (
    <div style={{ minHeight:"100vh" }}>
      <style>{`
        @keyframes diagSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes stepIn    { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
      `}</style>

      <nav className="nav">
        <Link href="/dashboard" className="nav-logo gold-text">⚔️ NEXUS</Link>
        <Link href="/dashboard" className="btn btn-ghost" style={{ fontSize:"0.82rem" }}>← Dashboard</Link>
      </nav>

      <main className="container" style={{ paddingTop:"2rem", paddingBottom:"5rem", maxWidth:"680px" }}>

        {/* ── Step indicator ── */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", marginBottom:"2rem", flexWrap:"wrap" }}>
          {STEP_DEFS.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.35rem" }}>
              <div style={{
                width:"28px", height:"28px", borderRadius:"50%", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.7rem", fontWeight:800, transition:"all 0.3s",
                background: i < step ? "#22c55e" : i === step ? "var(--primary)" : "rgba(255,255,255,0.05)",
                color: i <= step ? "#fff" : "rgba(148,163,184,0.35)",
                boxShadow: i === step ? "0 0 0 3px rgba(124,58,237,0.25)" : "none",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < TOTAL_STEPS - 1 && (
                <div style={{ width:"clamp(0.75rem,3vw,2rem)", height:"2px", background: i < step ? "#22c55e" : "rgba(255,255,255,0.07)", transition:"background 0.4s" }} />
              )}
            </div>
          ))}
          <span style={{ marginLeft:"0.35rem", fontSize:"0.75rem", color:"var(--muted)" }}>{stepDef.titulo}</span>
        </div>

        {/* ── Concept badge ── */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.65rem", padding:"0.2rem 0.65rem", borderRadius:"99px", background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.22)", fontSize:"0.73rem", color:"var(--primary-light)" }}>
          {stepDef.conceito}
        </div>

        <div style={{ animation:"stepIn 0.3s ease both" }} key={step}>
          <h1 style={{ fontSize:"1.4rem", fontWeight:800, marginBottom:"0.2rem" }}>{stepDef.titulo}</h1>
          <p style={{ color:"var(--muted)", fontSize:"0.83rem", marginBottom:"1.25rem" }}>{stepDef.subtitulo}</p>

          {/* ── STEP 0: Reino ── */}
          {step === 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:"0.6rem", marginBottom:"1.25rem" }}>
              {REINOS_LISTA.map(([key, r]) => {
                const sel = reinoId === key;
                return (
                  <div key={key} className="card-3d-wrapper" onClick={async () => {
                    setReinoId(key);
                    await swal({
                      html: `
                        <div style="font-family:system-ui;text-align:center;padding:0.25rem 0">
                          <div style="font-size:3rem;margin-bottom:0.4rem;filter:drop-shadow(0 0 14px ${r.cor})">${r.emoji}</div>
                          <div style="font-size:1.4rem;font-weight:900;color:${r.cor};margin-bottom:0.3rem">${r.nome}</div>
                          <div style="color:rgba(148,163,184,0.6);font-size:0.82rem;line-height:1.5;margin-bottom:0.65rem">${r.desc}</div>
                          <div style="display:inline-block;padding:0.2rem 0.7rem;border-radius:99px;background:${r.cor}20;border:1px solid ${r.cor}40;color:${r.cor};font-weight:700;font-size:0.8rem">${r.bonus}</div>
                        </div>
                      `,
                      title: `Você escolheu: ${r.nome}!`,
                      timer: 2400,
                      timerProgressBar: true,
                      confirmButtonText: "Continuar →",
                      confirmButtonColor: r.cor,
                      background: "#0f172a",
                      color: "#e2e8f0",
                    });
                    setDiagAberto(true);
                  }}>
                    <div className="card card-3d" style={{ padding:"1.1rem 1rem", cursor:"pointer", borderColor: sel ? r.cor : `${r.cor}20`, background: sel ? r.corFundo : "var(--bg2)", boxShadow: sel ? `0 0 22px ${r.cor}40` : "none", outline: sel ? `2px solid ${r.cor}` : "none", outlineOffset:"2px" }}>
                      <div style={{ fontSize:"1.75rem", marginBottom:"0.4rem", filter:`drop-shadow(0 0 8px ${r.cor})` }}>{r.emoji}</div>
                      <div style={{ fontWeight:800, fontSize:"0.85rem", color: sel ? r.cor : "var(--text)", marginBottom:"0.2rem" }}>{r.nome}</div>
                      <div style={{ fontSize:"0.67rem", color:"var(--muted)", lineHeight:1.4, marginBottom:"0.4rem" }}>{r.desc.substring(0,65)}…</div>
                      <div style={{ display:"inline-flex", padding:"0.1rem 0.45rem", borderRadius:"99px", background:`${r.cor}18`, border:`1px solid ${r.cor}35`, fontSize:"0.65rem", color:r.cor, fontWeight:700 }}>
                        {r.bonus}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STEP 1: Classe ── */}
          {step === 1 && (
            <div style={{ marginBottom:"1.25rem" }}>
              {reinoInfo && (
                <div style={{ display:"flex", alignItems:"center", gap:"0.65rem", padding:"0.6rem 0.9rem", background:reinoInfo.corFundo, border:`1px solid ${reinoInfo.cor}25`, borderRadius:"10px", marginBottom:"1rem" }}>
                  <span style={{ fontSize:"1.3rem", filter:`drop-shadow(0 0 6px ${reinoInfo.cor})` }}>{reinoInfo.emoji}</span>
                  <div>
                    <div style={{ fontWeight:700, color:reinoInfo.cor, fontSize:"0.85rem" }}>{reinoInfo.nome}</div>
                    <div style={{ fontSize:"0.68rem", color:"var(--muted)" }}>{reinoInfo.bonus}</div>
                  </div>
                  <button onClick={() => { setStep(0); setDiagAberto(false); }} style={{ marginLeft:"auto", background:"none", border:"none", color:"var(--muted)", fontSize:"0.7rem", cursor:"pointer" }}>← trocar</button>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))", gap:"0.6rem" }}>
                {CLASSES_LISTA.map(([key, c]) => {
                  const sel = classe === key;
                  return (
                    <div key={key} className="card-3d-wrapper" onClick={async () => {
                      setClasse(key);
                      await swal({
                        html: `
                          <div style="font-family:system-ui;text-align:center;padding:0.25rem 0">
                            <div style="font-size:3rem;margin-bottom:0.4rem;filter:drop-shadow(0 0 14px ${c.cor})">${c.emoji}</div>
                            <div style="font-size:1.4rem;font-weight:900;color:${c.cor};margin-bottom:0.3rem">${c.nome}</div>
                            <div style="color:rgba(148,163,184,0.6);font-size:0.82rem;line-height:1.5">${c.desc}</div>
                          </div>
                        `,
                        title: `Você escolheu: ${c.nome}!`,
                        timer: 2400,
                        timerProgressBar: true,
                        confirmButtonText: "Continuar →",
                        confirmButtonColor: c.cor,
                        background: "#0f172a",
                        color: "#e2e8f0",
                      });
                      setDiagAberto(true);
                    }}>
                      <div className="card card-3d" style={{ padding:"1rem 0.85rem", textAlign:"center", cursor:"pointer", borderColor: sel ? c.cor : `${c.cor}20`, background: sel ? c.corFundo : "var(--bg2)", boxShadow: sel ? `0 0 20px ${c.cor}40` : "none", outline: sel ? `2px solid ${c.cor}` : "none", outlineOffset:"2px" }}>
                        <div style={{ fontSize:"1.75rem", marginBottom:"0.3rem", filter:`drop-shadow(0 0 8px ${c.cor})` }}>{c.emoji}</div>
                        <div style={{ fontWeight:800, fontSize:"0.8rem", color: sel ? c.cor : "var(--text)" }}>{c.nome}</div>
                        <div style={{ fontSize:"0.64rem", color:"var(--muted)", lineHeight:1.4, marginTop:"0.15rem" }}>{c.desc.substring(0,50)}…</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2: Nome ── */}
          {step === 2 && (
            <div style={{ marginBottom:"1.25rem" }}>
              {/* Identity summary */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.65rem", padding:"0.6rem 0.9rem", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:"10px", marginBottom:"1rem" }}>
                {reinoInfo && <span style={{ fontSize:"1rem", opacity:0.7 }}>{reinoInfo.emoji}</span>}
                {classeInfo && <span style={{ fontSize:"1.25rem", filter:`drop-shadow(0 0 6px ${classeInfo.cor})` }}>{classeInfo.emoji}</span>}
                <div>
                  <div style={{ fontWeight:700, fontSize:"0.87rem", color: classeInfo?.cor }}>{classeInfo?.nome}</div>
                  <div style={{ fontSize:"0.68rem", color:"var(--muted)" }}>{reinoInfo?.nome}</div>
                </div>
                <button onClick={() => { setStep(1); setDiagAberto(false); }} style={{ marginLeft:"auto", background:"none", border:"none", color:"var(--muted)", fontSize:"0.7rem", cursor:"pointer" }}>← trocar</button>
              </div>
              <label style={{ display:"block", fontSize:"0.85rem", fontWeight:600, marginBottom:"0.5rem" }}>Nome do Personagem</label>
              <input
                type="text" className="input-field"
                placeholder="Ex: Aryn, o Imortal"
                value={nome}
                onChange={e => { setNome(e.target.value); if (e.target.value.trim().length >= 2) setDiagAberto(true); }}
                maxLength={30} autoFocus
                style={{ fontSize:"1rem" }}
              />
            </div>
          )}

          {/* ── STEP 3: Arma ── */}
          {step === 3 && (
            <div style={{ marginBottom:"1.25rem" }}>
              {/* Hero card */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.65rem", padding:"0.65rem 0.9rem", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:"10px", marginBottom:"1rem" }}>
                <span style={{ fontSize:"1.3rem" }}>{classeInfo?.emoji}</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:"0.9rem" }}>{nome}</div>
                  <div style={{ fontSize:"0.72rem", color: classeInfo?.cor }}>{classeInfo?.nome} · {reinoInfo?.nome}</div>
                </div>
              </div>
              <p style={{ fontSize:"0.85rem", fontWeight:600, marginBottom:"0.7rem" }}>Escolha a arma inicial <span style={{ fontWeight:400, color:"var(--muted)", fontSize:"0.78rem" }}>(opcional)</span></p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:"0.5rem" }}>
                {armasFilt.map(a => {
                  const sel = armaId === a.id;
                  return (
                    <div key={a.id} onClick={async () => {
                      const novaArma = armaId === a.id ? "" : a.id;
                      setArmaId(novaArma);
                      if (novaArma) {
                        await swal({
                          html: `<div style="font-family:system-ui;text-align:center;padding:0.25rem 0"><div style="font-size:2.5rem;margin-bottom:0.4rem">${a.emoji}</div><div style="font-size:1.2rem;font-weight:900;color:#a78bfa;margin-bottom:0.2rem">${a.nome}</div><div style="color:rgba(148,163,184,0.6);font-size:0.8rem">Arma equipada!</div></div>`,
                          timer: 1800,
                          timerProgressBar: true,
                          showConfirmButton: true,
                          confirmButtonText: "Continuar →",
                          confirmButtonColor: "#7c3aed",
                          background: "#0f172a",
                          color: "#e2e8f0",
                        });
                      }
                      setDiagAberto(true);
                    }} style={{ padding:"0.6rem 0.75rem", borderRadius:"10px", cursor:"pointer", border:`1px solid ${sel ? "var(--primary)" : "var(--border)"}`, background: sel ? "rgba(124,58,237,0.1)" : "var(--bg2)", display:"flex", alignItems:"center", gap:"0.4rem", outline: sel ? "2px solid rgba(124,58,237,0.35)" : "none", outlineOffset:"2px" }}>
                      <span style={{ fontSize:"1.1rem" }}>{a.emoji}</span>
                      <span style={{ fontSize:"0.78rem", fontWeight:600 }}>{a.nome}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 4: Forjar / Review ── */}
          {step === 4 && (
            <div style={{ marginBottom:"1.25rem" }}>
              <div style={{ padding:"1.1rem", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border)", borderRadius:"12px", marginBottom:"0.9rem" }}>
                <div style={{ fontSize:"0.65rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.6rem" }}>Revisão do Herói</div>
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:armaId ? "0.5rem" : 0 }}>
                  <span style={{ fontSize:"1.8rem", filter:`drop-shadow(0 0 10px ${classeInfo?.cor ?? "#fff"})` }}>{classeInfo?.emoji}</span>
                  <div>
                    <div style={{ fontWeight:900, fontSize:"1rem" }}>{nome}</div>
                    <div style={{ fontSize:"0.78rem", color: classeInfo?.cor }}>{classeInfo?.nome}</div>
                    {reinoInfo && <div style={{ fontSize:"0.68rem", color:"var(--muted)" }}>{reinoInfo.emoji} {reinoInfo.nome} · {reinoInfo.bonus}</div>}
                  </div>
                </div>
                {armaId && (() => { const a = ARMAS.find(x => x.id === armaId); return a ? <div style={{ fontSize:"0.8rem", color:"var(--muted)" }}>{a.emoji} {a.nome}</div> : null; })()}
              </div>
              <p style={{ fontSize:"0.82rem", color:"var(--muted)" }}>Preencha os últimos campos do diagrama e depois forge o herói.</p>
            </div>
          )}

          {/* ── Diagram toggle ── */}
          <button
            onClick={() => setDiagAberto(p => !p)}
            className="btn"
            style={{ width:"100%", marginBottom:"0.75rem", justifyContent:"space-between", background: diagAberto ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)", border:`1px solid ${diagAberto ? "var(--primary)" : "rgba(255,255,255,0.1)"}`, color: diagAberto ? "var(--primary-light)" : "var(--muted)" }}
          >
            <span style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <span>📐</span>
              <span>Diagrama de Objeto + Classe</span>
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
              {stepCorretos > 0 && (
                <span style={{ background: stepCorretos === stepBlanks.length ? "rgba(34,197,94,0.2)" : "var(--primary)", color: stepCorretos === stepBlanks.length ? "#86efac" : "#fff", borderRadius:"99px", padding:"0.1rem 0.4rem", fontSize:"0.62rem", fontWeight:700 }}>
                  {stepCorretos}/{stepBlanks.length}
                </span>
              )}
              <span style={{ fontSize:"0.72rem" }}>{diagAberto ? "▲" : "▼"}</span>
            </span>
          </button>

          {diagAberto && (
            <div style={{ animation:"diagSlide 0.3s ease both", marginBottom:"1.25rem" }}>
              <DiagramaStep
                step={step}
                blanks={blanks}
                onChange={changeBlank}
                onCheck={checkBlank}
                dicaAberta={dicaAberta}
                onToggle={setDicaAberta}
                nome={nome}
                classe={classe}
                armaId={armaId}
                reinoId={reinoId}
                stepBlanks={stepBlanks}
                corretos={totalCorretos}
                total={BLANK_IDS.length}
              />
            </div>
          )}

          {/* ── Navigation ── */}
          <div style={{ display:"flex", gap:"0.65rem" }}>
            {step > 0 && (
              <button onClick={voltar} className="btn btn-ghost" style={{ flex:"0 0 auto", fontSize:"0.9rem" }}>← Voltar</button>
            )}
            {isLastStep ? (
              <button
                className="btn btn-gold"
                onClick={handleForjar}
                disabled={carregando || !classe || nome.trim().length < 2}
                style={{ flex:1, fontSize:"1rem", padding:"0.85rem" }}
              >
                {carregando ? "Forjando…" : "✦ Forjar Herói"}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={avancar}
                disabled={!canAdvance}
                style={{ flex:1, fontSize:"1rem", padding:"0.85rem" }}
              >
                Avançar →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
