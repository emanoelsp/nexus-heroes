# ⚔️ NEXUS DOS HERÓIS — Desafio Final Módulo 04

> **Web On Fire Academy · Persistência & BaaS**

Este é um jogo de criação de personagens feito com **Firebase Auth** e **Firestore** — e ele está **quebrado de propósito**. Seu trabalho é encontrar e corrigir os **8 bugs** escondidos no código.

Cada bug tem um banner vermelho na tela explicando o que está acontecendo. Leia o banner, vá para o código, corrija, e faça um commit.

---

## 🚀 Passo a Passo Completo

### PASSO 1 — Fazer o Fork

> Fork = criar uma cópia do projeto na **sua** conta do GitHub.

1. Acesse o repositório original:
   **https://github.com/emanoelsp/desafiobaas**

2. No canto superior direito da página, clique no botão **"Fork"**
   _(ele fica ao lado da estrela ⭐, no topo da página)_

3. Na próxima tela, clique em **"Create fork"** — sem alterar nada

4. Pronto! Agora você tem uma cópia do projeto em:
   `https://github.com/SEU-USUARIO/desafiobaas`

---

### PASSO 2 — Clonar o Repositório

> Clonar = baixar o código do GitHub para o seu computador.

1. Na **sua** cópia do repositório (não a original), clique no botão verde **"Code"**

2. Copie a URL que aparece (começa com `https://github.com/SEU-USUARIO/...`)

3. Abra o terminal e execute:

```bash
git clone https://github.com/SEU-USUARIO/desafiobaas.git
cd desafiobaas
```

_(Troque `SEU-USUARIO` pelo seu nome de usuário do GitHub)_

---

### PASSO 3 — Instalar as Dependências

```bash
npm install
```

Aguarde terminar. Vai aparecer uma pasta `node_modules` — isso é normal.

---

### PASSO 4 — Configurar o Firebase (.env.local)

O app precisa de um projeto Firebase para funcionar. Siga os passos:

#### 4.1 — Crie o projeto no Firebase

1. Acesse **https://console.firebase.google.com**
2. Clique em **"Adicionar projeto"**
3. Dê um nome (ex: `nexus-heroes-seunome`) e clique em **"Continuar"** até criar

#### 4.2 — Ative o Authentication

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Primeiros passos"**
3. Em "Método de login", clique em **"E-mail/senha"**
4. Ative a primeira opção e salve

#### 4.3 — Ative o Firestore

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de teste"** e clique em "Próximo"
4. Escolha a região **"southamerica-east1"** e finalize

#### 4.4 — Pegue as credenciais

1. No menu lateral, clique na ⚙️ **"Configurações do projeto"**
2. Role a página até encontrar **"Seus apps"**
3. Clique no ícone **`</>`** (web) para registrar um app
4. Dê um apelido qualquer e clique em "Registrar app"
5. Você vai ver um bloco de código com `firebaseConfig` — **guarde essas informações**

#### 4.5 — Crie o arquivo .env.local

Na pasta do projeto, crie um arquivo chamado `.env.local` (sem extensão, só esse nome) com o seguinte conteúdo — substituindo pelos seus valores:

```
NEXT_PUBLIC_FIREBASE_API_KEY=cole-aqui-o-apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cole-aqui-o-authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cole-aqui-o-projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cole-aqui-o-storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=cole-aqui-o-messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=cole-aqui-o-appId
```

> ⚠️ **NUNCA suba o `.env.local` para o GitHub!** Ele já está no `.gitignore`.

---

### PASSO 5 — Rodar o Projeto

```bash
npm run dev
```

Acesse **http://localhost:3000** no navegador.

Você vai ver a tela inicial do jogo. Ao navegar pelas páginas, banners **vermelhos** vão aparecer explicando cada bug.

---

## 🐛 Os 8 Bugs

