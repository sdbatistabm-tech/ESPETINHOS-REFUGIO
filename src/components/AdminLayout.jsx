import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './adminLayout.css';

const LINKS = [
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/produtos', label: 'Produtos' },
  { to: '/admin/configuracoes', label: 'Configurações' },
];

export default function AdminLayout({ titulo, children }) {
  const { logout } = useAuth();

  return (
    <div className="admin-layout">
      <header className="admin-topo">
        <div className="container admin-topo-conteudo">
          <span className="admin-marca">Refúgio · Admin</span>
          <nav className="admin-nav">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'admin-nav-ativo' : ''}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <button className="btn btn-secundario" onClick={logout}>Sair</button>
        </div>
      </header>
      <main className="container admin-conteudo">
        <h2 className="admin-titulo">{titulo}</h2>
        {children}
      </main>
    </div>
  );
}
