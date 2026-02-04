import { useState, useEffect } from 'react';
import { uploadImage } from '../../lib/api'; // Общая функция загрузки
import { fetchCategories, ensureCategory } from '../../lib/api/categories'; // Категории
import { createProduct } from '../../lib/api/products'; // Продукты
import { Upload, Loader2, Package, Plus, X, Search } from 'lucide-react'; // Добавили Search

/**
 * @component ProductForm
 * @description Шаг 1: Создание ТОВАРА с динамическими категориями из БД.
 */
export default function ProductForm({ barcode, initialData, onCreated, onCancel }) {
  const [name, setName] = useState(initialData?.name || '');
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Загружаем категории при старте
  useEffect(() => {
    async function load() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCatId(cats[0].id);
        } else {
          setIsAddingNew(true);
        }
      } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
  // Пример необязательной, но полезной проверки:
  if (imageFile) {
    if (!imageFile.type.startsWith('image/')) {
      alert("Пожалуйста, выберите корректный файл изображения.");
      return;
    }
    if (imageFile.size > 5 * 1024 * 1024) { // 5MB
      alert("Файл слишком большой. Максимум 5МБ.");
      return;
    }
  }

  setLoading(true);
    
    try {
      let catId = selectedCatId;
      
      // Если создаем новую категорию
      if (isAddingNew && newCategoryName.trim()) {
        catId = await ensureCategory(newCategoryName.trim());
      }

      let imageUrl = initialData?.image || '';
      
      // Загрузка фото ТОВАРА (твой оригинальный блок)
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'products', barcode);
      }

      const product = await createProduct({
        barcode,
        name,
        category_id: catId, // Используем ID для связи
        image_url: imageUrl
      });
      
      onCreated(product); 
    } catch (err) {
      alert("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Функции для внешнего поиска
  const searchGoogle = () => {
    window.open(`https://www.google.com/search?q=${barcode}`, '_blank');
  };

  const searchYandex = () => {
    window.open(`https://yandex.ru/search/?text=${barcode}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          <h3 className="font-black uppercase text-sm tracking-wider">Шаг 1: Создание товара</h3>
        </div>
        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">BC: {barcode}</span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Название */}
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">
            Название продукта
          </label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            placeholder="Напр: Молоко Домик в деревне..."
            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all" 
          />

          {/* Кнопки быстрого поиска информации */}
          <div className="flex gap-2 mt-2">
            <button 
              type="button"
              onClick={searchYandex}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
            >
              <Search size={12} /> Найти в Яндекс
            </button>
            <button 
              type="button"
              onClick={searchGoogle}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors"
            >
              <Search size={12} /> Найти в Google
            </button>
          </div>
        </div>

        {/* Категория с твоим новым функционалом */}
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-1.5 ml-1">
            Категория
          </label>
          {!isAddingNew ? (
            <div className="flex gap-2">
              <select 
                value={selectedCatId} 
                onChange={e => setSelectedCatId(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => setIsAddingNew(true)}
                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-primary hover:text-white transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                placeholder="Новая категория..."
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border-2 border-primary rounded-xl outline-none shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                autoFocus
              />
              {categories.length > 0 && (
                <button 
                  type="button" 
                  onClick={() => setIsAddingNew(false)}
                  className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Загрузка фото (твой оригинальный дизайн) */}
        <div className="p-5 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 group hover:border-primary/30 transition-colors">
          <label className="block text-xs font-black uppercase text-gray-400 mb-3 text-center">
            Фото упаковки
          </label>
          <div className="relative pointer-events-none mb-2">
             <Upload className="w-8 h-8 mx-auto text-gray-300 group-hover:text-primary transition-colors" />
          </div>
          <input 
            type="file" 
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])} 
            className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary file:text-white hover:file:bg-primary/80" 
          />
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3 pt-2">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 px-4 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-colors uppercase text-xs tracking-widest"
          >
            Отмена
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="flex-[2] px-4 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Далее к цене'}
          </button>
        </div>
      </form>
    </div>
  );
}