Cada página tem um banner vermelho com:
- **O que está acontecendo** — o sintoma visível
- **Por quê isso acontece** — a causa técnica
- **Dica para corrigir** — por onde começar

| # | Arquivo para editar | Sintoma |
|---|---------------------|---------|
| 01 | `src/app/(auth)/login/page.tsx` | Login trava sem mostrar erro de senha errada |
| 02 | `middleware.ts` | Dashboard acessível sem login (ou bloqueia quem está logado) |
| 03 | `src/app/(auth)/cadastro/page.tsx` | Cadastro aceita senhas diferentes sem avisar |
| 04 | `src/services/personagens.ts` | Dashboard mostra personagens de todos os usuários |
| 05 | `src/services/personagens.ts` | Personagem criado não aparece no dashboard |
| 06 | `src/services/personagens.ts` | Equipar item apaga os outros equipamentos |
| 07 | `src/services/personagens.ts` | Deletar personagem deleta o errado |
| 08 | `firestore.rules` | Banco de dados sem nenhuma proteção de segurança |

---

## 📝 Como Fazer os Commits

**Regra: cada bug corrigido = 1 commit separado.**

Depois de corrigir cada bug, abra o terminal e execute:

```bash
# Adicionar o arquivo que você modificou
git add nome-do-arquivo-que-voce-editou

# Criar o commit com mensagem descritiva
git commit -m "fix(bug01): exibir mensagem de erro quando login falha"
```

### Exemplos de mensagens de commit para cada bug:

```
fix(bug01): exibir mensagem de erro quando login falha
fix(bug02): corrigir condicao do middleware para proteger rotas
fix(bug03): corrigir validacao da confirmacao de senha
fix(bug04): filtrar personagens pelo userId do usuario logado
fix(bug05): corrigir nome da colecao de personagem para personagens
fix(bug06): usar updateDoc em vez de setDoc para nao apagar campos
fix(bug07): usar personagem.id em vez do indice para deletar
fix(bug08): adicionar security rules com verificacao de userId
```

---

## 📋 Relatório de Entrega

Crie um arquivo chamado `RELATORIO.md` na pasta raiz do projeto. Para cada bug, escreva:

```markdown
## BUG #01 — Nome do Bug

### O que estava acontecendo
Descreva o que você viu de errado na tela.

### Trecho do código com o bug
Cole aqui o código ANTES da correção.

### Como corrigi
Cole aqui o código DEPOIS da correção.

### Resultado
Print da tela mostrando o bug funcionando CERTO após a correção.
```

---

## 📤 Entregando o Desafio

Depois de corrigir todos os bugs e criar o relatório:

```bash
# Enviar todos os commits para o seu fork no GitHub
git push origin main
```

Acesse seu repositório no GitHub e confirme que todos os 8 commits aparecem no histórico.

Depois, envie ao professor:
1. O **link do seu fork** no GitHub
2. O **link do deploy na Vercel** (se conseguir publicar)

---

## 🏗️ Estrutura do Projeto

```
desafiobaas/
├── middleware.ts              ← Bug 02 está aqui
├── firestore.rules            ← Bug 08 está aqui
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx     ← Bug 01
│   │   │   └── cadastro/page.tsx  ← Bug 03
│   │   ├── dashboard/page.tsx     ← Bugs 02, 04 e 07 aparecem aqui
│   │   ├── criar-personagem/      ← Bug 05 aparece aqui
│   │   └── personagem/[id]/       ← Bugs 06 e 07 aparecem aqui
│   ├── components/
│   │   └── BugBanner.tsx          ← Componente dos banners vermelhos
│   ├── contexts/AuthContext.tsx
│   ├── firebase/config.ts
│   ├── services/
│   │   └── personagens.ts         ← Bugs 04, 05, 06 e 07 estão aqui
│   └── types/index.ts
└── .env.example               ← Modelo para criar seu .env.local
```

---

Bora caçar bugs! 🔥
