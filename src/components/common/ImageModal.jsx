import React from 'react';
import { X, Download } from 'lucide-react';

/**
 * @component ImageModal
 * @description Модальное окно для полноэкранного просмотра изображения.
 */
export default function ImageModal({ src, alt, onClose }) {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      <div className="relative max-w-[95vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <img 
          src={src} 
          alt={alt} 
          className="rounded-lg shadow-2xl object-contain max-h-[85vh] mx-auto"
        />
        <div className="absolute -bottom-10 left-0 right-0 text-center text-white/80 text-sm font-medium">
          {alt}
        </div>
      </div>
    </div>
  );
}