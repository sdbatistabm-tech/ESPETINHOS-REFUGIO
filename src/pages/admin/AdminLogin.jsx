import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { usuario, carregando, login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);
  const navigate = useNavigate();

  if (!carregando && usuario) return <Navigate to="/admin/pedidos" replace />;

  const entrar = async (e) => {
    e.preventDefault();
    setErro('');
    setEntrando(true);
    try {
      await login(email, senha);
      navigate('/admin/pedidos');
    } catch {
      setErro('E-mail ou senha inválidos.');
    } finally {
      setEntrando(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 380, paddingTop: 80 }}>
      <h2 style={{ fontFamily: 'var(--fonte-display)', fontSize: '2rem', letterSpacing: '0.02em' }}>
        Área do administrador
      </h2>
      <form onSubmit={entrar}>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        {erro && <p className="erro" style={{ marginBottom: 14 }}>{erro}</p>}
        <button className="btn btn-primario" style={{ width: '100%' }} disabled={entrando}>
          {entrando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p style={{ fontSize: '0.8rem', color: 'var(--cor-fumaca-fosca)', marginTop: 16 }}>
        O acesso é criado manualmente no Console do Firebase (Authentication → Users).
      </p>
    </div>
  );
}
