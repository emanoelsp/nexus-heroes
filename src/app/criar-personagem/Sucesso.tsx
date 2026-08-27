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
  const varReino = reinoId || "midgard";

  const allDone = Object.keys(CFG).every(id => blanks[id]?.status === "ok");

  // ── Attribute rows ────────────────────────────────────────────────────────
  const ATTRS: { bid: string; line: string }[] = [
    { bid:"pav-reino",     line:` reinoId : String` },
    { bid:"av-nome",       line:` nome : String` },
    { bid:"av-classe",     line:` classe : String` },
    { bid:"av-nivel",      line:` nivel : ${ans("at-nivel", blanks)}` },
    { bid:"",              line:`- xp : int` },
    { bid:"av-arma",       line:` arma : String` },
    { bid:"",              line:`- armadura : String` },
    { bid:"av-anel",       line:` anel : ${ans("at-anel", blanks)}` },
  ];

  const METHODS: { bid: string; line: string }[] = [
    { bid:"mv-ctor",        line:` Personagem(nome : String, classe : String, reinoId : String)` },
    { bid:"mv-getNome",     line:` getNome() : ${ans("mr-getNome", blanks)}` },
    { bid:"",               line:`+ getNivel() : int` },
    { bid:"",               line:`+ getXp() : int` },
    { bid:"mv-equArma",     line:` equiparArma(arma : ${ans("mp-equArma", blanks)}) : void` },
    { bid:"mv-equArmadura", line:` equiparArmadura(armadura : String) : ${ans("mr-equArmadura", blanks)}` },
    { bid:"",               line:`+ getClasse() : String` },
  ];

  const armaLine = armaNome !== "null" ? `\n${varNome}.equiparArma("${armaNome}");` : "";
  const atribJava = reino ? `\n// Atributo especial de ${reino.nome}: ${reino.atributo} = ${reino.valorBonus}` : "";

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

        {/* ── Object diagrams (side by side) ── */}
        <div style={{ animation:"fadeUp 0.5s 0.1s ease both", opacity:0, animationFillMode:"forwards", marginBottom:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.75rem" }}>
            <span>📦</span>
            <h2 style={{ fontSize:"0.95rem", fontWeight:800 }}>Diagramas de Objeto</h2>
            <span style={{ fontSize:"0.7rem", color:"var(--muted)" }}>— instâncias criadas</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.65rem" }}>
            {/* Personagem object */}
            <div style={{ fontFamily:"monospace", fontSize:"0.75rem", background:"rgba(59,130,246,0.05)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:"12px", overflow:"hidden" }}>
              <div style={{ background:"rgba(59,130,246,0.12)", borderBottom:"1px solid rgba(59,130,246,0.2)", padding:"0.4rem 0.85rem", fontWeight:800, color:"#93c5fd" }}>
                {varNome} : <span style={{ color:"#60a5fa" }}>Personagem</span>
              </div>
              {[
                { k:"reinoId",  v:`"${varReino}"`, c:"#93c5fd" },
                { k:"nome",     v:`"${nome}"`,     c:"#93c5fd" },
                { k:"classe",   v:info.nome,        c:"#93c5fd" },
                { k:"nivel",    v:"1",              c:"rgba(148,163,184,0.5)" },
                { k:"xp",       v:"0",              c:"rgba(148,163,184,0.5)" },
                { k:"arma",     v: armaId ? `"${armaNome}"` : "null", c: armaId ? "#93c5fd" : "rgba(148,163,184,0.3)" },
                { k:"armadura", v:"null",           c:"rgba(148,163,184,0.3)" },
                { k:"anel",     v:"null",           c:"rgba(148,163,184,0.3)" },
              ].map(r => (
                <div key={r.k} style={{ padding:"0.22rem 0.85rem", display:"flex", gap:"0.35rem", borderBottom:"1px solid rgba(255,255,255,0.02)" }}>
                  <span style={{ color:"rgba(148,163,184,0.4)", minWidth:"60px" }}>{r.k}</span>
                  <span style={{ color:"rgba(148,163,184,0.25)" }}>=</span>
                  <span style={{ color:r.c }}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* Reino object */}
            {reino ? (
              <div style={{ fontFamily:"monospace", fontSize:"0.75rem", background:`${reino.cor}08`, border:`1px solid ${reino.cor}25`, borderRadius:"12px", overflow:"hidden" }}>
                <div style={{ background:`${reino.cor}12`, borderBottom:`1px solid ${reino.cor}20`, padding:"0.4rem 0.85rem", fontWeight:800, color:reino.cor }}>
                  {varReino} : <span style={{ color:`${reino.cor}bb` }}>Reino</span>
                </div>
                {[
                  { k:"nome",       v:`"${reino.nome}"`,  c:"#93c5fd" },
                  { k:"bonus",      v:`"${reino.bonus}"`, c:"#93c5fd" },
                  { k:"valorBonus", v:String(reino.valorBonus), c:"#93c5fd", note:`${reino.atributo}` },
                ].map(r => (
                  <div key={r.k} style={{ padding:"0.22rem 0.85rem", display:"flex", gap:"0.35rem", alignItems:"baseline", borderBottom:"1px solid rgba(255,255,255,0.02)" }}>
                    <span style={{ color:`${reino.cor}60`, minWidth:"75px" }}>{r.k}</span>
                    <span style={{ color:"rgba(148,163,184,0.25)" }}>=</span>
                    <span style={{ color:"#93c5fd" }}>{r.v}</span>
                    {"note" in r && r.note && <span style={{ fontSize:"0.58rem", color:`${reino.cor}55`, fontStyle:"italic", marginLeft:"0.35rem" }}>{r.note}</span>}
                  </div>
                ))}
                <div style={{ padding:"0.4rem 0.85rem", fontSize:"0.62rem", color:`${reino.cor}55`, fontStyle:"italic" }}>
                  {`// referenciado por: ${varNome}.reinoId`}
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", border:"1px dashed rgba(255,255,255,0.08)", borderRadius:"12px", color:"var(--muted)", fontSize:"0.78rem" }}>
                Sem reino associado
              </div>
            )}
          </div>
        </div>

        {/* ── Class diagram ── */}
        <div style={{ animation:"fadeUp 0.5s 0.2s ease both", opacity:0, animationFillMode:"forwards", marginBottom:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.75rem" }}>
            <span>📐</span>
            <h2 style={{ fontSize:"0.95rem", fontWeight:800 }}>Diagrama de Classe</h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 0.75fr", gap:"0.65rem" }}>
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
            </div>

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
              {/* Association label */}
              <div style={{ padding:"0.3rem 0.85rem", borderTop:"1px solid var(--border)", fontSize:"0.6rem", color:"rgba(148,163,184,0.35)", fontStyle:"italic" }}>
                Personagem ——uses——› Reino
              </div>
            </div>
          </div>
        </div>

        {/* ── Java Exercise ── */}
        <div style={{ animation:"fadeUp 0.5s 0.3s ease both", opacity:0, animationFillMode:"forwards", background:"rgba(15,23,42,0.7)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"16px", overflow:"hidden" }}>
          <div style={{ padding:"1rem 1.5rem", borderBottom:"1px solid rgba(124,58,237,0.2)", display:"flex", alignItems:"center", gap:"0.6rem" }}>
            <span style={{ fontSize:"1.5rem" }}>☕</span>
            <div>
              <h2 style={{ fontSize:"1rem", fontWeight:900 }}>Agora é com você — implemente no Java!</h2>
              <p style={{ fontSize:"0.76rem", color:"var(--muted)", marginTop:"0.1rem" }}>
                Você analisou duas classes: <strong style={{ color:"var(--primary-light)" }}>Personagem</strong> e <strong style={{ color:"#fbbf24" }}>Reino</strong>. Implemente as duas.
              </p>
            </div>
          </div>

          <div style={{ padding:"1.1rem 1.5rem" }}>
            {/* Reino class */}
            <p style={{ fontSize:"0.75rem", fontWeight:700, color:"#fbbf24", marginBottom:"0.4rem" }}>1. Classe Reino</p>
            <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"10px", padding:"0.85rem 1.1rem", fontFamily:"'Courier New',monospace", fontSize:"0.75rem", lineHeight:1.75, border:"1px solid rgba(255,255,255,0.05)", marginBottom:"1rem", overflowX:"auto" }}>
              <pre style={{ margin:0, color:"#e2e8f0", whiteSpace:"pre" }}>{`public class Reino {
    private String nome;
    private String bonus;
    private int valorBonus;

    public Reino(String nome, String bonus, int valorBonus) {
        this.nome = nome;
        this.bonus = bonus;
        this.valorBonus = valorBonus;
    }

    public String getNome()    { return nome;       }
    public String getBonus()   { return bonus;      }
    public int getValorBonus() { return valorBonus; }
}`}</pre>
            </div>

            {/* Personagem class */}
            <p style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--primary-light)", marginBottom:"0.4rem" }}>2. Classe Personagem</p>
            <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"10px", padding:"0.85rem 1.1rem", fontFamily:"'Courier New',monospace", fontSize:"0.75rem", lineHeight:1.75, border:"1px solid rgba(255,255,255,0.05)", marginBottom:"1rem", overflowX:"auto" }}>
              <pre style={{ margin:0, color:"#e2e8f0", whiteSpace:"pre" }}>{`public class Personagem {
    private Reino reino;  // associação com Reino
    private String nome;
    private String classe;
    private int nivel;
    private int xp;
    private String arma;
    private String armadura;
    private String anel;

    public Personagem(String nome, String classe, Reino reino) {
        this.nome   = nome;
        this.classe = classe;
        this.reino  = reino;
        this.nivel  = 1;
        this.xp     = 0;
    }

    public String getNome()  { return nome;  }
    public int    getNivel() { return nivel; }
    public int    getXp()    { return xp;    }
    public String getClasse(){ return classe;}
    public Reino  getReino() { return reino; }

    public void equiparArma(String arma)         { this.arma     = arma;     }
    public void equiparArmadura(String armadura) { this.armadura = armadura; }
}`}</pre>
            </div>

            {/* Instantiation */}
            <p style={{ fontSize:"0.75rem", fontWeight:700, color:"#22c55e", marginBottom:"0.4rem" }}>3. Instancie o mesmo herói aqui criado</p>
            <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"10px", padding:"0.85rem 1.1rem", fontFamily:"'Courier New',monospace", fontSize:"0.75rem", lineHeight:1.9, border:"1px solid rgba(255,255,255,0.05)", overflowX:"auto" }}>
              <pre style={{ margin:0, color:"#e2e8f0", whiteSpace:"pre" }}>{`Reino ${varReino} = new Reino("${reino?.nome ?? varReino}", "${reino?.bonus ?? ""}", ${reino?.valorBonus ?? 0});${atribJava}

Personagem ${varNome} = new Personagem("${nome}", "${classe.toUpperCase()}", ${varReino});${armaLine}

System.out.println(${varNome}.getNome());           // ${nome}
System.out.println(${varNome}.getClasse());         // ${classe.toUpperCase()}
System.out.println(${varNome}.getReino().getNome());// ${reino?.nome ?? varReino}
System.out.println(${varNome}.getReino().getBonus());// ${reino?.bonus ?? ""}`}</pre>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ display:"flex", gap:"0.75rem", justifyContent:"center", flexWrap:"wrap", marginTop:"2rem", animation:"fadeUp 0.5s 0.45s ease both", opacity:0, animationFillMode:"forwards" }}>
          <Link href="/dashboard" className="btn btn-primary">Ver meus heróis</Link>
          <Link href="/criar-personagem" className="btn btn-ghost">Criar outro herói</Link>
        </div>
      </main>
    </div>
  );
}
