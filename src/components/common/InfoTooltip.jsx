import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function InfoTooltip({ title, content, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children || <HelpCircle size={16} className="text-gray-400 hover:text-primary transition-colors" />}
      </div>
      
      {isVisible && (
        <div className="absolute bottom-full mb-2 right-0 w-64 p-3 bg-gray-900 text-white text-[11px] leading-relaxed rounded-xl shadow-xl z-50 text-left animate-in fade-in slide-in-from-bottom-1">
          {title && <p className="font-bold mb-1 text-primary-light">{title}</p>}
          {content}
        </div>
      )}
    </div>
  );
}