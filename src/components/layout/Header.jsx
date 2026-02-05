import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * @component Header
 * @description Верхняя панель приложения. Зафиксирована при скролле (sticky).
 */
export default function Header() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      {/* Контейнер с ограничением ширины и центрированием */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Логотип */}
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <span>🏷️</span> 
            <span className="xs:inline">Скидки Города</span>
          </h1>
        </Link>

        {/* Блок авторизации */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Информация о пользователе (скрывается на совсем маленьких экранах) */}
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {profile?.full_name || 'Пользователь'}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  {profile?.role || 'user'}
                </p>
              </div>
              
              {/* Аватар-заглушка или иконка профиля */}
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                <User className="w-5 h-5" />
              </div>

              {/* Разделитель */}
              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              {/* Кнопка выхода */}
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                title="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Войти</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}