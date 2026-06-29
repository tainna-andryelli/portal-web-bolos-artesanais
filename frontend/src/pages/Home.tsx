import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { apiFetch } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
}

export function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<Product[]>('/products')
      .then((data) => setFeatured(data.slice(0, 3)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 px-4 md:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-5xl md:text-6xl mb-4">🍰</div>
          <h1 className="text-3xl md:text-5xl font-bold text-pink-900 mb-4 leading-tight">
            Bolos Artesanais
          </h1>
          <p className="text-base md:text-xl text-pink-700 mb-8 max-w-2xl mx-auto">
            Feitos com carinho e ingredientes selecionados para tornar sua ocasião especial ainda mais doce
          </p>
          <Button size="lg" onClick={() => navigate('/catalogo')}>
            Ver Catálogo Completo
          </Button>
        </div>
      </section>

      <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 bg-white">
        <div className="max-w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-pink-900 mb-8 flex items-center justify-center gap-2">
            <span>✨</span> Destaques da Semana
          </h2>

          {loading && (
            <p className="text-center text-gray-400 py-12">Carregando produtos...</p>
          )}

          {error && (
            <p className="text-center text-red-400 py-12">
              Não foi possível carregar os produtos. Tente novamente mais tarde.
            </p>
          )}

          {!loading && !error && featured.length === 0 && (
            <p className="text-center text-gray-400 py-12">
              Nenhum produto disponível no momento.
            </p>
          )}

          {!loading && !error && featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onOrder={() => navigate('/encomenda')}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 md:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para fazer seu pedido?
          </h2>
          <p className="text-pink-100 mb-8 text-base md:text-lg">
            Entre em contato conosco e encomende o bolo perfeito para sua ocasião
          </p>
          <Button variant="secondary" size="lg" onClick={() => navigate('/encomenda')}>
            Fazer Encomenda
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}