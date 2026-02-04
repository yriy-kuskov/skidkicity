import React from 'react';

/**
 * @component Header
 * @description Верхняя панель приложения. Зафиксирована при скролле (sticky).
 */
export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <span>🏷️</span> Скидки Города
        </h1>
      </div>
    </header>
  );
}