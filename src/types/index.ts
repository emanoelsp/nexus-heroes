export type Classe = "guerreiro" | "mago" | "arqueiro" | "ladino" | "paladino";
export type ReinoId = "midgard" | "valhara" | "umbrath" | "aethoria" | "solaris";

export interface Personagem {
  id: string;
  nome: string;
  classe: Classe;
  nivel: number;
  userId: string;
  criadoEm: string;
  reinoId?: string;
  arma?: string;
  armadura?: string;
  anel?: string;
  xp: number;
}

export interface ReInfo {
  nome: string;
  emoji: string;
  cor: string;
  corFundo: string;
  corBorda: string;
  desc: string;
  bonus: string;        // "+2 Defesa"
  valorBonus: number;   // numeric (int in Java)
  atributo: string;     // lore name: resistencia, gloria, etc.
}

export const REINOS: Record<string, ReInfo> = {
  midgard: {
    nome: "Midgard",
    emoji: "🌍",
    cor: "#a16207",
    corFundo: "rgba(161,98,7,0.1)",
    corBorda: "rgba(161,98,7,0.3)",
    desc: "O reino dos mortais. Garra e perseverança definem os seus filhos.",
    bonus: "+2 Defesa",
    valorBonus: 2,
    atributo: "resistencia",
  },
  valhara: {
    nome: "Valhara",
    emoji: "⚡",
    cor: "#ca8a04",
    corFundo: "rgba(202,138,4,0.1)",
    corBorda: "rgba(202,138,4,0.3)",
    desc: "Guerreiros imortais batalham em glória eterna após a morte.",
    bonus: "+3 Ataque",
    valorBonus: 3,
    atributo: "gloria",
  },
  umbrath: {
    nome: "Umbrath",
    emoji: "🌑",
    cor: "#7c3aed",
    corFundo: "rgba(124,58,237,0.1)",
    corBorda: "rgba(124,58,237,0.3)",
    desc: "O reino das sombras eternas. Lar de assassinos e espíritos furtivos.",
    bonus: "+3 Velocidade",
    valorBonus: 3,
    atributo: "furtividade",
  },
  aethoria: {
    nome: "Aethoria",
    emoji: "✨",
    cor: "#0ea5e9",
    corFundo: "rgba(14,165,233,0.1)",
    corBorda: "rgba(14,165,233,0.3)",
    desc: "Os segredos da magia fluem livres neste plano etéreo e luminoso.",
    bonus: "+3 Magia",
    valorBonus: 3,
    atributo: "energiaMagica",
  },
  solaris: {
    nome: "Solaris",
    emoji: "☀️",
    cor: "#f97316",
    corFundo: "rgba(249,115,22,0.1)",
    corBorda: "rgba(249,115,22,0.3)",
    desc: "Governado pela luz e ordem divina. Reino sagrado dos paladinos.",
    bonus: "+2 Magia, +1 Def",
    valorBonus: 3,
    atributo: "fe",
  },
} as const;

export const CLASSES = {
  guerreiro: {
    nome: "Guerreiro",
    emoji: "⚔️",
    cor: "#ef4444",
    corFundo: "rgba(239,68,68,0.1)",
    corBorda: "rgba(239,68,68,0.3)",
    desc: "Mestre do combate corpo a corpo. Resistente e devastador na linha de frente.",
    atk: 9, def: 8, mgc: 2, spd: 5,
  },
  mago: {
    nome: "Mago",
    emoji: "🔮",
    cor: "#8b5cf6",
    corFundo: "rgba(139,92,246,0.1)",
    corBorda: "rgba(139,92,246,0.3)",
    desc: "Manipula os elementos com maestria arcana. Fraco fisicamente, devastador à distância.",
    atk: 3, def: 3, mgc: 10, spd: 6,
  },
  arqueiro: {
    nome: "Arqueiro",
    emoji: "🏹",
    cor: "#10b981",
    corFundo: "rgba(16,185,129,0.1)",
    corBorda: "rgba(16,185,129,0.3)",
    desc: "Precisão cirúrgica a longas distâncias. Rápido e mortal antes que o inimigo se aproxime.",
    atk: 8, def: 4, mgc: 3, spd: 9,
  },
  ladino: {
    nome: "Ladino",
    emoji: "🗡️",
    cor: "#f59e0b",
    corFundo: "rgba(245,158,11,0.1)",
    corBorda: "rgba(245,158,11,0.3)",
    desc: "Golpes furtivos e críticos letais. Especialista em eliminar alvos antes de serem detectados.",
    atk: 9, def: 3, mgc: 4, spd: 10,
  },
  paladino: {
    nome: "Paladino",
    emoji: "🛡️",
    cor: "#3b82f6",
    corFundo: "rgba(59,130,246,0.1)",
    corBorda: "rgba(59,130,246,0.3)",
    desc: "Protetor sagrado com poder divino. Equilibra combate e cura para sustentar aliados.",
    atk: 7, def: 10, mgc: 7, spd: 4,
  },
} as const;

export const ARMAS = [
  { id: "espada-longa", nome: "Espada Longa", emoji: "⚔️", clases: ["guerreiro", "paladino"] },
  { id: "cajado-arcano", nome: "Cajado Arcano", emoji: "🪄", clases: ["mago"] },
  { id: "arco-élfico", nome: "Arco Élfico", emoji: "🏹", clases: ["arqueiro"] },
  { id: "adagas-gêmeas", nome: "Adagas Gêmeas", emoji: "🗡️", clases: ["ladino"] },
  { id: "lança-sagrada", nome: "Lança Sagrada", emoji: "🔱", clases: ["paladino", "guerreiro"] },
  { id: "tomo-maldito", nome: "Tomo Maldito", emoji: "📖", clases: ["mago", "ladino"] },
];

export const ARMADURAS = [
  { id: "armadura-placas", nome: "Armadura de Placas", emoji: "🛡️", clases: ["guerreiro", "paladino"] },
  { id: "veste-arcana", nome: "Veste Arcana", emoji: "🥋", clases: ["mago", "ladino"] },
  { id: "couro-reforçado", nome: "Couro Reforçado", emoji: "🧥", clases: ["arqueiro", "ladino"] },
  { id: "manto-sagrado", nome: "Manto Sagrado", emoji: "👘", clases: ["paladino", "mago"] },
  { id: "malha-de-elos", nome: "Malha de Elos", emoji: "⛓️", clases: ["guerreiro", "arqueiro"] },
];

export const ANEIS = [
  { id: "anel-poder", nome: "Anel do Poder", emoji: "💍" },
  { id: "anel-proteção", nome: "Anel de Proteção", emoji: "🔮" },
  { id: "anel-velocidade", nome: "Anel da Velocidade", emoji: "⚡" },
  { id: "anel-cura", nome: "Anel da Cura", emoji: "💚" },
];
