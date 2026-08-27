"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const CLASSES_PREVIEW = [
  { classe: "guerreiro", emoji: "⚔️", nome: "Guerreiro", cor: "#ef4444", delay: "0s" },
  { classe: "mago", emoji: "🔮", nome: "Mago", cor: "#8b5cf6", delay: "0.3s" },
  { classe: "arqueiro", emoji: "🏹", nome: "Arqueiro", cor: "#10b981", delay: "0.6s" },
  { classe: "ladino", emoji: "🗡️", nome: "Ladino", cor: "#f59e0b", delay: "0.9s" },
  { classe: "paladino", emoji: "🛡️", nome: "Paladino", cor: "#3b82f6", delay: "1.2s" },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  useEffect(() => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    const symbols = ["✦", "✧", "⋆", "◆", "◇", "⬡", "⬢"];
    let interval: ReturnType<typeof setInterval>;

    function spawn() {
      const el = document.createElement("span");
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position:absolute; left:${Math.random() * 100}%; bottom:0;
        font-size:${0.6 + Math.random() * 0.8}rem;
        color:rgba(${Math.random() > 0.5 ? "139,92,246" : "219,39,119"},${0.3 + Math.random() * 0.4});
        animation: float-up ${3 + Math.random() * 4}s ease-out both;
        pointer-events:none;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 7000);
    }

    interval = setInterval(spawn, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background gradient orbs */}
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(124,58,237,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(219,39,119,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Particles */}
      <div
        ref={particlesRef}
        aria-hidden
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}
      />

      {/* Nav */}
      <nav className="nav" style={{ zIndex: 10, position: "relative" }}>
        <span className="nav-logo gold-text">⚔️ NEXUS</span>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/login" className="btn btn-ghost" style={{ fontSize: "0.85rem", padding: "0.5rem 1.1rem" }}>
            Entrar
          </Link>
          <Link href="/cadastro" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.1rem" }}>
            Criar Conta
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "6rem 1.5rem 4rem" }}>
        <h1
          className="title-display"
          style={{ marginBottom: "0.5rem", animation: "slide-in 0.5s 0.1s ease both" }}
        >
          NEXUS DOS
        </h1>
        <h1
          className="title-display"
          style={{ marginBottom: "1.5rem", animation: "slide-in 0.5s 0.15s ease both" }}
        >
          HERÓIS
        </h1>

        <p
          style={{
            maxWidth: "520px", color: "rgba(148,163,184,0.85)", fontSize: "1.05rem",
            lineHeight: 1.7, marginBottom: "3rem",
            animation: "slide-in 0.5s 0.25s ease both",
          }}
        >
          Crie seu herói lendário, escolha uma das cinco classes épicas,
          equipe armas e armaduras — e leve seus personagens para a batalha.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", animation: "slide-in 0.5s 0.35s ease both" }}>
          <Link href="/cadastro" className="btn btn-gold" style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}>
            ✦ Forjar meu Herói
          </Link>
          <Link href="/login" className="btn btn-ghost" style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}>
            Já tenho conta →
          </Link>
        </div>

        {/* 3D Class Cards Preview */}
        <div
          style={{
            display: "flex", gap: "1rem", marginTop: "5rem", flexWrap: "wrap",
            justifyContent: "center", animation: "slide-in 0.6s 0.5s ease both",
          }}
        >
          {CLASSES_PREVIEW.map(({ classe, emoji, nome, cor, delay }) => (
            <div
              key={classe}
              className="card-3d-wrapper"
              style={{ animationDelay: delay }}
            >
              <div
                className="card card-3d"
                style={{
                  width: "120px", textAlign: "center", padding: "1.25rem 1rem",
                  borderColor: `${cor}30`, cursor: "default",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem", filter: `drop-shadow(0 0 10px ${cor})` }}>
                  {emoji}
                </div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: cor }}>
                  {nome}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
