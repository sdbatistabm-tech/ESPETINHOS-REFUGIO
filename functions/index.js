const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const db = getFirestore();

function normalizarWhatsapp(numero) {
  return String(numero || '').replace(/\D/g, '');
}

exports.consultarPedidosPorWhatsapp = onCall(async (request) => {
  const numero = normalizarWhatsapp(request.data?.whatsapp);
  if (numero.length < 10) {
    throw new HttpsError('invalid-argument', 'Informe um número de WhatsApp válido.');
  }

  const snap = await db
    .collection('pedidos')
    .where('clienteWhatsappNormalizado', '==', numero)
    .orderBy('criadoEm', 'desc')
    .get();

  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

exports.notificarNovoPedido = onDocumentCreated('pedidos/{pedidoId}', async (event) => {
  const pedido = event.data.data();
  const tokensSnap = await db.collection('adminTokens').get();
  const tokens = tokensSnap.docs.map((d) => d.data().token).filter(Boolean);
  if (tokens.length === 0) return;

  const mensagem = {
    notification: {
      title: 'Novo pedido - Refúgio',
      body: `${pedido.clienteNome} · ${pedido.totalUnidades} unidades`,
    },
    tokens,
  };

  const resposta = await getMessaging().sendEachForMulticast(mensagem);

  const invalidos = [];
  resposta.responses.forEach((r, i) => {
    if (!r.success) invalidos.push(tokensSnap.docs[i].ref);
  });
  await Promise.all(invalidos.map((ref) => ref.delete().catch(() => {})));
});
