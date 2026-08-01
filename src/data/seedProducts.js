export const seedProducts = [
  { nome: 'Carne Opção 1', categoria: 'Carnes', peso: '140g', preco: 7.0, ordem: 1 },
  { nome: 'Carne Opção 2', categoria: 'Carnes', peso: '140g', preco: 7.0, ordem: 2 },
  { nome: 'Carne Opção 3', categoria: 'Carnes', peso: '140g', preco: 6.5, ordem: 3 },
  { nome: 'Carne Opção 4', categoria: 'Carnes', peso: '110g', preco: 6.0, ordem: 4 },
  { nome: 'Frango', categoria: 'Variados', peso: null, preco: 6.0, ordem: 5 },
  { nome: 'Calabresa', categoria: 'Variados', peso: null, preco: 6.0, ordem: 6 },
  { nome: 'Coração de Frango', categoria: 'Variados', peso: null, preco: 5.5, ordem: 7 },
  { nome: 'Misto', categoria: 'Variados', peso: null, preco: 7.0, ordem: 8 },
  { nome: 'Carne com Bacon', categoria: 'Variados', peso: null, preco: 8.0, ordem: 9 },
  { nome: 'Frango com Bacon', categoria: 'Variados', peso: null, preco: 8.0, ordem: 10 },
  { nome: 'Medalhão de Queijo', categoria: 'Variados', peso: null, preco: 8.0, ordem: 11 },
  { nome: 'Queijo Coalho', categoria: 'Variados', peso: null, preco: 5.5, ordem: 12 },
  { nome: 'Frango com Queijo', categoria: 'Variados', peso: null, preco: 7.5, ordem: 13 },
  { nome: 'Carne com Queijo', categoria: 'Variados', peso: null, preco: 7.5, ordem: 14 },
  { nome: 'Romeu e Julieta', categoria: 'Variados', peso: null, preco: 7.5, ordem: 15 },
].map((p) => ({ ...p, ativo: true, imagemUrl: null }));

export const seedConfig = {
  pedidoMinimoUnidades: 50,
  taxaEntrega: 10.0,
  whatsappNumero: '5551999999999',
  chavePix: '',
  nomeTitularPix: 'Refúgio Distribuidora',
  observacaoPagamento: 'Forma de pagamento: 50% de entrada + 50% na entrega',
};

export const STATUS_PEDIDO = ['Novo', 'Em preparo', 'Pronto', 'Entregue', 'Cancelado', 'Pago'];
