import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { ouvirConfig, salvarConfig } from '../../services/configService';
import { seedConfig } from '../../data/seedProducts';

export default function AdminConfiguracoes() {
  const [config, setConfig] = useState(seedConfig);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => ouvirConfig((c) => c && setConfig(c)), []);

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setSalvo(false);
    try {
      await salvarConfig({
        ...config,
        pedidoMinimoUnidades: Number(config.pedidoMinimoUnidades),
        taxaEntrega: Number(config.taxaEntrega),
      });
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } catch (erro) {
      console.error(erro);
      alert('Não foi possível salvar as configurações.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <AdminLayout titulo="Configurações">
      <form onSubmit={salvar} style={{ maxWidth: 480 }}>
        <div className="campo">
          <label>Pedido mínimo (unidades)</label>
          <input type="number" min="1" value={config.pedidoMinimoUnidades} onChange={(e) => setConfig({ ...config, pedidoMinimoUnidades: e.target.value })} />
        </div>

        <div className="campo">
          <label>Taxa de entrega (R$)</label>
          <input type="number" step="0.01" min="0" value={config.taxaEntrega} onChange={(e) => setConfig({ ...config, taxaEntrega: e.target.value })} />
        </div>

        <div className="campo">
          <label>WhatsApp Business (com DDI e DDD, só números)</label>
          <input value={config.whatsappNumero} onChange={(e) => setConfig({ ...config, whatsappNumero: e.target.value.replace(/\D/g, '') })} placeholder="5551999999999" />
        </div>

        <div className="campo">
          <label>Chave PIX</label>
          <input value={config.chavePix} onChange={(e) => setConfig({ ...config, chavePix: e.target.value })} />
        </div>

        <div className="campo">
          <label>Nome do titular do PIX</label>
          <input value={config.nomeTitularPix} onChange={(e) => setConfig({ ...config, nomeTitularPix: e.target.value })} />
        </div>

        <div className="campo">
          <label>Observação de pagamento</label>
          <textarea rows={2} value={config.observacaoPagamento} onChange={(e) => setConfig({ ...config, observacaoPagamento: e.target.value })} />
        </div>

        <button className="btn btn-primario" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar configurações'}
        </button>
        {salvo && <span style={{ marginLeft: 12, color: 'var(--cor-verde)' }}>Salvo ✓</span>}
      </form>
    </AdminLayout>
  );
}
