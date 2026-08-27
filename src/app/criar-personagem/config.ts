export interface BlankCfg { ans: string; dica: string; ex: string; w: string }
export type BS = { val: string; status: "idle" | "ok" | "err" };

export const CFG: Record<string, BlankCfg> = {
  // ── Reino class blanks (prefix rk-) ──────────────────────────────────────
  "rk-av-nome":    { ans:"-",      w:"36px", ex:"+ ou -",                      dica:"🏰 O nome do reino é imutável e interno. Nenhum código externo deve alterá-lo diretamente." },
  "rk-av-valor":   { ans:"-",      w:"36px", ex:"+ ou -",                      dica:"⚔️ O valor do bônus é calculado internamente pelo reino — acesse via getter, não diretamente." },
  "rk-at-valor":   { ans:"int",    w:"58px", ex:"int, double, String, boolean", dica:"⚔️ +2 defesa, +3 ataque... Bônus são números inteiros. Que tipo Java não tem casas decimais?" },
  "rk-mv-getNome": { ans:"+",      w:"36px", ex:"+ ou -",                      dica:"👁️ O Personagem precisa saber o nome do seu reino. O getter deve ser visível de fora da classe." },
  "rk-mr-getNome": { ans:"String", w:"58px", ex:"int, double, String, void",   dica:"👁️ getNome() retorna texto — 'Midgard', 'Valhara'... Que tipo Java representa texto?" },

  // ── Personagem-Reino association blank ────────────────────────────────────
  "pav-reino":     { ans:"-",      w:"36px", ex:"+ ou -",                      dica:"🔗 O objeto Reino é parte do estado interno do Personagem — protegido como os outros atributos." },

  // ── Personagem attribute blanks ───────────────────────────────────────────
  "av-nome":        { ans:"-",      w:"36px", ex:"+ ou -",                      dica:"🔮 Heróis protegem seus segredos. Nenhum código externo toca diretamente neste campo — só via método." },
  "av-classe":      { ans:"-",      w:"36px", ex:"+ ou -",                      dica:"🔮 A classe guerreiro/mago é estado interno. Mesma lógica do nome — consulte via getter." },
  "av-nivel":       { ans:"-",      w:"36px", ex:"+ ou -",                      dica:"⚔️ O nível não pode ser forçado de fora — só o sistema de XP evolui o herói." },
  "at-nivel":       { ans:"int",    w:"58px", ex:"int, double, String, boolean", dica:"⚔️ Nível 5, nível 99, nunca 5.3. Que tipo Java não tem casas decimais?" },
  "av-arma":        { ans:"-",      w:"36px", ex:"+ ou -",                      dica:"🗡️ A espada fica na bainha. Ninguém encosta sem chamar equiparArma()." },
  "av-anel":        { ans:"-",      w:"36px", ex:"+ ou -",                      dica:"💍 O anel do poder não se entrega a qualquer um." },
  "at-anel":        { ans:"String", w:"58px", ex:"int, double, String, boolean", dica:"💍 'Anel do Poder', 'Anel da Cura'... É um nome em texto. Que tipo Java guarda texto?" },

  // ── Personagem method blanks ──────────────────────────────────────────────
  "mv-ctor":        { ans:"+",      w:"36px", ex:"+ ou -",                      dica:"⚗️ O código que escreve new Personagem() está fora desta classe — precisa enxergar o construtor." },
  "mv-getNome":     { ans:"+",      w:"36px", ex:"+ ou -",                      dica:"👁️ Um getter abre uma janela controlada para o que está escondido. Deve ser visível de fora." },
  "mr-getNome":     { ans:"String", w:"58px", ex:"int, double, String, void",   dica:"👁️ getNome() entrega o conteúdo do atributo nome. Qual é o tipo de nome?" },
  "mv-equArma":     { ans:"+",      w:"36px", ex:"+ ou -",                      dica:"🔧 O ferreiro (código externo) equipa o herói. Se fosse privado, ninguém poderia chamar." },
  "mp-equArma":     { ans:"String", w:"58px", ex:"int, double, String, boolean", dica:"🔧 O método recebe o nome da arma. 'Espada Longa'... Que tipo é isso?" },
  "mv-equArmadura": { ans:"+",      w:"36px", ex:"+ ou -",                      dica:"🛡️ Mesmo raciocínio de equiparArma. O chamador está fora da classe." },
  "mr-equArmadura": { ans:"void",   w:"58px", ex:"int, double, String, void",   dica:"🛡️ O método age e encerra. Não devolve nada. Que palavra Java representa 'sem retorno'?" },
};

export const BLANK_IDS = Object.keys(CFG);

export function initBlanks(): Record<string, BS> {
  const s: Record<string, BS> = {};
  BLANK_IDS.forEach(id => { s[id] = { val: "", status: "idle" }; });
  return s;
}

export interface StepDef {
  step: number;
  titulo: string;
  subtitulo: string;
  conceito: string;
  blankIds: string[];
}

export const STEP_DEFS: StepDef[] = [
  {
    step: 0,
    titulo: "Escolha o Reino",
    subtitulo: "Cada reino é um objeto diferente da mesma classe Reino — mesma estrutura, dados únicos.",
    conceito: "🏰 Objetos e Classes — instâncias da classe Reino",
    blankIds: ["rk-av-nome", "rk-av-valor", "rk-at-valor", "rk-mv-getNome", "rk-mr-getNome"],
  },
  {
    step: 1,
    titulo: "Escolha a Classe",
    subtitulo: "Personagem possui uma referência ao seu Reino — isso é associação entre objetos.",
    conceito: "🔒 Encapsulamento — atributos privados em Personagem",
    blankIds: ["av-nome", "av-classe", "av-nivel", "pav-reino"],
  },
  {
    step: 2,
    titulo: "Nome do Herói",
    subtitulo: "O construtor é a porta de entrada para criar um objeto na memória.",
    conceito: "⚗️ Construtor público e tipos primitivos Java",
    blankIds: ["mv-ctor", "at-nivel", "av-arma"],
  },
  {
    step: 3,
    titulo: "Equipar Arma",
    subtitulo: "Métodos públicos controlam como o estado interno é modificado com segurança.",
    conceito: "🔧 Métodos com parâmetros e tipos",
    blankIds: ["av-anel", "at-anel", "mv-equArma", "mp-equArma"],
  },
  {
    step: 4,
    titulo: "Forjar Herói",
    subtitulo: "Getters expõem dados de forma segura, sem abrir os atributos ao mundo.",
    conceito: "👁️ Getters — acesso público a atributos privados",
    blankIds: ["mv-getNome", "mr-getNome", "mv-equArmadura", "mr-equArmadura"],
  },
];
