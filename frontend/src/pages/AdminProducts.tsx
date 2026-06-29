import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from '../components/AdminHeader';
import { Footer } from '../components/Footer';
import { apiFetch } from '../services/api';
import { BASE_URL } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl: string | null;
  available: boolean;
}

export function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    apiFetch<Product[]>('/products')
      .then((data) => {
        setProducts(data);
        setFiltered(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      ),
    );
  }, [searchTerm, products]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const msg = (err as { error?: string })?.error || 'Erro ao excluir produto.';
      alert(msg);
    }
  }

  async function handleToggleAvailable(id: string, current: boolean) {
    try {
      const updated = await apiFetch<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ available: !current }),
      });
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch {
      alert('Erro ao atualizar produto. Tente novamente.');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-pink-900">Gerenciar Produtos</h1>
              <p className="text-gray-600 text-sm mt-1">
                {loading ? 'Carregando...' : `${filtered.length} produto${filtered.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/produtos/novo')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm md:text-base whitespace-nowrap"
            >
              + Adicionar Novo Produto
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou descrição..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {loading && (
            <p className="text-center text-gray-400 py-20">Carregando produtos...</p>
          )}

          {error && (
            <p className="text-center text-red-400 py-20">Erro ao carregar produtos. Tente novamente.</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-gray-400 py-20">Nenhum produto encontrado.</p>
          )}

          {/* Desktop */}
          {!loading && !error && filtered.length > 0 && (
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {filtered.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 h-40 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img src={`${BASE_URL}${product.imageUrl}`} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">🎂</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-1 line-clamp-2">{product.description}</p>
                    <div className="text-xl font-bold text-pink-600 mb-1">
                      R$ {Number(product.price).toFixed(2)}
                    </div>
                    <div className="mb-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.available ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/produtos/${product.id}/editar`)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleToggleAvailable(product.id, product.available)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors text-sm"
                        title={product.available ? 'Desativar' : 'Ativar'}
                      >
                        {product.available ? '👁️' : '🚫'}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile */}
          {!loading && !error && filtered.length > 0 && (
            <div className="md:hidden space-y-4 mb-6">
              {filtered.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <img src={`${BASE_URL}${product.imageUrl}`} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">🎂</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                      <div className="text-lg font-bold text-pink-600 mb-1">
                        R$ {Number(product.price).toFixed(2)}
                      </div>
                      <div className="mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {product.available ? 'Disponível' : 'Indisponível'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/produtos/${product.id}/editar`)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleAvailable(product.id, product.available)}
                          className="bg-gray-200 p-1.5 rounded-lg text-sm"
                          title={product.available ? 'Desativar' : 'Ativar'}
                        >
                          {product.available ? '👁️' : '🚫'}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="bg-red-100 text-red-600 p-1.5 rounded-lg text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
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