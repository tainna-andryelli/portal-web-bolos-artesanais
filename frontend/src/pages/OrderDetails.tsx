import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminHeader } from '../components/AdminHeader';
import { Footer } from '../components/Footer';
import { apiFetch } from '../services/api';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'READY' | 'DELIVERED' | 'CANCELLED';

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  size: string;
  deliveryDate: string;
  notes: string | null;
  status: OrderStatus;
  createdAt: string;
  product: {
    name: string;
    price: number | string;
  };
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  IN_PRODUCTION: 'Em Produção',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>('PENDING');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    apiFetch<Order>(`/orders/${id}`)
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await apiFetch(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) return;
    setSaving(true);
    try {
      await apiFetch(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      navigate('/admin/pedidos');
    } catch {
      alert('Erro ao cancelar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminHeader />
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Carregando pedido...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminHeader />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
          <p className="text-4xl">😕</p>
          <p>Pedido não encontrado.</p>
          <button
            onClick={() => navigate('/admin/pedidos')}
            className="text-pink-600 font-medium underline"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-2">{label}</label>
      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
        {value || '—'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin/pedidos')}
              className="text-pink-600 hover:text-pink-700 font-medium text-sm mb-4 flex items-center gap-2"
            >
              <span>←</span>
              <span>Voltar para lista de pedidos</span>
            </button>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-pink-900">
                Pedido #{order.orderNumber}
              </h1>
              <button
                onClick={handleCancel}
                disabled={saving || order.status === 'CANCELLED'}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold shadow-md transition-all text-sm md:text-base"
              >
                Cancelar Pedido
              </button>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                📋 <span className="font-bold">Informações do Pedido</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Status do Pedido</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <InfoField label="Produto" value={`${order.product.name} — ${order.size}`} />
              <InfoField label="Data do Pedido" value={new Date(order.createdAt).toLocaleString('pt-BR')} />
              <InfoField label="Data de Entrega" value={new Date(order.deliveryDate).toLocaleString('pt-BR')} />
              {order.notes && <InfoField label="Observações do Cliente" value={order.notes} />}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
                👤 <span className="font-bold">Dados do Cliente</span>
              </div>

              <div className="space-y-4 mb-8">
                <InfoField label="Nome" value={order.customerName} />
                <InfoField label="Telefone" value={order.customerPhone} />
                {order.customerEmail && (
                  <InfoField label="E-mail" value={order.customerEmail} />
                )}

                
                 <a href={`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span>Contatar via WhatsApp</span>
                </a>
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  ⚡ <span className="font-bold">Ações</span>
                </div>

                {saveSuccess && (
                  <p className="text-green-600 text-sm font-medium text-center">
                    ✅ Status atualizado com sucesso!
                  </p>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Status'}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                📋 <span className="font-bold">Informações do Pedido</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                {order.product.name} — {order.size}
              </div>
              <div className="text-xs text-gray-500">🛒 {new Date(order.createdAt).toLocaleString('pt-BR')}</div>
              <div className="text-xs text-gray-500">🚚 {new Date(order.deliveryDate).toLocaleString('pt-BR')}</div>
              {order.notes && (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 leading-relaxed">
                  {order.notes}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                👤 <span className="font-bold">Dados do Cliente</span>
              </div>
              <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
              <div className="text-sm text-gray-600">{order.customerPhone}</div>
              {order.customerEmail && (
                <div className="text-sm text-gray-600">{order.customerEmail}</div>
              )}
              
              <a href={`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>Contatar via WhatsApp</span>
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                ⚡ <span className="font-bold">Ações</span>
              </div>
              {saveSuccess && (
                <p className="text-green-600 text-sm font-medium text-center">✅ Status atualizado!</p>
              )}
              <button
                onClick={handleCancel}
                disabled={saving || order.status === 'CANCELLED'}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50"
              >
                Cancelar Pedido
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Status'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}