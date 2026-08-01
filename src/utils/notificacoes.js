import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import { db, getMessagingIfSupported } from '../firebase';

export async function ativarNotificacoesAdmin(uidAdmin) {
  const messaging = await getMessagingIfSupported();
  if (!messaging) throw new Error('Notificações push não são suportadas neste navegador.');

  const permissao = await Notification.requestPermission();
  if (permissao !== 'granted') throw new Error('Permissão de notificação negada.');

  const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
  await setDoc(doc(db, 'adminTokens', uidAdmin), { token, atualizadoEm: serverTimestamp() });
  return token;
}
