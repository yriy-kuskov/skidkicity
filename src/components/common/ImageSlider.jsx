import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @component ImageSlider
 * @description Универсальный слайдер с поддержкой свайпов для мобильных устройств.
 */
export default function ImageSlider({ images = [], alt = "Изображение" }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Порог для свайпа в пикселях
  const minSwipeDistance = 50;

  const validImages = images.filter(img => !!img);
  const displayImages = validImages.length > 0 ? validImages : ['/images/placeholder.png'];

  const next = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setCurrent((prev) => (prev + 1) % displayImages.length);
  };

  const prev = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setCurrent((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  // Логика свайпа
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
  };

  return (
    <div 
      className="relative w-full h-full group/slider overflow-hidden touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={displayImages[current]}
        alt={`${alt} - фото ${current + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
      />
      
      {/* Стрелки (скрыты на мобилках, если не наведен курсор) */}
      {displayImages.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/slider:opacity-100 transition-opacity hidden md:flex">
            <button onClick={prev} className="bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Индикаторы */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
            {displayImages.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === current ? 'bg-primary' : 'bg-white/60'}`} 
              />
            ))}
          </div>
        </>
      )}

      {/* Бейдж типа фото */}
      {validImages.length > 1 && (
        <div className="absolute top-2 left-2 bg-black/50 text-[8px] text-white px-1.5 py-0.5 rounded uppercase font-bold backdrop-blur-sm pointer-events-none">
          {current === 0 ? 'Товар' : 'Ценник'}
        </div>
      )}
    </div>
  );
}