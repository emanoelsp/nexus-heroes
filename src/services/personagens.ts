"use client";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { Classe, Personagem } from "@/types";

export async function listarPersonagens(uid: string): Promise<Personagem[]> {
  const q = query(collection(db, "personagens"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Personagem));
}

export async function criarPersonagem(
  uid: string,
  nome: string,
  classe: Classe,
  reinoId?: string
): Promise<string> {
  const ref = await addDoc(collection(db, "personagens"), {
    nome,
    classe,
    nivel: 1,
    xp: 0,
    userId: uid,
    ...(reinoId ? { reinoId } : {}),
    criadoEm: serverTimestamp(),
  });
  return ref.id;
}

export async function buscarPersonagem(id: string): Promise<Personagem | null> {
  const snap = await getDoc(doc(db, "personagens", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Personagem;
}

export async function equiparItem(
  personagemId: string,
  slot: "arma" | "armadura" | "anel",
  itemId: string
): Promise<void> {
  await updateDoc(doc(db, "personagens", personagemId), { [slot]: itemId });
}

export async function deletarPersonagem(personagem: Personagem): Promise<void> {
  await deleteDoc(doc(db, "personagens", personagem.id));
}

export async function adicionarXP(personagemId: string, quantidade: number) {
  await updateDoc(doc(db, "personagens", personagemId), {
    xp: quantidade,
  });
}
