import { formatarMoeda } from './formatters';

export function montarLinkWhatsapp(numeroWhatsappEmpresa, pedido) {
  const texto = montarMensagemPedido(pedido);
  const numero = numeroWhatsappEmpresa.replace(/\D/g, '');
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function montarMensagemPedido(pedido) {
  const linhas = [];
  linhas.push('*NOVO PEDIDO - REFÚGIO DISTRIBUIDORA*');
  linhas.push('');
  linhas.push(`*Cliente:* ${pedido.clienteNome}`);
  linhas.push(`*WhatsApp:* ${pedido.clienteWhatsapp}`);
  linhas.push('');
  linhas.push('*Itens:*');
  pedido.itens.forEach((item) => {
    linhas.push(`• ${item.quantidade}x ${item.nome} - ${formatarMoeda(item.quantidade * item.preco)}`);
  });
  linhas.push('');
  linhas.push(`*Total de unidades:* ${pedido.totalUnidades}`);
  linhas.push(`*Tipo de entrega:* ${pedido.tipoEntrega}`);
  if (pedido.tipoEntrega === 'Entrega') {
    linhas.push(`*Taxa de entrega:* ${formatarMoeda(pedido.taxaEntrega)}`);
  }
  linhas.push(`*Valor total:* ${formatarMoeda(pedido.valorTotal)}`);
  if (pedido.observacao) {
    linhas.push('');
    linhas.push(`*Observação:* ${pedido.observacao}`);
  }
  linhas.push('');
  linhas.push(pedido.observacaoPagamento || 'Forma de pagamento: 50% de entrada + 50% na entrega');

  return linhas.join('\n');
}
