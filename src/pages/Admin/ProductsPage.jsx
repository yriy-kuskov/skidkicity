import React, { useEffect } from 'react';
import { useController } from '../../cakereact/src/Controller/useController';
import { CakeForm, CakeInput, CakeSelect, CakeMultiSelect } from '../../cakereact/src/Components/FormHelper';
import { 
  AdminPage, 
  AdminHeader, 
  AdminFormSection, 
  AdminTableSection 
} from '../../cakereact/src/Components/AdminUI';
import { ProductModel } from '../../models/Product';
import { CategoryModel } from '../../models/Category';

const productModel = new ProductModel();

export default function ProductsPage() {
    const controller = useController(productModel);
    const { getList, setRecord } = controller;
  
    useEffect(() => {
      getList({ order: ['name', 'asc'] });
    }, [getList]);
  
    // Обработчик редактирования (скроллим наверх)
    const handleEdit = (item) => {
      setRecord(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    // Конфигурация колонок таблицы
    const tableColumns = [
      { label: 'ID', key: 'id', className: 'w-10 text-gray-400' },
      { label: 'Фото', key: 'image_url', render: (row) => (
        row.image_url ? <img src={row.image_url} className="w-10 h-10 object-cover rounded shadow-sm border border-gray-200" alt="product" /> : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">Нет фото</div>
    )},
    { label: 'Изображение штрихкода товара', key: 'barcode_image_url', render: (row) => (
      row.barcode_image_url ? <img src={row.barcode_image_url} className="w-10 h-10 object-cover rounded shadow-sm border border-gray-200" alt="product" /> : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">Нет фото</div>
  )},
      { label: 'Штрихкод', key: 'barcode', className: 'font-bold' },
      { label: 'Название', key: 'name', className: 'font-bold' },
      { label: 'Описание', key: 'description', render: (row) => (
          <span className="text-gray-500">{row.description || '-'}</span>
      )},
      // Можно легко добавить колонку даты или ID
      // { label: 'ID', key: 'id', className: 'w-10 text-gray-400' }
    ];
  
    return (
      <AdminPage>
        <AdminHeader 
          title="Товары" 
          subtitle="Управляйте товарами" 
          icon="📦"
        />
  
        {/* Секция Формы */}
        <CakeForm controller={controller}>
          <AdminFormSection controller={controller} title="Товар">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">

            <div className="space-y-2">
            <CakeInput 
                field="barcode" 
                label="Штрихкод" 
                placeholder="4600300000739" 
                required 
              />
              <CakeInput 
                field="name" 
                label="Название" 
                placeholder="Молоко 3,2%" 
                required 
              />
              <CakeInput 
                type="textarea"
                field="description" 
                label="Описание" 
                placeholder="Описание товара." 
              />
              </div>

              <div className="space-y-2">
                {/* Поля для UploadImageBehavior */}
              <CakeInput type="file" field="image_url" label="Основное фото" helpText="Будет оптимизировано перед загрузкой" />
                <CakeInput type="file" field="barcode_image_url" label="Скан штрихкода" />

                {/* Пример использования Select/MultiSelect */}
                <CakeSelect field="category_id" label="Категория" model={CategoryModel} />
              </div>              
            </div>
          </AdminFormSection>
        </CakeForm>
  
        {/* Секция Таблицы */}
        <AdminTableSection 
          controller={controller} 
          title="Список товаров" 
          columns={tableColumns} 
          onEdit={handleEdit} 
        />
      </AdminPage>
    );
  }