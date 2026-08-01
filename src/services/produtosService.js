import {
  collection, addDoc, updateDoc, doc, deleteDoc,
  onSnapshot, query, orderBy, where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

const colecao = collection(db, 'produtos');

export function ouvirProdutosAtivos(callback) {
  const q = query(colecao, where('ativo', '==', true), orderBy('ordem', 'asc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export function ouvirTodosProdutos(callback) {
  const q = query(colecao, orderBy('ordem', 'asc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export function criarProduto(dados) {
  return addDoc(colecao, dados);
}

export function atualizarProduto(id, dados) {
  return updateDoc(doc(db, 'produtos', id), dados);
}

export function alternarAtivo(id, ativo) {
  return updateDoc(doc(db, 'produtos', id), { ativo });
}

export function excluirProduto(id) {
  return deleteDoc(doc(db, 'produtos', id));
}

export async function enviarImagemProduto(produtoId, arquivo) {
  const caminho = `produtos/${produtoId}/${Date.now()}_${arquivo.name}`;
  const referencia = ref(storage, caminho);
  await uploadBytes(referencia, arquivo);
  const url = await getDownloadURL(referencia);
  return { url, caminho };
}

export async function removerImagemProduto(caminho) {
  if (!caminho) return;
  await deleteObject(ref(storage, caminho)).catch(() => {});
}
