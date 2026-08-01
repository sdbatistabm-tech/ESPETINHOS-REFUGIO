import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import {
  ouvirTodosProdutos, criarProduto, atualizarProduto,
  alternarAtivo, enviarImagemProduto,
} from '../../services/produtosService';
import { formatarMoeda } from '../../utils/formatters';

const VAZIO = { nome: '', categoria: 'Carnes', peso: '', preco: '', ordem: 99, ativo: true, imagemUrl: null };

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => ouvirTodosProdutos(setProdutos), []);

  const abrirNovo = () => setEditando({ ...VAZIO });
  const abrirEdicao = (p) => setEditando({ ...p });

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const dados = {
        nome: editando.nome.trim(),
        categoria: editando.categoria,
        peso: editando.peso || null,
        preco: Number(editando.preco),
        ordem: Number(editando.ordem) || 99,
        ativo: editando.ativo !== false,
        imagemUrl: editando.imagemUrl || null,
      };
      if (editando.id) {
        await atualizarProduto(editando.id, dados);
      } else {
        await criarProduto(dados);
      }
      setEditando(null);
    } catch (erro) {
      console.error(erro);
      alert('Não foi possível salvar o produto.');
    } finally {
      setSalvando(false);
    }
  };

  const trocarFoto = async (arquivo) => {
    if (!arquivo) return;
    setSalvando(true);
    try {
      const idTemporario = editando.id || `novo-${Date.now()}`;
      const { url } = await enviarImagemProduto(idTemporario, arquivo);
      setEditando((prev) => ({ ...prev, imagemUrl: url }));
    } catch (erro) {
      console.error(erro);
      alert('Não foi possível enviar a imagem.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <AdminLayout titulo="Produtos">
      <button className="btn btn-primario" onClick={abrirNovo} style={{ marginBottom: 20 }}>
        + Novo produto
      </button>

      {editando && (
        <form onSubmit={salvar} style={{ background: 'var(--cor-carvao-alto)', border: '1px solid var(--cor-linha)', borderRadius: 'var(--raio)', padding: 20, marginBottom: 24 }}>
          <h3 style={{ marginTop: 0 }}>{editando.id ? 'Editar produto' : 'Novo produto'}</h3>

          <div className="campo">
            <label>Nome</label>
            <input value={editando.nome} onChange={(e) => setEditando({ ...editando, nome: e.target.value })} required />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div className="campo" style={{ flex: 1 }}>
              <label>Categoria</label>
              <select value={editando.categoria} onChange={(e) => setEditando({ ...editando, categoria: e.target.value })}>
                <option>Carnes</option>
                <option>Variados</option>
              </select>
            </div>
            <div className="campo" style={{ flex: 1 }}>
              <label>Peso (opcional)</label>
              <input value={editando.peso || ''} onChange={(e) => setEditando({ ...editando, peso: e.target.value })} placeholder="Ex: 140g" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div className="campo" style={{ flex: 1 }}>
              <label>Preço (R$)</label>
              <input type="number" step="0.01" min="0" value={editando.preco} onChange={(e) => setEditando({ ...editando, preco: e.target.value })} required />
            </div>
            <div className="campo" style={{ flex: 1 }}>
              <label>Ordem no cardápio</label>
              <input type="number" value={editando.ordem} onChange={(e) => setEditando({ ...editando, ordem: e.target.value })} />
            </div>
          </div>

          <div className="campo">
            <label>Foto do produto</label>
            {editando.imagemUrl && (
              <img src={editando.imagemUrl} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
            )}
            <input type="file" accept="image/*" onChange={(e) => trocarFoto(e.target.files?.[0])} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primario" disabled={salvando}>
              {salvando ? 'Salvando…' : 'Salvar'}
            </button>
            <button type="button" className="btn btn-secundario" onClick={() => setEditando(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {produtos.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--cor-carvao-alto)', border: '1px solid var(--cor-linha)', borderRadius: 'var(--raio)', padding: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#2a1f18', flexShrink: 0 }}>
              {p.imagemUrl ? <img src={p.imagemUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🍢</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{p.nome}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--cor-fumaca-fosca)' }}>
                {p.categoria} {p.peso && `· ${p.peso}`} · {formatarMoeda(p.preco)}
                {!p.ativo && ' · INATIVO'}
              </div>
            </div>
            <button className="btn btn-secundario" onClick={() => abrirEdicao(p)}>Editar</button>
            <button className="btn btn-secundario" onClick={() => alternarAtivo(p.id, !p.ativo)}>
              {p.ativo ? 'Desativar' : 'Ativar'}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
