import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ fontSize: "4rem" }}>⚔️</div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Herói não encontrado</h1>
      <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "0.9rem" }}>
        Este personagem não existe ou foi deletado.
      </p>
      <Link href="/dashboard" className="btn btn-primary">
        ← Voltar ao Dashboard
      </Link>
    </div>
  );
}
