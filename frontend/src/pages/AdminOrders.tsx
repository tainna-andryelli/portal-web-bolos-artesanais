import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from '../components/AdminHeader';
import { Footer } from '../components/Footer';
import { apiFetch } from '../services/api';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'READY' | 'DELIVERED' | 'CANCELLED';

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  deliveryDate: string;
  status: OrderStatus;
  product: {
    name: string;
    price: number | string;
  };
  size: string;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  IN_PRODUCTION: 'Em Produção',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-purple-100 text-purple-700',
  IN_PRODUCTION: 'bg-yellow-100 text-yellow-700',
  READY: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    apiFetch<Order[]>('/orders')
      .then((data) => {
        setOrders(data);
        setFiltered(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = orders;

    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(term) ||
          String(o.orderNumber).includes(term) ||
          o.product.name.toLowerCase().includes(term),
      );
    }

    setFiltered(result);
  }, [statusFilter, searchTerm, orders]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-900">Gerenciar Pedidos</h1>
            <p className="text-gray-600 text-sm mt-1">
              {loading ? 'Carregando...' : `${filtered.length} pedido${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Filtros Desktop */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                >
                  <option value="">Todos</option>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Buscar</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cliente, número do pedido, produto..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Filtros Mobile */}
          <div className="md:hidden bg-white rounded-xl shadow-sm p-4 mb-4 space-y-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente, pedido..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          {loading && (
            <p className="text-center text-gray-400 py-20">Carregando pedidos...</p>
          )}

          {error && (
            <p className="text-center text-red-400 py-20">Erro ao carregar pedidos. Tente novamente.</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center text-gray-400 py-20">
              <p className="text-4xl mb-4">📋</p>
              <p className="font-medium">Nenhum pedido encontrado.</p>
            </div>
          )}

          {/* Desktop */}
          {!loading && !error && filtered.length > 0 && (
            <div className="hidden md:grid md:grid-cols-2 gap-6 mb-8">
              {filtered.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-3xl font-bold text-pink-600">#{order.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-lg font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-base text-gray-700">{order.product.name} — {order.size}</p>
                  </div>

                  <div className="space-y-1 mb-5 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>🛒</span>
                      <span>Pedido: {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🚚</span>
                      <span>Entrega: {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{order.customerPhone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/pedidos/${order.id}`)}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Mobile */}
          {!loading && !error && filtered.length > 0 && (
            <div className="md:hidden space-y-3 mb-6">
              {filtered.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-pink-600">#{order.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm mb-4">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-gray-600">{order.product.name} — {order.size}</div>
                    <div className="text-gray-500 text-xs">🛒 {new Date(order.createdAt).toLocaleDateString('pt-BR')}</div>
                    <div className="text-gray-500 text-xs">🚚 {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}</div>
                    <div className="text-gray-500 text-xs">📞 {order.customerPhone}</div>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/pedidos/${order.id}`)}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2.5 rounded-xl font-bold text-sm"
                  >
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}