import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Order } from './pages/Order';
import { Confirmation } from './pages/Confirmation';
import { Login } from './pages/Login';
import { AdminProducts } from './pages/AdminProducts';
import { ProductForm } from './pages/ProductForm';
import { AdminOrders } from './pages/AdminOrders';
import { OrderDetails } from './pages/OrderDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/encomenda" element={<Order />} />
          <Route path="/confirmacao/:orderId" element={<Confirmation />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route path="/admin/produtos" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
          <Route path="/admin/produtos/novo" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/admin/produtos/:id/editar" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/admin/pedidos" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
          <Route path="/admin/pedidos/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;