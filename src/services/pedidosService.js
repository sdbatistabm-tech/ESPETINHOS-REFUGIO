import {
  collection, addDoc, updateDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, app } from '../firebase';
import { normalizarWhatsapp } from '../utils/formatters';

const colecao = collection(db, 'pedidos');
const functions = getFunctions(app);

export function criarPedido(pedido) {
  return addDoc(colecao, {
    ...pedido,
    clienteWhatsappNormalizado: normalizarWhatsapp(pedido.clienteWhatsapp),
    status: 'Novo',
    pago: false,
    criadoEm: serverTimestamp(),
  });
}

export function ouvirPedidos(callback) {
  const q = query(colecao, orderBy('criadoEm', 'desc'));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (erro) => {
      console.error('Erro ao carregar pedidos:', erro);
      callback([]);
    },
  );
}

export function atualizarStatusPedido(id, status) {
  return updateDoc(doc(db, 'pedidos', id), { status });
}

export function marcarPago(id, pago) {
  return updateDoc(doc(db, 'pedidos', id), { pago });
}

export async function buscarPedidosPorWhatsapp(numero) {
  const consultar = httpsCallable(functions, 'consultarPedidosPorWhatsapp');
  const resultado = await consultar({ whatsapp: normalizarWhatsapp(numero) });
  return resultado.data;
}
