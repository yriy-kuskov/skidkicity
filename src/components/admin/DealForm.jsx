import { useState } from 'react'
import { uploadImage } from '../../lib/api'
import { createDeal } from '../../lib/api/deals' // Теперь скидки в своем файле
import { Loader2, Tag, Store, Package, Barcode, ZoomIn } from 'lucide-react'
import ImageSlider from '../common/ImageSlider'
import ImageModal from '../common/ImageModal'

/**
 * @component DealForm
 * @description Шаг 2: Создание СКИДКИ.
 */
export default function DealForm({ product, store, onFinished, onCancel }) {
  const [oldPrice, setOldPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let proofImageUrl = null;
      if (imageFile) {
        proofImageUrl = await uploadImage(imageFile, 'deals', product.id);
      }
      await createDeal({
        productId: product.id,
        storeId: store.id,
        oldPrice: parseFloat(oldPrice),
        newPrice: parseFloat(newPrice),
        imageUrl: proofImageUrl
      });
      onFinished();
    } catch (err) {
      alert("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      
      {/* ПРЕВЬЮ ТОВАРА */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6">
        <div className="relative h-56 bg-gray-50 group cursor-zoom-in" onClick={() => setIsModalOpen(true)}>
          <ImageSlider images={[product.image_url]} alt={product.name} />
          
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow-sm flex items-center gap-2 z-10">
            <Package size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-tight text-gray-700">Проверьте информацию о товаре</span>
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1.5 text-[10px] text-primary mb-1 uppercase font-black tracking-widest">
            <Tag className="w-3 h-3" />
            {product.categories.name || 'Разное'}
          </div>
          
          <h3 className="font-bold text-gray-800 text-xl leading-tight mb-4">
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <span className="text-xl leading-none">{store?.logo || '🏪'}</span>
              <span className="font-bold text-gray-800 text-xs">{store?.name}</span>
            </div>
            
            <div className="text-right">
              <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Штрих-код</span>
              <div className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                <Barcode size={14} className="text-gray-500" />
                <span className="font-mono font-black text-sm">{product.barcode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ФОРМА ДОБАВЛЕНИЯ СКИДКИ */}
      <div className="bg-white rounded-2xl shadow-xl border-t-4 border-t-green-500 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Добавление скидки</h2>
          <p className="text-sm text-gray-500 font-medium">Заполните данные для публикации предложения</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Старая цена</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.01" 
                  value={oldPrice} 
                  onChange={e => setOldPrice(e.target.value)} 
                  required 
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-300" 
                  placeholder="0.00" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₽</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-primary mb-2">Цена со скидкой</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.01" 
                  value={newPrice} 
                  onChange={e => setNewPrice(e.target.value)} 
                  required 
                  className="w-full pl-4 pr-10 py-3 bg-white border-2 border-primary rounded-xl outline-none focus:ring-4 focus:ring-primary/10 font-black text-xl text-primary" 
                  placeholder="0.00" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">₽</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-green-50/50 rounded-2xl border-2 border-dashed border-green-200 hover:bg-green-50 transition-colors group">
            <label className="block text-xs font-bold uppercase text-green-700 mb-3 text-center tracking-widest">
              Загрузить фото ценника
            </label>
            <input 
              type="file" 
              accept="image/*"
              required 
              onChange={e => setImageFile(e.target.files[0])} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-green-600 file:text-white hover:file:bg-green-700 file:transition-colors file:cursor-pointer" 
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase text-xs tracking-widest">
              Назад
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-[2] px-8 py-3 bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Опубликовать'}
            </button>
          </div>
        </form>
      </div>

      {/* Модалка для просмотра фото */}
      {isModalOpen && (
        <ImageModal 
          src={product.image_url || '/images/placeholder.png'} 
          alt={product.name} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}