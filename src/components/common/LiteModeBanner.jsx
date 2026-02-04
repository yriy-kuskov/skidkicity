import React from 'react';
import { Zap } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

export default function LiteModeBanner({ onDisable }) {
  return (
    <div className="mb-4 flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-2xl animate-in slide-in-from-top-2">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
          <Zap size={14} className="fill-current" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-primary uppercase tracking-tight">Lite-режим активен</span>
          <InfoTooltip 
            title="Lite-режим (Экономия)" 
            content="Изображения отключены для ускорения работы. Это экономит до 90% трафика и помогает при слабом интернете."
          />
        </div>
      </div>
      <button 
        onClick={onDisable}
        className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 transition-colors"
      >
        Выключить
      </button>
    </div>
  );
}