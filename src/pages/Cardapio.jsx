import { useEffect, useState } from 'react';
import Cabecalho from '../components/Cabecalho.jsx';
import ProdutoCard from '../components/ProdutoCard.jsx';
import BarraCarrinho from '../components/BarraCarrinho.jsx';
import { ouvirProdutosAtivos } from '../services/produtosService';
import { ouvirConfig } from '../services/configService';
import { seedConfig } from '../data/seedProducts';

export default function Cardapio() {
  const [produtos, setProdutos] = useState(null);
  const [config, setConfig] = useState(seedConfig);

  useEffect(() => {
    const pararProdutos = ouvirProdutosAtivos(setProdutos);
    const pararConfig = ouvirConfig((c) => c && setConfig(c));
    return () => { pararProdutos(); pararConfig(); };
  }, []);

  const categorias = ['Carnes', 'Variados'];

  return (
    <div>
      <Cabecalho />
      <main className="container" style={{ paddingBottom: 32, paddingTop: 8 }}>
        <p style={{ color: 'var(--cor-fumaca-fosca)', fontSize: '0.9rem' }}>
          Pedido mínimo de <strong>{config.pedidoMinimoUnidades} unidades</strong>, misturando os
          sabores que quiser.
        </p>

        {produtos === null && <div className="tela-carregando">Carregando cardápio…</div>}

        {produtos && categorias.map((categoria) => {
          const itensCategoria = produtos.filter((p) => p.categoria === categoria);
          if (itensCategoria.length === 0) return null;
          return (
            <section key={categoria}>
              <div className="divisor-espeto"><span>{categoria}</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {itensCategoria.map((produto) => (
                  <ProdutoCard key={produto.id} produto={produto} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <BarraCarrinho pedidoMinimo={config.pedidoMinimoUnidades} />
    </div>
  );
}
