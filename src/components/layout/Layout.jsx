import React from 'react';
import Header from './Header'; // Убедись, что пути к файлам верные
import BottomNav from './BottomNav';

/**
 * @component Layout
 * @description Основная обертка приложения, собирающая Header, контент и BottomNav.
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Шапка сайта */}
      <Header />

      {/* Основной контент страницы */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Нижнее меню */}
      <BottomNav />
    </div>
  );
}