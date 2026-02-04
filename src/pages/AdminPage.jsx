import { useState } from 'react'
import { fetchProductByBarcode } from '../lib/api/products'
import { searchExternalProduct } from '../lib/api/external'

import StoreSelector from '../components/admin/StoreSelector'
import BarcodeSearch from '../components/admin/BarcodeSearch'
import ProductForm from '../components/admin/ProductForm'
import DealForm from '../components/admin/DealForm'

/**
 * @component AdminPage
 * @description Центральная страница управления контентом. 
 * ПОРЯДОК РАБОТЫ (ФЛОУ):
 * 1. Выбор магазина (обязательно).
 * 2. Сканирование штрих-кода.
 * 3. Если товар есть в БД -> переход к DealForm (создание скидки).
 * 4. Если товара нет -> поиск в External API -> ProductForm -> затем DealForm.
 */
export default function AdminPage() {
  const [step, setStep] = useState('idle')
  const [selectedStore, setSelectedStore] = useState(null)
  const [barcode, setBarcode] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [externalData, setExternalData] = useState(null)

  /**
   * Логика поиска товара.
   * CURSOR: При изменении этой функции убедись, что проверка selectedStore остается первой.
   */
  const handleSearch = async (scannedBarcode) => {
    if (!selectedStore) {
      alert("Пожалуйста, выберите магазин перед поиском");
      return;
    }
    setBarcode(scannedBarcode);
    setIsSearching(true);
    try {
      // Ищем только в нашей локальной БД
      const product = await fetchProductByBarcode(scannedBarcode);
      if (product) {
        setCurrentProduct(product);
        setStep('deal_form');
      } else {
        // Если товара нет, обнуляем внешние данные и открываем форму
        setExternalData(null);
        setStep('product_form');
      }
    } catch (err) {
      alert("Ошибка поиска: " + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const resetAll = () => {
    setStep('idle')
    setBarcode('')
    setCurrentProduct(null)
    setExternalData(null)
  }

  return (
    <div className="max-w-2xl mx-auto pb-6 px-4">
      <h1 className="text-2xl font-black mb-6 text-gray-800 text-center uppercase tracking-tight">
        Контроль скидок
      </h1>

      {step === 'idle' && (
        <div className="space-y-6">
          <StoreSelector 
            onSelect={setSelectedStore} 
            selectedStore={selectedStore} 
          />
          <BarcodeSearch 
            onSearch={handleSearch} 
            isSearching={isSearching} 
          />
        </div>
      )}

      {step === 'product_form' && (
        <ProductForm 
          barcode={barcode} 
          initialData={externalData} 
          onCreated={(prod) => { 
            setCurrentProduct(prod); 
            setStep('deal_form'); 
          }} 
          onCancel={resetAll}
        />
      )}

      {step === 'deal_form' && (
        <DealForm 
          product={currentProduct} 
          store={selectedStore} 
          onFinished={resetAll} 
          onCancel={() => setStep('idle')}
        />
      )}
    </div>
  )
}