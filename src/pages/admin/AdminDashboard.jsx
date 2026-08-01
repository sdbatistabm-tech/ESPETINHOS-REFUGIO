import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { ouvirPedidos, atualizarStatusPedido, marcarPago } from '../../services/pedidosService';
import { formatarMoeda, formatarData } from '../../utils/formatters';
import { STATUS_PEDIDO } from '../../data/seedProducts';
import { ativarNotificacoesAdmin } from '../../utils/notificacoes';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [avisoNotificacao, setAvisoNotificacao] = useState('');
  const { usuario } = useAuth();

  useEffect(() => ouvirPedidos(setPedidos), []);

  const ativarNotificacoes = async () => {
    try {
      await ativarNotificacoesAdmin(usuario.uid);
      setAvisoNotificacao('Notificações ativadas neste dispositivo ✓');
    } catch (erro) {
      setAvisoNotificacao(erro.message);
    }
  };

  const pedidosFiltrados = useMemo(
    () => (filtro === 'Todos' ? pedidos : pedidos.filter((p) => p.status === filtro)),
    [pedidos, filtro],
  );

  return (
    <AdminLayout titulo="Pedidos">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-secundario" onClick={ativarNotificacoes}>🔔 Ativar notificações de novo pedido</button>
        {avisoNotificacao && <span style={{ fontSize: '0.85rem', color: 'var(--cor-fumaca-fosca)' }}>{avisoNotificacao}</span>}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['Todos', ...STATUS_PEDIDO.filter(s => s !== 'Pago')].map((s) => (
          <button
            key={s}
            className="btn btn-secundario"
            onClick={() => setFiltro(s)}
            style={filtro === s ? { borderColor: 'var(--cor-brasa)', color: 'var(--cor-brasa)' } : undefined}
          >
            {s}
          </button>
        ))}
      </div>

      {pedidosFiltrados.length === 0 && (
        <p style={{ color: 'var(--cor-fumaca-fosca)' }}>Nenhum pedido nesse filtro.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {pedidosFiltrados.map((pedido) => (
          <div key={pedido.id} style={{ background: 'var(--cor-carvao-alto)', border: '1px solid var(--cor-linha)', borderRadius: 'var(--raio)', padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              <div>
                <strong>{pedido.clienteNome}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--cor-fumaca-fosca)' }}>
                  {pedido.clienteWhatsapp} · {formatarData(pedido.criadoEm)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <StatusBadge status={pedido.status} />
                {pedido.pago && <StatusBadge status="Pago" />}
              </div>
            </div>

            <ul style={{ margin: '0 0 10px', paddingLeft: 18, fontSize: '0.9rem' }}>
              {pedido.itens.map((item, idx) => (
                <li key={idx}>{item.quantidade}x {item.nome} — {formatarMoeda(item.quantidade * item.preco)}</li>
              ))}
            </ul>

            {pedido.observacao && (
              <p style={{ fontSize: '0.85rem', color: 'var(--cor-fumaca-fosca)', fontStyle: 'italic' }}>
                "{pedido.observacao}"
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontSize: '0.9rem' }}>
                {pedido.tipoEntrega} {pedido.tipoEntrega === 'Entrega' && `(+${formatarMoeda(pedido.taxaEntrega)})`} · Total {formatarMoeda(pedido.valorTotal)}
              </span>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={pedido.status}
                  onChange={(e) => atualizarStatusPedido(pedido.id, e.target.value)}
                  style={{ padding: '8px 10px' }}
                >
                  {STATUS_PEDIDO.filter((s) => s !== 'Pago').map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn btn-secundario" onClick={() => marcarPago(pedido.id, !pedido.pago)}>
                  {pedido.pago ? 'Desmarcar pago' : 'Marcar como pago'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
