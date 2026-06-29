import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminHeader } from '../components/AdminHeader';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { apiFetch } from '../services/api';
import { BASE_URL } from '../services/api';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  flavor: string;
  size: string;
  occasion: string;
  imageUrl: string;
}

const FLAVORS = ['Chocolate', 'Baunilha', 'Morango', 'Red Velvet', 'Limão', 'Ninho'];
const SIZES = ['Pequeno', 'Médio', 'Grande'];
const OCCASIONS = ['Aniversário', 'Casamento', 'Batizado', 'Corporativo'];

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    flavor: '',
    size: 'Médio',
    occasion: '',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(isEditing);

  // Se estiver editando, carrega os dados do produto
  useEffect(() => {
    if (!isEditing) return;

    apiFetch<ProductFormData & { id: string }>(`/products/${id}`)
      .then((data) => {
        setFormData({
          name: data.name,
          description: data.description,
          price: Number(data.price),
          flavor: data.flavor ?? '',
          size: data.size ?? 'Médio',
          occasion: data.occasion ?? '',
          imageUrl: data.imageUrl ?? '',
        });
        if (data.imageUrl) setImagePreview(`${BASE_URL}${data.imageUrl}`);
      })
      .catch(() => setSubmitError('Erro ao carregar produto.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local imediato
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload real para o backend
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Erro no upload');

      const { imageUrl } = await response.json() as { imageUrl: string };
      setFormData((prev) => ({ ...prev, imageUrl }));
    } catch {
      setSubmitError('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.imageUrl && !isEditing) {
      setSubmitError('Aguarde o upload da imagem antes de salvar.');
      return;
    }

    setSubmitting(true);

    try {
      const body = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        flavor: formData.flavor || undefined,
        size: formData.size || undefined,
        occasion: formData.occasion || undefined,
        imageUrl: formData.imageUrl || undefined,
      };

      if (isEditing) {
        await apiFetch(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }

      navigate('/admin/produtos');
    } catch (err: unknown) {
      const msg = (err as { error?: string })?.error || 'Erro ao salvar produto.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminHeader />
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Carregando produto...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin/produtos')}
              className="text-pink-600 hover:text-pink-700 font-medium text-sm mb-4 flex items-center gap-2"
            >
              <span>←</span>
              <span>Voltar para lista de produtos</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-pink-900">
              {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Bolo Red Velvet"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-2">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o produto..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-bold text-gray-800 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="flavor" className="block text-sm font-bold text-gray-800 mb-2">
                    Sabor
                  </label>
                  <select
                    id="flavor"
                    name="flavor"
                    value={formData.flavor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    {FLAVORS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="size" className="block text-sm font-bold text-gray-800 mb-2">
                    Tamanho
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="occasion" className="block text-sm font-bold text-gray-800 mb-2">
                    Ocasião
                  </label>
                  <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="imageFile" className="block text-sm font-bold text-gray-800 mb-2">
                  Imagem do Produto {!isEditing && '*'}
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 file:cursor-pointer"
                />
                {uploading && (
                  <p className="text-sm text-pink-600 mt-1">Fazendo upload da imagem...</p>
                )}
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wide">
                  Pré-visualização
                </p>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-xs mx-auto">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 h-40 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="text-5xl mb-2">📷</div>
                        <div className="text-xs">Selecione uma imagem</div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 truncate">
                      {formData.name || 'Nome do Produto'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {formData.description || 'Descrição do produto'}
                    </p>
                    <div className="text-xl font-bold text-pink-600">
                      R$ {formData.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-sm text-red-700 font-medium">
                  ⚠️ {submitError}
                </div>
              )}

              <div className="flex flex-col-reverse md:flex-row gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/produtos')}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <Button type="submit" fullWidth className="flex-1" disabled={submitting || uploading}>
                  {submitting ? 'Salvando...' : isEditing ? '💾 Salvar Alterações' : '✨ Adicionar Produto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}