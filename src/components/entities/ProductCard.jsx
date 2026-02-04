import React, { useState } from 'react';
import { Tag, Barcode, ExternalLink } from 'lucide-react';
import ImageSlider from '../common/ImageSlider';

export default function ProductCard({ item, actions, liteMode }) {
  const [showBarcode, setShowBarcode] = useState(false);
  const isDeal = item.newPrice !== undefined;
  const hasBarcode = !!item.barcode_image_url;

  const productImages = [item.image_url, item.proof_image_url];

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative border border-gray-100 flex flex-col h-full">
      
      {/* 1. Блок изображений */}
      {!liteMode && (
        <div className="relative h-52 bg-gray-50">
          <ImageSlider images={productImages} alt={item.name} />
          {isDeal && item.discount > 0 && (
            <div className="absolute top-3 right-3 z-10 bg-primary text-white font-black w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-sm border-2 border-white transform rotate-12 group-hover:rotate-0 transition-all">
              -{item.discount}%
            </div>
          )}
        </div>
      )}

      {/* 2. Основной контент */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center gap-1.5 text-[10px] text-primary mb-2 uppercase font-black tracking-widest">
            <Tag className="w-3 h-3" />
            {item.category || 'Разное'}
          </div>

          <h3 className={`font-bold text-gray-800 mb-3 leading-snug group-hover:text-primary transition-colors ${liteMode ? 'text-lg' : 'line-clamp-2 h-12 text-base'}`}>
            {item.name}
          </h3>

          {isDeal ? (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gray-900 font-black text-2xl tracking-tight">
                {Number(item.newPrice).toLocaleString('ru-RU')} ₽
              </span>
              {item.oldPrice && !liteMode && (
                <span className="text-gray-400 line-through text-sm decoration-red-400/50">
                  {Number(item.oldPrice).toLocaleString('ru-RU')} ₽
                </span>
              )}
            </div>
          ) : (
            <div className="mb-4 text-sm text-gray-400 italic">Цена по запросу</div>
          )}
        </div>

        {/* 3. Футер с магазином и Умной кнопкой ШК */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg text-[11px]">
            <span className="text-lg leading-none">{item.store?.logo || '🏪'}</span>
            <span className="font-bold text-gray-700">{item.store?.name}</span>
          </div>
          
          <button 
            onClick={() => hasBarcode && setShowBarcode(!showBarcode)}
            disabled={!hasBarcode}
            title={hasBarcode ? "Показать штрих-код" : "Штрих-код отсутствует"}
            className={`transition-all duration-200 p-2 rounded-lg ${
              hasBarcode 
                ? 'text-gray-400 hover:text-primary hover:bg-primary/5 active:scale-90' 
                : 'text-gray-200 cursor-not-allowed opacity-50'
            }`}
          >
            <Barcode size={20} />
          </button>
        </div>

        {/* 4. Раскрывающийся блок штрих-кода */}
        {showBarcode && hasBarcode && !liteMode && (
          <div className="mt-4 p-3 bg-white border-2 border-dashed border-gray-100 rounded-2xl animate-in zoom-in-95 duration-200">
            <img 
              src={item.barcode_image_url} 
              alt="Barcode" 
              className="w-full h-auto mix-blend-multiply" 
            />
          </div>
        )}

        {/* 5. Кнопка "Подробнее" — всегда в самом низу */}
        <button className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl text-gray-600 font-bold text-sm transition-all hover:bg-gray-900 hover:text-white hover:border-gray-900 active:scale-[0.98]">
          Подробнее
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}