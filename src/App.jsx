import { Routes, Route } from 'react-router-dom';
import Cardapio from './pages/Cardapio.jsx';
import Checkout from './pages/Checkout.jsx';
import PedidoEnviado from './pages/PedidoEnviado.jsx';
import HistoricoPedidos from './pages/HistoricoPedidos.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProdutos from './pages/admin/AdminProdutos.jsx';
import AdminConfiguracoes from './pages/admin/AdminConfiguracoes.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Cardapio />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pedido-enviado" element={<PedidoEnviado />} />
      <Route path="/meus-pedidos" element={<HistoricoPedidos />} />

      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/pedidos" element={<RotaProtegida><AdminDashboard /></RotaProtegida>} />
      <Route path="/admin/produtos" element={<RotaProtegida><AdminProdutos /></RotaProtegida>} />
      <Route path="/admin/configuracoes" element={<RotaProtegida><AdminConfiguracoes /></RotaProtegida>} />
    </Routes>
  );
}
