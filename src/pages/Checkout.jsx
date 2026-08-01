import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { ouvirConfig } from '../services/configService';
import { criarPedido } from '../services/pedidosService';
import { montarLinkWhatsapp } from '../utils/whatsapp';
import { formatarMoeda, mascararTelefone } from '../utils/formatters';
import { seedConfig } from '../data/seedProducts';
import CaixaPix from '../components/CaixaPix.jsx';

export default function Checkout() {
  const { lista, totalUnidades, totalProdutos, limparCarrinho } = useCart();
  const [config, setConfig] = useState(seedConfig);
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState('Retirada');
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const parar = ouvirConfig((c) => c && setConfig(c));
    return parar;
  }, []);

  useEffect(() => {
    if (totalUnidades === 0) navigate('/', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taxaEntrega = tipoEntrega === 'Entrega' ? config.taxaEntrega : 0;
  const valorTotal = totalProdutos + taxaEntrega;
  const abaixoDoMinimo = totalUnidades < config.pedidoMinimoUnidades;

  const validar = () => {
    const proximosErros = {};
    if (!nome.trim()) proximosErros.nome = 'Informe seu nome.';
    if (whatsapp.replace(/\D/g, '').length < 10) proximosErros.whatsapp = 'Informe um WhatsApp válido com DDD.';
    setErros(proximosErros);
    return Object.keys(proximosErros).length === 0;
  };

  const enviarPedido = async () => {
    if (!validar() || abaixoDoMinimo) return;
    setEnviando(true);
    try {
      const pedido = {
        clienteNome: nome.trim(),
        clienteWhatsapp: whatsapp,
        itens: lista.map((i) => ({
          produtoId: i.produto.id,
          nome: i.produto.nome,
          quantidade: i.quantidade,
          preco: i.produto.preco,
        })),
        totalUnidades,
        tipoEntrega,
        taxaEntrega,
        valorTotal,
        observacao: observacao.trim(),
        observacaoPagamento: config.observacaoPagamento,
      };
      await criarPedido(pedido);
      const link = montarLinkWhatsapp(config.whatsappNumero, pedido);
      limparCarrinho();
      window.open(link, '_blank');
      navigate('/pedido-enviado');
    } catch (erro) {
      console.error(erro);
      setErros({ geral: 'Não foi possível enviar o pedido agora. Tente novamente em instantes.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: 48, paddingTop: 24, maxWidth: 560 }}>
      <Link to="/" className="cabecalho-link" style={{ display: 'inline-block', marginBottom: 18 }}>
        ← Voltar ao cardápio
      </Link>
      <h2 style={{ fontFamily: 'var(--fonte-display)', fontSize: '2rem', letterSpacing: '0.02em', marginBottom: 4 }}>
        Finalizar pedido
      </h2>
      <p style={{ color: 'var(--cor-fumaca-fosca)', marginTop: 0 }}>{totalUnidades} unidades selecionadas</p>

      <div className="campo">
        <label htmlFor="nome">Nome completo</label>
        <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" />
        {erros.nome && <span className="erro">{erros.nome}</span>}
      </div>

      <div className="campo">
        <label htmlFor="whatsapp">WhatsApp</label>
        <input
          id="whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(mascararTelefone(e.target.value))}
          placeholder="(51) 99999-9999"
          inputMode="numeric"
        />
        {erros.whatsapp && <span className="erro">{erros.whatsapp}</span>}
      </div>

      <div className="campo">
        <label>Entrega</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Retirada', 'Entrega'].map((opcao) => (
            <button
              key={opcao}
              type="button"
              onClick={() => setTipoEntrega(opcao)}
              className="btn btn-secundario"
              style={tipoEntrega === opcao ? { borderColor: 'var(--cor-brasa)', color: 'var(--cor-brasa)' } : undefined}
            >
              {opcao} {opcao === 'Entrega' ? `(${formatarMoeda(config.taxaEntrega)})` : '(grátis)'}
            </button>
          ))}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="observacao">Observação (opcional)</label>
        <textarea
          id="observacao"
          rows={3}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Ponto do tempero, horário de retirada, etc."
        />
      </div>

      <div className="divisor-espeto"><span>Resumo</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span>Produtos</span><span>{formatarMoeda(totalProdutos)}</span>
      </div>
      {tipoEntrega === 'Entrega' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span>Taxa de entrega</span><span>{formatarMoeda(taxaEntrega)}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', margin: '10px 0 20px' }}>
        <span>Total</span>
        <span style={{ color: 'var(--cor-dourado)', fontFamily: 'var(--fonte-preco)' }}>
          {formatarMoeda(valorTotal)}
        </span>
      </div>

      <CaixaPix chavePix={config.chavePix} nomeTitular={config.nomeTitularPix} valor={valorTotal} />

      {erros.geral && <p className="erro" style={{ marginTop: 14 }}>{erros.geral}</p>}

      <button
        className="btn btn-primario"
        style={{ width: '100%', marginTop: 20 }}
        onClick={enviarPedido}
        disabled={enviando || abaixoDoMinimo}
      >
        {enviando ? 'Enviando…' : 'Enviar pedido no WhatsApp'}
      </button>
      {abaixoDoMinimo && (
        <p className="erro" style={{ textAlign: 'center', marginTop: 10 }}>
          O pedido mínimo é de {config.pedidoMinimoUnidades} unidades.
        </p>
      )}
    </div>
  );
}
