import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/encomenda" element={<Order />} />
        <Route path="/confirmacao/:orderId" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/produtos" element={<AdminProducts />} />
        <Route path="/admin/produtos/novo" element={<ProductForm />} />
        <Route path="/admin/produtos/:id/editar" element={<ProductForm />} />
        <Route path="/admin/pedidos" element={<AdminOrders />} />
        <Route path="/admin/pedidos/:id" element={<OrderDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
