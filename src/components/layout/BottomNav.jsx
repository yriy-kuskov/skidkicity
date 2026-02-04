import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ScanLine } from 'lucide-react';

/**
 * @component BottomNav
 * @description Нижнее меню навигации для мобильных устройств.
 */
export default function BottomNav() {
  const location = useLocation();

  // Функция для проверки активного пути (чтобы подсвечивать иконку)
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
              isActive('/') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Главная</span>
          </Link>

          <Link
            to="/admin"
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
              isActive('/admin') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <ScanLine className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Админ</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}