import { useState } from 'react';
import { Link } from 'react-router-dom';
import { buscarPedidosPorWhatsapp } from '../services/pedidosService';
import { formatarMoeda, formatarData, mascararTelefone } from '../utils/formatters';
import StatusBadge from '../components/StatusBadge.jsx';

export default function HistoricoPedidos() {
  const [whatsapp, setWhatsapp] = useState('');
  const [pedidos, setPedidos] = useState(null);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);

  const buscar = async (e) => {
    e.preventDefault();
    setErro('');
    setBuscando(true);
    try {
      const lista = await buscarPedidosPorWhatsapp(whatsapp);
      setPedidos(lista);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível buscar os pedidos. Verifique o número e tente novamente.');
      setPedidos(null);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48, maxWidth: 560 }}>
      <Link to="/" className="cabecalho-link" style={{ display: 'inline-block', marginBottom: 18 }}>
        ← Voltar ao cardápio
      </Link>
      <h2 style={{ fontFamily: 'var(--fonte-display)', fontSize: '2rem', letterSpacing: '0.02em' }}>
        Meus pedidos
      </h2>
      <p style={{ color: 'var(--cor-fumaca-fosca)' }}>
        Informe o WhatsApp usado no pedido para consultar o histórico.
      </p>

      <form onSubmit={buscar} style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(mascararTelefone(e.target.value))}
          placeholder="(51) 99999-9999"
          inputMode="numeric"
          style={{ flex: 1, minWidth: 180 }}
        />
        <button className="btn btn-primario" disabled={buscando}>
          {buscando ? 'Buscando…' : 'Buscar'}
        </button>
      </form>
      {erro && <p className="erro" style={{ marginBottom: 20 }}>{erro}</p>}

      {pedidos !== null && pedidos.length === 0 && (
        <p style={{ color: 'var(--cor-fumaca-fosca)' }}>Nenhum pedido encontrado para esse WhatsApp.</p>
      )}

      {pedidos && pedidos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {pedidos.map((pedido) => (
            <div key={pedido.id} style={{ background: 'var(--cor-carvao-alto)', border: '1px solid var(--cor-linha)', borderRadius: 'var(--raio)', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--cor-fumaca-fosca)' }}>{formatarData(pedido.criadoEm)}</span>
                <StatusBadge status={pedido.status} />
              </div>
              <ul style={{ margin: '0 0 10px', paddingLeft: 18, fontSize: '0.9rem' }}>
                {pedido.itens.map((item, idx) => (
                  <li key={idx}>{item.quantidade}x {item.nome}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>{pedido.tipoEntrega}</span>
                <strong style={{ color: 'var(--cor-dourado)', fontFamily: 'var(--fonte-preco)' }}>{formatarMoeda(pedido.valorTotal)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
