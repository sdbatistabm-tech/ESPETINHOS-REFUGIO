import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) return <div className="tela-carregando">Carregando…</div>;
  if (!usuario) return <Navigate to="/admin" replace />;
  return children;
}
