import { Link } from 'react-router-dom';
import './cabecalho.css';

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="container cabecalho-conteudo">
        <div className="cabecalho-marca">
          <span className="cabecalho-eyebrow">Refúgio Distribuidora</span>
          <h1>Espetinhos crus temperados</h1>
          <p>Pra você assar e revender, no ponto certo pro seu negócio.</p>
        </div>
        <Link to="/meus-pedidos" className="cabecalho-link">Meus pedidos</Link>
      </div>
    </header>
  );
}
