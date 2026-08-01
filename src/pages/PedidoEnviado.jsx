import { Link } from 'react-router-dom';

export default function PedidoEnviado() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: 80, maxWidth: 460 }}>
      <div style={{ fontSize: '3rem' }} aria-hidden="true">🔥</div>
      <h2 style={{ fontFamily: 'var(--fonte-display)', fontSize: '2rem', letterSpacing: '0.02em' }}>
        Pedido enviado!
      </h2>
      <p style={{ color: 'var(--cor-fumaca-fosca)' }}>
        Seu pedido foi registrado e a mensagem foi aberta no WhatsApp. Confirme o envio por lá
        para a equipe da Refúgio Distribuidora começar a preparar.
      </p>
      <Link to="/" className="btn btn-primario" style={{ marginTop: 20, textDecoration: 'none' }}>
        Voltar ao cardápio
      </Link>
    </div>
  );
}
