import React from 'react';
import ProductCard from './ProductCard';

export default function DataGrid({ items, renderActions, liteMode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <ProductCard 
          key={item.id} 
          item={item} 
          liteMode={liteMode} // Передаем флаг
          actions={renderActions ? renderActions(item) : null} 
        />
      ))}
    </div>
  );
}