# 👨‍🏫 Guia do Professor — Nexus dos Heróis

Este documento lista todos os bugs plantados, onde estão, qual é a linha exata do problema e qual é a correção completa. **Não compartilhe com os alunos.**

---

## BUG 01 — Login Silencia Erros
**Arquivo:** `src/app/(auth)/login/page.tsx`
**Linha:** ~46

**Código bugado:**
```ts
} catch {
  // catch vazio — erro engolido
}
```

**Correção:**
```ts
} catch (err) {
  const msg = err instanceof Error ? err.message : "Erro desconhecido";
  if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
    setErro("E-mail ou senha incorretos.");
  } else if (msg.includes("user-not-found")) {
    setErro("Nenhuma conta encontrada com este e-mail.");
  } else {
    setErro("Erro ao entrar. Tente novamente.");
  }
}
```

**Conceito ensinado:** Tratamento de erros com try/catch, erros do Firebase Auth.

---

## BUG 02 — Middleware com Condição Invertida
**Arquivo:** `middleware.ts`
**Linha:** ~28

**Código bugado:**
```ts
if (token) {  // ← deveria ser !token
  return NextResponse.redirect(new URL("/login", request.url));
}
```

**Correção:**
```ts
if (!token) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

**Conceito ensinado:** Next.js Middleware, proteção de rotas, operador lógico de negação.

---

## BUG 03 — Confirmação de Senha Compara com Nome
**Arquivo:** `src/app/(auth)/cadastro/page.tsx`
**Linha:** ~30

**Código bugado:**
```ts
if (senha !== nome) {  // ← variável errada!
```

**Correção:**
```ts
if (senha !== confirmarSenha) {
```

**Conceito ensinado:** Validação de formulários, atenção a variáveis com nomes similares.

---

## BUG 04 — Query Sem Filtro de userId
**Arquivo:** `src/services/personagens.ts`
**Linha:** ~29

**Código bugado:**
```ts
const q = query(collection(db, "personagens"));
```

**Correção:**
```ts
import { where } from "firebase/firestore";
// ...
const q = query(
  collection(db, "personagens"),
  where("userId", "==", uid)
);
```

**Conceito ensinado:** Queries no Firestore com where(), separação de dados por usuário.

---

## BUG 05 — Nome de Coleção Errado no Create
**Arquivo:** `src/services/personagens.ts`
**Linha:** ~52

**Código bugado:**
```ts
const ref = await addDoc(collection(db, "personagem"), { ... });
//                                       ↑ singular — errado!
```

**Correção:**
```ts
const ref = await addDoc(collection(db, "personagens"), { ... });
//                                       ↑ plural — correto
```

**Conceito ensinado:** Nomes de coleções no Firestore, consistência de nomenclatura.

---

## BUG 06 — setDoc Apaga o Documento Inteiro
**Arquivo:** `src/services/personagens.ts`
**Linha:** ~82

**Código bugado:**
```ts
await setDoc(doc(db, "personagens", personagemId), { [slot]: itemId });
```

**Correção:**
```ts
await updateDoc(doc(db, "personagens", personagemId), { [slot]: itemId });
```

**Conceito ensinado:** Diferença entre setDoc (substitui) e updateDoc (atualiza parcialmente).

---

## BUG 07 — Deletar Usa Índice Como ID
**Arquivo:** `src/services/personagens.ts`
**Linha:** ~100

**Código bugado:**
```ts
await deleteDoc(doc(db, "personagens", String(indice)));
//                                      ↑ índice 0, 1, 2... não é o ID!
```

**Correção:**
```ts
await deleteDoc(doc(db, "personagens", personagem.id));
```

**Conceito ensinado:** IDs de documentos no Firestore, não confundir posição de array com ID.

---

## BUG 08 — Security Rules Abertas
**Arquivo:** `firestore.rules`

**Código bugado:**
```
match /{document=**} {
  allow read, write: if true;
}
```

**Correção:**
```
match /personagens/{personagemId} {
  allow read: if request.auth != null &&
              request.auth.uid == resource.data.userId;
  allow create: if request.auth != null &&
                request.auth.uid == request.resource.data.userId;
  allow update, delete: if request.auth != null &&
                        request.auth.uid == resource.data.userId;
}
```

**Conceito ensinado:** Firebase Security Rules, autenticação vs autorização, resource.data.

---

## 📊 Rubrica de Avaliação

| Item | Pontos |
|------|--------|
| Cada bug corrigido (8 bugs × 8 pts) | 64 pts |
| Commit por bug, mensagem clara | 8 pts |
| Relatório com explicação técnica | 16 pts |
| App deployado na Vercel funcionando | 8 pts |
| Bônus: Security Rules completas | +5 pts |
| **Total** | **100 pts** |

---

## 💡 Dicas de Facilitação

1. **Bug 01** é bom para começar — é o mais visual e intuitivo.
2. **Bug 02** (middleware) é o mais conceitual — explore bem o funcionamento do middleware no Next.js.
3. **Bugs 04–07** estão todos em `services/personagens.ts` — bom para mostrar como um único arquivo mal escrito quebra o app inteiro.
4. **Bug 08** pode virar uma discussão sobre segurança web — o que aconteceria em produção com essas rules?
