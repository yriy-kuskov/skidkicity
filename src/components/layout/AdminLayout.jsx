// src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Чтобы знать текущий путь
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Закрываем меню при клике на ссылку (для мобильных)
  const handleNavigation = () => {
    setIsSidebarOpen(false);
  };

  const menuItems = [
    { name: 'Дашборд', path: '/admin', icon: '📊' },
    { name: 'Типы скидок', path: '/admin/deal-types', icon: '🏷️' },
    { name: 'Магазины', path: '/admin/stores', icon: '🏪' },
    { name: 'Товары', path: '/admin/products', icon: '📦' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* --- МОБИЛЬНЫЙ ОВЕРЛЕЙ (Затемнение) --- */}
      {/* Показываем только если меню открыто и мы на мобильном */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- САЙДБАР (Боковое меню) --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col
          lg:static lg:translate-x-0 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Логотип и заголовок */}
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-indigo-400">CakeReact</h2>
            <p className="text-xs text-slate-400 mt-1">Панель управления</p>
          </div>
          {/* Кнопка закрытия (крестик) только для мобильных */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Подвал меню */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <span className="mr-3">🏠</span> На сайт
          </Link>
          <button
            onClick={() => { signOut(); navigate('/'); }}
            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span> Выйти
          </button>
        </div>
      </aside>

      {/* --- ОСНОВНАЯ ОБЛАСТЬ КОНТЕНТА --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Шапка контента (Верхняя панель) */}
        <header className="bg-white shadow-sm z-10 py-4 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center">
            {/* Кнопка ГАМБУРГЕР (только на мобильных) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
            >
              {/* Иконка меню (3 полоски) */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800 truncate">
              Администрирование
            </h2>
          </div>

          <div className="hidden sm:flex items-center text-sm text-gray-500">
            <span className="mr-2">Статус:</span>
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Подключено
          </div>
        </header>

        {/* Область скролла для страниц */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}