import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { apiFetch, BASE_URL } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl: string | null;
  flavor: string | null;
  size: string | null;
  occasion: string | null;
  available: boolean;
}

function resolveImage(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl;
  return `${BASE_URL}${imageUrl}`;
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<Product>(`/products/${id}`)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center text-gray-400">Carregando...</div>
      <Footer />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
        <p className="text-4xl">😕</p>
        <p>Produto não encontrado.</p>
        <button onClick={() => navigate('/catalogo')} className="text-pink-600 font-medium underline">
          Voltar ao catálogo
        </button>
      </div>
      <Footer />
    </div>
  );

  const src = resolveImage(product.imageUrl);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-8 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate('/catalogo')}
          className="text-pink-600 hover:text-pink-700 font-medium text-sm mb-6 flex items-center gap-2"
        >
          <span>←</span>
          <span>Voltar ao catálogo</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
          {/* Imagem */}
          <div className="md:w-2/5 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center min-h-64 md:min-h-full">
            {src ? (
              <img src={src} alt={product.name} className="w-full h-full object-cover max-h-96 md:max-h-full" />
            ) : (
              <span className="text-8xl">🎂</span>
            )}
          </div>

          {/* Detalhes */}
          <div className="md:w-3/5 p-6 md:p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-pink-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-pink-600 mb-6">
                R$ {Number(product.price).toFixed(2).replace('.', ',')}
              </p>

              <p className="text-gray-600 text-base mb-8 leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.flavor && (
                  <div className="bg-pink-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-wide mb-1">Sabor</p>
                    <p className="text-gray-800 font-semibold">{product.flavor}</p>
                  </div>
                )}
                {product.size && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-1">Tamanho</p>
                    <p className="text-gray-800 font-semibold">{product.size}</p>
                  </div>
                )}
                {product.occasion && (
                  <div className="bg-pink-50 rounded-xl p-4 col-span-2">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-wide mb-1">Ocasião</p>
                    <p className="text-gray-800 font-semibold">{product.occasion}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate('/encomenda', { state: { productId: product.id } })}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              🎂 Encomendar este bolo
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
