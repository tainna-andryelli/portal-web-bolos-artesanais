import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <header className="hidden md:block bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/admin/produtos" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              🍰
            </div>
            <div>
              <div className="text-xl font-bold">Painel Administrativo</div>
              <div className="text-xs text-gray-300">Doce Encanto</div>
            </div>
          </Link>
          <nav className="flex gap-6 text-sm items-center">
            <Link
              to="/admin/produtos"
              className={`font-medium transition-colors ${
                isActive('/admin/produtos')
                  ? 'text-pink-400 font-bold'
                  : 'text-white hover:text-pink-300'
              }`}
            >
              Produtos
            </Link>
            <Link
              to="/admin/pedidos"
              className={`font-medium transition-colors ${
                isActive('/admin/pedidos')
                  ? 'text-pink-400 font-bold'
                  : 'text-white hover:text-pink-300'
              }`}
            >
              Pedidos
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <header className="md:hidden bg-gray-900 text-white relative z-40">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/admin/produtos" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">
              🍰
            </div>
            <div className="font-bold text-sm">Painel Administrativo</div>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            {menuOpen ? (
              <>
                <span className="w-5 h-0.5 bg-white block transform rotate-45 translate-y-2" />
                <span className="w-5 h-0.5 bg-white block opacity-0" />
                <span className="w-5 h-0.5 bg-white block transform -rotate-45 -translate-y-2" />
              </>
            ) : (
              <>
                <span className="w-5 h-0.5 bg-white block" />
                <span className="w-5 h-0.5 bg-white block" />
                <span className="w-5 h-0.5 bg-white block" />
              </>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute left-0 right-0 bg-white shadow-2xl border-t-2 border-pink-100 z-50">
            <nav className="flex flex-col">
              {[
                { label: 'Produtos', path: '/admin/produtos' },
                { label: 'Pedidos', path: '/admin/pedidos' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 font-medium border-b border-gray-100 text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-pink-50 text-pink-600 font-bold'
                      : 'text-pink-900 hover:bg-pink-50'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-5 py-4 font-medium text-red-600 hover:bg-red-50 text-sm w-full text-left"
              >
                Sair
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}