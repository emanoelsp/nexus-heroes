"use client";

import { useState } from "react";

interface Props {
  numero: number;
  titulo: string;
  oQueAcontece: string;
  porQue: string;
  dica: string;
}

export default function BugBanner({ numero, titulo, oQueAcontece, porQue, dica }: Props) {
  const [aberto, setAberto] = useState(true);

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "8px",
          color: "#f87171",
          fontSize: "0.78rem",
          fontFamily: "monospace",
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
        🐛 BUG #{numero} — {titulo} (clique para ver)
      </button>
    );
  }

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(239,68,68,0.3)",
        background: "rgba(239,68,68,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.25rem",
          background: "rgba(239,68,68,0.12)",
          borderBottom: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.1rem" }}>🐛</span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#f87171",
              fontWeight: 700,
            }}
          >
            BUG #{numero} DETECTADO
          </span>
          <span
            style={{
              padding: "0.15rem 0.5rem",
              borderRadius: "4px",
              background: "rgba(239,68,68,0.2)",
              color: "#fca5a5",
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            {titulo}
          </span>
        </div>
        <button
          onClick={() => setAberto(false)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(248,113,113,0.5)",
            cursor: "pointer",
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.68rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#f87171",
              marginBottom: "0.3rem",
            }}
          >
            🔴 O que está acontecendo
          </p>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
            {oQueAcontece}
          </p>
        </div>

        <div>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.68rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#fb923c",
              marginBottom: "0.3rem",
            }}
          >
            🔍 Por quê isso acontece
          </p>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
            {porQue}
          </p>
        </div>

        <div
          style={{
            padding: "0.6rem 0.9rem",
            borderRadius: "8px",
            background: "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.2)",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.68rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#fb923c",
              marginBottom: "0.25rem",
            }}
          >
            💡 Dica para corrigir
          </p>
          <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>
            {dica}
          </p>
        </div>
      </div>
    </div>
  );
}
