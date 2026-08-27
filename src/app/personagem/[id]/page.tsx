"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
const swal = async (opts: object) => {
  const { default: Swal } = await import("sweetalert2");
  return (swal as (opts: object) => Promise<unknown>)(opts);
};
import { useAuth } from "@/contexts/AuthContext";
import { buscarPersonagem, equiparItem } from "@/services/personagens";
import { CLASSES, REINOS, ARMAS, ARMADURAS, ANEIS, type Personagem } from "@/types";

// ── Object Diagram — shows the current state of the hero as a UML object ──────
function ObjectDiagram({ p }: { p: Personagem }) {
  const info   = CLASSES[p.classe];
  const reino  = p.reinoId ? REINOS[p.reinoId] : null;
  const varNome = p.nome.replace(/[^a-zA-Z]/g, "").toLowerCase().slice(0, 12) || "heroi";

  const rows: { k: string; v: string; highlight?: boolean }[] = [
    { k: "reinoId",  v: p.reinoId  ? `"${p.reinoId}"` : "null",   highlight: !!p.reinoId },
    { k: "classeId", v: `"${p.classe}"`,                            highlight: true },
    { k: "nome",     v: `"${p.nome}"`,                              highlight: true },
    { k: "nivel",    v: String(p.nivel) },
    { k: "xp",       v: String(p.xp) },
    { k: "arma",     v: p.arma     ? `"${p.arma}"` : "null",       highlight: !!p.arma },
    { k: "armadura", v: p.armadura ? `"${p.armadura}"` : "null",   highlight: !!p.armadura },
    { k: "anel",     v: p.anel     ? `"${p.anel}"` : "null",       highlight: !!p.anel },
  ];

  return (
    <div style={{ fontFamily:"monospace", fontSize:"0.78rem", background:"rgba(59,130,246,0.05)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:"14px", overflow:"hidden" }}>
      <div style={{ background:"rgba(59,130,246,0.14)", borderBottom:"1px solid rgba(59,130,246,0.2)", padding:"0.55rem 1rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
        <span style={{ fontSize:"0.58rem", color:"rgba(148,163,184,0.45)", textTransform:"uppercase" }}>objeto</span>
        <span style={{ fontWeight:800, color:"#93c5fd" }}>{varNome}</span>
        <span style={{ color:"rgba(148,163,184,0.4)" }}>: <span style={{ color:"#60a5fa" }}>Personagem</span></span>
      </div>
      {rows.map(r => (
        <div key={r.k} style={{ padding:"0.25rem 1rem", display:"flex", gap:"0.5rem", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.025)", background: r.highlight ? "rgba(59,130,246,0.04)" : "transparent" }}>
          <span style={{ color: r.highlight ? "rgba(147,197,253,0.65)" : "rgba(148,163,184,0.35)", minWidth:"68px" }}>{r.k}</span>
          <span style={{ color:"rgba(148,163,184,0.2)" }}>=</span>
          <span style={{ color: r.highlight ? "#93c5fd" : r.v === "null" ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.45)" }}>
            {r.v}
          </span>
          {r.highlight && r.v !== "null" && (
            <span style={{ marginLeft:"auto", fontSize:"0.55rem", color:"#60a5fa" }}>✓</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Item button ───────────────────────────────────────────────────────────────
function ItemBtn({ label, emoji, selected, equipando, onClick }: {
  label: string; emoji: string; selected: boolean; equipando: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={equipando || selected}
      style={{
        display:"flex", alignItems:"center", gap:"0.55rem",
        padding:"0.6rem 0.85rem", borderRadius:"10px", cursor: selected ? "default" : "pointer",
        border:`1px solid ${selected ? "var(--primary)" : "rgba(255,255,255,0.09)"}`,
        background: selected ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.02)",
        width:"100%", textAlign:"left", transition:"all 0.2s",
        outline: selected ? "2px solid rgba(124,58,237,0.3)" : "none", outlineOffset:"2px",
        opacity: equipando ? 0.5 : 1,
      }}
    >
      <span style={{ fontSize:"1.1rem" }}>{emoji}</span>
      <span style={{ fontSize:"0.8rem", fontWeight: selected ? 700 : 400, color: selected ? "var(--primary-light)" : "var(--text)" }}>{label}</span>
      {selected && <span style={{ marginLeft:"auto", color:"var(--primary-light)", fontSize:"0.65rem" }}>equipado ✓</span>}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PersonagemPage() {
  const { id }          = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router          = useRouter();
  const [p, setP]       = useState<Personagem | null>(null);
  const [busy, setBusy] = useState(true);
  const [equipando, setEquipando] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!id) return;
    buscarPersonagem(id)
      .then(hero => { if (!hero) router.push("/dashboard"); else setP(hero); })
      .finally(() => setBusy(false));
  }, [id, router]);

  async function equip(slot: "arma" | "armadura" | "anel", itemId: string, itemNome: string) {
    if (!p) return;
    setBusy(false);
    setEquipando(itemId);
    try {
      await equiparItem(p.id, slot, itemId);
      setP(prev => prev ? { ...prev, [slot]: itemId } : prev);
      await swal({
        html: `<div style="font-family:system-ui;text-align:center"><div style="font-size:2rem;margin-bottom:0.3rem">${{ arma:"⚔️", armadura:"🛡️", anel:"💍" }[slot]}</div><div style="font-size:1rem;font-weight:700;color:#a78bfa">${itemNome}</div><div style="color:rgba(148,163,184,0.5);font-size:0.8rem;margin-top:0.2rem">${{ arma:"Arma equipada!", armadura:"Armadura equipada!", anel:"Anel equipado!" }[slot]}</div></div>`,
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#e2e8f0",
      });
    } catch {
      await swal({ icon:"error", title:"Erro ao equipar", background:"#0f172a", color:"#e2e8f0", confirmButtonColor:"#7c3aed" });
    } finally {
      setEquipando(null);
    }
  }

  if (busy || !p) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:"2.5rem", animation:"spin-slow 2s linear infinite" }}>🔮</div>
      </div>
    );
  }

  const info    = CLASSES[p.classe] ?? CLASSES.guerreiro;
  const reino   = p.reinoId ? REINOS[p.reinoId] : null;
  const armas   = ARMAS.filter(a => a.clases.includes(p.classe));
  const armads  = ARMADURAS.filter(a => a.clases.includes(p.classe));

  return (
    <div style={{ minHeight:"100vh" }}>
      <style>{`@keyframes heroGlow{0%,100%{box-shadow:0 0 28px ${info.cor}30}50%{box-shadow:0 0 50px ${info.cor}55,0 0 80px ${info.cor}20}}`}</style>

      <nav className="nav">
        <Link href="/dashboard" className="nav-logo gold-text">⚔️ NEXUS</Link>
        <Link href="/dashboard" className="btn btn-ghost" style={{ fontSize:"0.82rem" }}>← Meus Heróis</Link>
      </nav>

      <main className="container" style={{ paddingTop:"2rem", paddingBottom:"5rem", maxWidth:"760px" }}>

        {/* ── Hero header ── */}
        <div style={{ display:"flex", gap:"1.5rem", alignItems:"flex-start", marginBottom:"2rem", flexWrap:"wrap" }}>
          <div className="card-3d-wrapper" style={{ flexShrink:0 }}>
            <div className="card card-3d" style={{ width:"130px", textAlign:"center", padding:"1.5rem 1rem", borderColor:`${info.cor}45`, background:info.corFundo, animation:"heroGlow 3s ease-in-out infinite" }}>
              <div style={{ fontSize:"2.75rem", filter:`drop-shadow(0 0 16px ${info.cor})`, marginBottom:"0.4rem" }}>{info.emoji}</div>
              <div style={{ fontWeight:800, color:info.cor, fontSize:"0.78rem" }}>{info.nome}</div>
              <div style={{ fontSize:"0.65rem", color:"var(--muted)", marginTop:"0.15rem" }}>Nv. {p.nivel}</div>
            </div>
          </div>

          <div style={{ flex:1, minWidth:"200px" }}>
            <h1 style={{ fontSize:"clamp(1.4rem,4vw,2rem)", fontWeight:900, marginBottom:"0.25rem" }}>{p.nome}</h1>
            <span className={`badge-classe classe-${p.classe}`}>{info.emoji} {info.nome}</span>

            {reino && (
              <div style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", marginLeft:"0.5rem", padding:"0.15rem 0.55rem", borderRadius:"99px", background:`${reino.cor}15`, border:`1px solid ${reino.cor}30`, fontSize:"0.72rem", color:reino.cor }}>
                {reino.emoji} {reino.nome} · {reino.bonus}
              </div>
            )}

            <p style={{ color:"var(--muted)", fontSize:"0.82rem", marginTop:"0.65rem", lineHeight:1.6, maxWidth:"380px" }}>{info.desc}</p>

            <div style={{ display:"flex", gap:"0.4rem", marginTop:"0.85rem", flexWrap:"wrap" }}>
              {(["atk","def","mgc","spd"] as const).map(stat => (
                <div key={stat} style={{ display:"flex", alignItems:"center", gap:"0.35rem", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"8px", padding:"0.25rem 0.6rem" }}>
                  <span style={{ fontFamily:"monospace", fontSize:"0.6rem", textTransform:"uppercase", color:"var(--muted)" }}>{stat}</span>
                  <div style={{ width:"40px", height:"3px", background:"rgba(255,255,255,0.08)", borderRadius:"99px", overflow:"hidden" }}>
                    <div style={{ width:`${info[stat] * 10}%`, height:"100%", background:info.cor, borderRadius:"99px" }} />
                  </div>
                  <span style={{ fontFamily:"monospace", fontSize:"0.65rem", color:info.cor, fontWeight:700 }}>{info[stat]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"1.5rem" }}>

          {/* Left: Object Diagram */}
          <div>
            <div style={{ fontSize:"0.65rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.5rem" }}>
              📦 Diagrama de Objeto — estado atual
            </div>
            <ObjectDiagram p={p} />
            <div style={{ marginTop:"0.6rem", fontSize:"0.65rem", color:"rgba(148,163,184,0.25)", fontStyle:"italic" }}>
              Valores atualizam ao equipar itens
            </div>
          </div>

          {/* Right: Equipment */}
          <div>
            {/* Current slots */}
            <div style={{ fontSize:"0.65rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.5rem" }}>
              🗃️ Slots de equipamento
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.5rem", marginBottom:"1.25rem" }}>
              {(["arma","armadura","anel"] as const).map(slot => {
                const icons = { arma:"⚔️", armadura:"🛡️", anel:"💍" };
                const val   = p[slot];
                return (
                  <div key={slot} style={{ textAlign:"center", padding:"0.7rem 0.4rem", borderRadius:"10px", border:`1px solid ${val ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.06)"}`, background: val ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.02)" }}>
                    <div style={{ fontSize:"1.4rem", marginBottom:"0.2rem" }}>{icons[slot]}</div>
                    <div style={{ fontSize:"0.58rem", fontWeight:700, textTransform:"uppercase", color: val ? "var(--primary-light)" : "rgba(255,255,255,0.25)", marginBottom:"0.15rem" }}>{slot}</div>
                    <div style={{ fontSize:"0.58rem", color:"var(--muted)", lineHeight:1.3 }}>{val ?? "vazio"}</div>
                  </div>
                );
              })}
            </div>

            {/* Weapons */}
            <div style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--muted)", marginBottom:"0.4rem" }}>⚔️ Armas disponíveis</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem", marginBottom:"1rem" }}>
              {armas.map(a => (
                <ItemBtn key={a.id} label={a.nome} emoji={a.emoji} selected={p.arma === a.id} equipando={equipando === a.id} onClick={() => equip("arma", a.id, a.nome)} />
              ))}
            </div>

            {/* Armors */}
            <div style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--muted)", marginBottom:"0.4rem" }}>🛡️ Armaduras disponíveis</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem", marginBottom:"1rem" }}>
              {armads.map(a => (
                <ItemBtn key={a.id} label={a.nome} emoji={a.emoji} selected={p.armadura === a.id} equipando={equipando === a.id} onClick={() => equip("armadura", a.id, a.nome)} />
              ))}
            </div>

            {/* Rings */}
            <div style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--muted)", marginBottom:"0.4rem" }}>💍 Anéis</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
              {ANEIS.map(a => (
                <ItemBtn key={a.id} label={a.nome} emoji={a.emoji} selected={p.anel === a.id} equipando={equipando === a.id} onClick={() => equip("anel", a.id, a.nome)} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
