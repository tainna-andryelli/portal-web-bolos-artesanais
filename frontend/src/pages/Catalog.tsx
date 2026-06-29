import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { apiFetch } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  flavor: string | null;
  size: string | null;
  available: boolean;
}

const FLAVORS = ['Chocolate', 'Baunilha', 'Morango', 'Red Velvet', 'Limão'];
const SIZES = ['Pequeno', 'Médio', 'Grande'];

export function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filtros ativos (dispararam a busca)
  const [flavor, setFlavor] = useState('');
  const [size, setSize] = useState('');

  // Filtros pendentes no mobile (só aplicam ao clicar em Aplicar)
  const [pendingFlavor, setPendingFlavor] = useState('');
  const [pendingSize, setPendingSize] = useState('');

  const fetchProducts = useCallback((f: string, s: string) => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams();
    if (f) params.set('flavor', f);
    if (s) params.set('size', s);
    const query = params.toString() ? `?${params.toString()}` : '';

    apiFetch<Product[]>(`/products${query}`)
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts(flavor, size);
  }, [flavor, size, fetchProducts]);

  function clearFilters() {
    setFlavor('');
    setSize('');
    setPendingFlavor('');
    setPendingSize('');
    setFiltersOpen(false);
  }

  function applyMobileFilters() {
    setFlavor(pendingFlavor);
    setSize(pendingSize);
    setFiltersOpen(false);
  }

  const hasActiveFilters = flavor || size;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50">
        <div className="px-4 md:px-6 lg:px-8 py-6">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-pink-900">Nosso Catálogo</h1>
              <p className="text-gray-600 mt-1">
                {loading ? 'Carregando...' : `${products.length} produto${products.length !== 1 ? 's' : ''} disponível${products.length !== 1 ? 'is' : ''}`}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-pink-600 font-medium underline underline-offset-2"
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="md:hidden mb-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                filtersOpen ? 'bg-purple-700 text-white' : 'bg-pink-600 text-white'
              }`}
            >
              <span>⚙️</span>
              <span>Filtros{hasActiveFilters ? ' ●' : ''}</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Desktop */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow p-6 sticky top-6">
                <h3 className="text-lg font-bold text-pink-900 mb-4">Filtros</h3>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-sm">Sabor</h4>
                  <div className="space-y-2">
                    {FLAVORS.map((f) => (
                      <label key={f} className="flex items-center gap-2 cursor-pointer hover:text-pink-600">
                        <input
                          type="radio"
                          name="flavor"
                          checked={flavor === f}
                          onChange={() => setFlavor(flavor === f ? '' : f)}
                          className="w-4 h-4 text-pink-600"
                        />
                        <span className="text-sm">{f}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-sm">Tamanho</h4>
                  <div className="space-y-2">
                    {SIZES.map((s) => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-pink-600">
                        <input
                          type="radio"
                          name="size"
                          checked={size === s}
                          onChange={() => setSize(size === s ? '' : s)}
                          className="w-4 h-4 text-pink-600"
                        />
                        <span className="text-sm">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-300 font-medium"
                >
                  Limpar Filtros
                </button>
              </div>
            </aside>

            {/* Painel Mobile */}
            {filtersOpen && (
              <div className="md:hidden bg-white rounded-xl shadow p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-pink-900">Filtrar por</span>
                  <button onClick={() => setFiltersOpen(false)} className="text-gray-400 text-lg">✕</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sabor</p>
                    <div className="flex gap-2 flex-wrap">
                      {FLAVORS.map((f) => (
                        <button
                          key={f}
                          onClick={() => setPendingFlavor(pendingFlavor === f ? '' : f)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            pendingFlavor === f
                              ? 'bg-pink-600 text-white border-pink-600'
                              : 'bg-pink-50 border-pink-200 text-pink-800 hover:bg-pink-100'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tamanho</p>
                    <div className="grid grid-cols-3 gap-2">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setPendingSize(pendingSize === s ? '' : s)}
                          className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                            pendingSize === s
                              ? 'bg-pink-600 text-white border-pink-600'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-pink-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={applyMobileFilters}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl text-sm font-bold"
                    >
                      Aplicar
                    </button>
                    <button
                      onClick={clearFilters}
                      className="px-4 border-2 border-gray-300 rounded-xl text-sm text-gray-600 font-medium"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid de Produtos */}
            <main className="flex-1">
              {loading && (
                <p className="text-center text-gray-400 py-20">Carregando produtos...</p>
              )}
              {error && (
                <p className="text-center text-red-400 py-20">
                  Erro ao carregar produtos. Tente novamente.
                </p>
              )}
              {!loading && !error && products.length === 0 && (
                <div className="text-center text-gray-400 py-20">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="font-medium">Nenhum produto encontrado com esses filtros.</p>
                  <button onClick={clearFilters} className="mt-3 text-pink-600 text-sm font-medium underline">
                    Limpar filtros
                  </button>
                </div>
              )}
              {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onOrder={() => navigate('/encomenda')}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}