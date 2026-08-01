import { useCart } from '../context/CartContext.jsx';
import { formatarMoeda } from '../utils/formatters';
import './produtoCard.css';

export default function ProdutoCard({ produto }) {
  const { itens, setQuantidade } = useCart();
  const quantidade = itens[produto.id]?.quantidade || 0;

  return (
    <div className="produto-card">
      <div className="produto-foto">
        {produto.imagemUrl
          ? <img src={produto.imagemUrl} alt={produto.nome} loading="lazy" />
          : <div className="produto-foto-vazia" aria-hidden="true">🍢</div>}
      </div>

      <div className="produto-info">
        <div className="produto-titulo">
          <h3>{produto.nome}</h3>
          {produto.peso && <span className="produto-peso">{produto.peso}</span>}
        </div>
        <span className="produto-preco">{formatarMoeda(produto.preco)}</span>
      </div>

      <div className="produto-stepper" role="group" aria-label={`Quantidade de ${produto.nome}`}>
        <button
          type="button"
          onClick={() => setQuantidade(produto, Math.max(0, quantidade - 1))}
          disabled={quantidade === 0}
          aria-label={`Diminuir quantidade de ${produto.nome}`}
        >−</button>
        <span className="produto-stepper-valor">{quantidade}</span>
        <button
          type="button"
          onClick={() => setQuantidade(produto, quantidade + 1)}
          aria-label={`Aumentar quantidade de ${produto.nome}`}
        >+</button>
      </div>
    </div>
  );
}
