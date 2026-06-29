import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { apiFetch } from '../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderResponse {
  orderNumber: number;
  productName: string;
  deliveryDate: string;
}

interface FormData {
  productId: string;
  size: string;
  deliveryDate: string;
  deliveryTime: string;
  observations: string;
  name: string;
  phone: string;
  email: string;
  gdprConsent: boolean;
}

export function Order() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    productId: '',
    size: '',
    deliveryDate: '',
    deliveryTime: '',
    observations: '',
    name: '',
    phone: '',
    email: '',
    gdprConsent: false,
  });

  useEffect(() => {
    apiFetch<Product[]>('/products')
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.productId || !formData.size || !formData.deliveryDate || !formData.name || !formData.phone || !formData.gdprConsent) {
      setSubmitError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Combina data + hora em ISO datetime (obrigatório pelo schema Zod do backend)
    const time = formData.deliveryTime || '12:00';
    const deliveryDate = new Date(`${formData.deliveryDate}T${time}:00`).toISOString();

    setSubmitting(true);
    setSubmitError('');

    try {
      const data = await apiFetch<OrderResponse>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          productId: formData.productId,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email || undefined,
          size: formData.size,
          deliveryDate,
          notes: formData.observations || undefined,
        }),
      });

      navigate(`/confirmacao/${data.orderNumber}`, {
        state: {
          orderNumber: data.orderNumber,
          productName: data.productName,
          deliveryDate: data.deliveryDate,
          customerName: formData.name,
          customerPhone: formData.phone,
          size: formData.size,
          deliveryTime: formData.deliveryTime,
        },
      });
    } catch (err: unknown) {
      const msg = (err as { error?: string })?.error || 'Erro ao enviar pedido. Tente novamente.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 md:px-6 lg:px-8 py-8 md:py-10 text-center">
        <div className="w-12 md:w-16 h-12 md:h-16 bg-white rounded-full flex items-center justify-center text-2xl md:text-3xl mx-auto mb-3">
          🍰
        </div>
        <h1 className="text-xl md:text-2xl font-bold mb-2">Fazer Encomenda</h1>
        <p className="text-pink-100 text-sm md:text-base">Preencha os dados abaixo para realizar seu pedido</p>
      </div>

      <div className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">

          <div>
            <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">
              Escolha o Bolo <span className="text-pink-600">*</span>
            </label>
            {loadingProducts ? (
              <div className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50">
                Carregando produtos...
              </div>
            ) : (
              <select
                value={formData.productId}
                onChange={(e) => handleChange('productId', e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:border-pink-500 focus:outline-none"
                required
              >
                <option value="">Selecione o bolo...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-3 text-sm md:text-base">
              Tamanho <span className="text-pink-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {[
                { size: 'Pequeno', diameter: '15cm', servings: '8-12' },
                { size: 'Médio', diameter: '20cm', servings: '15-20' },
                { size: 'Grande', diameter: '25cm', servings: '25-30' },
              ].map((option) => (
                <label
                  key={option.size}
                  className={`flex flex-col items-center p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
                    formData.size === option.size
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="size"
                    value={option.size}
                    checked={formData.size === option.size}
                    onChange={(e) => handleChange('size', e.target.value)}
                    className="mb-2"
                    required
                  />
                  <div className="font-bold text-pink-900 text-xs md:text-sm">{option.size}</div>
                  <div className="text-gray-600 text-xs">{option.diameter}</div>
                  <div className="text-gray-500 text-xs">{option.servings} fatias</div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">
                Data de Entrega <span className="text-pink-600">*</span>
              </label>
              <input
                type="date"
                min={today}
                value={formData.deliveryDate}
                onChange={(e) => handleChange('deliveryDate', e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:border-pink-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">
                Horário Preferencial
              </label>
              <input
                type="time"
                value={formData.deliveryTime}
                onChange={(e) => handleChange('deliveryTime', e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">Observações</label>
            <textarea
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              rows={3}
              placeholder="Ex: decoração especial, mensagem no bolo, restrições alimentares..."
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:border-pink-500 focus:outline-none resize-none"
            />
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="font-bold text-pink-900 mb-4 text-base md:text-lg">Seus Dados</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">
                  Nome Completo <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:border-pink-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">
                  Telefone/WhatsApp <span className="text-pink-600">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(XX) X XXXX-XXXX"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:border-pink-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm md:text-base focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.gdprConsent}
                onChange={(e) => handleChange('gdprConsent', e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-600"
                required
              />
              <div className="text-sm">
                <div className="font-bold text-blue-900 mb-1">Concordo com o uso dos meus dados</div>
                <div className="text-blue-700">
                  Seus dados serão utilizados apenas para processamento e contato sobre seu pedido, conforme a LGPD.
                </div>
              </div>
            </label>
          </div>

          {submitError && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-sm text-red-700 font-medium">
              ⚠️ {submitError}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 md:py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <Button type="submit" size="lg" fullWidth className="flex-1" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Confirmar Pedido ✓'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}