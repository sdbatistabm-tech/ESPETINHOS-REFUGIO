import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const refConfig = doc(db, 'configuracoes', 'geral');

export function ouvirConfig(callback) {
  return onSnapshot(
    refConfig,
    (snap) => callback(snap.exists() ? snap.data() : null),
    (erro) => {
      console.error('Erro ao carregar configurações:', erro);
      callback(null);
    },
  );
}

export function salvarConfig(dados) {
  return setDoc(refConfig, dados, { merge: true });
}
