import { Link, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth.js';

export default function Navbar() {
  const user = getUser();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/map', label: 'Карта мира' },
    { path: '/wars', label: 'Войны' },
    { path: '/market', label: 'Рынок' },
    { path: '/storage', label: 'Склад' },
    { path: '/news', label: 'Статьи' }
  ];

  return (
    <div className="w-full bg-gray-800 text-white shadow-md">
      {/* Верхний логотип по центру */}
      <div className="w-full h-24 flex items-center justify-center bg-gray-800">
        <img src="/assets/logo.png" alt="Логотип" className="h-full object-contain" />
    </div>

      {/* Навбар основного уровня */}
      <nav className="w-full px-4 py-3 overflow-x-auto whitespace-nowrap">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between max-w-7xl mx-auto">
          {/* Ссылки на разделы */}
          <div className="flex gap-4 items-center overflow-x-auto scrollbar-none pb-2 lg:pb-0">
            <div className="min-w-[2rem] h-8 w-8 bg-blue-500 rounded flex items-center justify-center font-bold text-sm shrink-0">
              P
            </div>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 hover:text-blue-400 transition ${
                  location.pathname === item.path ? 'text-blue-400' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Информация о пользователе */}
          <div className="flex items-center gap-4 mt-2 lg:mt-0 shrink-0">
            <span className="text-sm text-gray-300 whitespace-nowrap">Игрок: {user.username}</span>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition whitespace-nowrap"
            >
              Выход
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
