import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatarMoeda } from '../utils/formatters';
import './barraCarrinho.css';

export default function BarraCarrinho({ pedidoMinimo }) {
  const { totalUnidades, totalProdutos } = useCart();
  const navigate = useNavigate();

  if (totalUnidades === 0) return null;

  const faltam = Math.max(0, pedidoMinimo - totalUnidades);
  const atingiuMinimo = faltam === 0;

  return (
    <div className="barra-carrinho">
      <div className="container barra-carrinho-conteudo">
        <div className="barra-carrinho-resumo">
          <strong>{totalUnidades} un.</strong>
          <span>{formatarMoeda(totalProdutos)}</span>
        </div>
        {!atingiuMinimo ? (
          <span className="barra-carrinho-aviso">Faltam {faltam} un. para o pedido mínimo</span>
        ) : (
          <button className="btn btn-primario" onClick={() => navigate('/checkout')}>
            Continuar pedido
          </button>
        )}
      </div>
    </div>
  );
}
