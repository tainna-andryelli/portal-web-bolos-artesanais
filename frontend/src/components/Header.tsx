import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="hidden md:block bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
              🍰
            </div>
            <div>
              <div className="text-xl font-bold">Doce Encanto</div>
              <div className="text-xs text-pink-100">Bolos Artesanais</div>
            </div>
          </Link>
          <nav className="flex gap-6 text-sm items-center">
            <Link to="/" className="hover:text-pink-200 font-medium transition-colors">Home</Link>
            <Link to="/catalogo" className="hover:text-pink-200 font-medium transition-colors">Catálogo</Link>
            <Link to="/encomenda" className="bg-white text-pink-600 px-6 py-2 rounded-full font-bold hover:bg-pink-50 transition-all hover:shadow-lg">
              Encomendar
            </Link>
            <Link to="/login" className="text-pink-200 hover:text-white text-xs transition-colors">
              Área Admin
            </Link>
          </nav>
        </div>
      </header>

      <header className="md:hidden bg-gradient-to-r from-pink-600 to-purple-600 text-white relative z-40">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">
              🍰
            </div>
            <div className="font-bold text-sm">Doce Encanto</div>
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
                { label: 'Home', icon: '🏠', path: '/' },
                { label: 'Catálogo', icon: '🍰', path: '/catalogo' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 text-pink-900 font-medium border-b border-gray-100 text-sm hover:bg-pink-50 transition-colors"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="p-4 space-y-3">
                <Link
                  to="/encomenda"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-bold text-sm shadow-md text-center"
                >
                  🎂 Encomendar Agora
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                >
                  Área Admin
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}