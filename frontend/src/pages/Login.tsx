import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../services/api';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login();
      navigate('/admin/produtos');
    } catch (err: unknown) {
      const msg = (err as { error?: string })?.error || 'E-mail ou senha incorretos';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-pink-600 to-purple-600 p-8 md:p-12 flex flex-col items-center justify-center md:w-1/3 lg:w-2/5">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center text-4xl md:text-5xl mb-4">
            🍰
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Doce Encanto</h1>
          <p className="text-pink-100 text-sm mt-2 text-center">Bolos Artesanais</p>
        </div>

        <div className="p-8 md:p-12 flex-1">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bem-vinda de volta!</h2>
            <p className="text-gray-600 text-sm mb-8">Entre com suas credenciais para acessar o painel</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bolos.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-sm text-red-700 font-medium">
                  ⚠️ {error}
                </div>
              )}

              <Button type="submit" fullWidth size="lg" disabled={loading}>
                {loading ? 'Entrando...' : '🔓 Entrar no Painel'}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <span>🌐</span>
                  <span>Voltar ao site público</span>
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              🔒 Conexão segura SSL • Doce Encanto 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}