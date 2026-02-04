import React, { useState } from 'react';
import { SearchX, WifiOff, AlertCircle, ShoppingBag, RotateCcw, Clock, Zap, HelpCircle } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

export default function StatusState({ 
  type, 
  onAction, 
  onSecondaryAction, 
  errorMessage,
  overrides = {},
  isLiteMode // Принимаем статус режима
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultConfigs = {
    empty: {
      icon: <ShoppingBag className="w-12 h-12 text-gray-300" />,
      title: "Здесь пока пусто",
      description: "Мы скоро добавим что-нибудь интересное.",
    },
    no_results: {
      icon: <SearchX className="w-12 h-12 text-gray-300" />,
      title: "Ничего не нашлось",
      description: "Попробуйте изменить параметры поиска или фильтры.",
      primaryBtn: { label: "Сбросить всё", icon: <RotateCcw className="w-4 h-4" /> }
    },
    error: {
      icon: <AlertCircle className="w-12 h-12 text-red-200" />,
      title: "Ошибка загрузки",
      description: errorMessage || "Произошла техническая ошибка.",
      primaryBtn: { label: "Повторить", icon: <RotateCcw className="w-4 h-4" /> }
    },
    offline: {
      icon: <WifiOff className="w-12 h-12 text-gray-300" />,
      title: "Нет связи",
      description: "Проверьте подключение к интернету.",
      primaryBtn: { label: "Обновить", icon: <RotateCcw className="w-4 h-4" /> }
    },
    slow_connection: {
      icon: <Clock className={`w-12 h-12 text-orange-200 ${!isLiteMode && 'animate-pulse'}`} />,
      title: isLiteMode ? "Всё еще медленно..." : "Медленный интернет",
      description: isLiteMode 
        ? "Вы используете Lite-режим. Данные грузятся без картинок для ускорения." 
        : "Загрузка затянулась. Хотите подождать или включить Lite-режим?",
      primaryBtn: { 
        label: isLiteMode ? "Вернуть картинки" : "Буду ждать", 
        icon: isLiteMode ? <Zap className="w-4 h-4 fill-current" /> : <Clock className="w-4 h-4" /> 
      },
      secondaryBtn: { 
        label: isLiteMode ? "Lite-режим активен" : "Lite-режим", 
        icon: <Zap className="w-4 h-4" />,
        disabled: isLiteMode
      }
    }
  };

  const base = defaultConfigs[type] || defaultConfigs.empty;
  const config = { ...base, ...overrides };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="mb-4 p-4 bg-gray-50 rounded-full relative">
        {config.icon}
        {type === 'slow_connection' && (
          <div className="absolute -top-1 -right-1">
            <InfoTooltip 
              title="Lite-режим (Экономия)" 
              content="Отключает загрузку всех изображений. Это позволяет получать информацию о ценах и скидках даже при очень слабом интернете." 
            />
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">{config.description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {config.primaryBtn && onAction && (
          <button onClick={onAction} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium shadow-lg hover:bg-gray-800 active:scale-95 transition-all">
            {config.primaryBtn.icon} {config.primaryBtn.label}
          </button>
        )}
        {config.secondaryBtn && onSecondaryAction && (
          <button 
            onClick={onSecondaryAction} 
            disabled={config.secondaryBtn.disabled}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              config.secondaryBtn.disabled 
                ? 'bg-gray-100 text-gray-400 cursor-default opacity-70' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95'
            }`}
          >
            {config.secondaryBtn.icon} {config.secondaryBtn.label}
          </button>
        )}
      </div>
    </div>
  );
}