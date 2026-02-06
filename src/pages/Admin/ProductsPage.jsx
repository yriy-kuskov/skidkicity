import React, { useEffect } from 'react';
import { useController } from '../../cakereact/src/Controller/useController';
import { CakeForm, CakeInput } from '../../cakereact/src/Components/FormHelper';
import { 
  AdminPage, 
  AdminHeader, 
  AdminFormSection, 
  AdminTableSection 
} from '../../cakereact/src/Components/AdminUI';
import { ProductModel } from '../../models/Product';

export default function ProductsPage() {
    const controller = useController(ProductModel);
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
      { label: 'Фото товара', key: 'image_url', className: 'font-bold' },
      { label: 'Изображение штрихкода товара', key: 'barcode_image_url', className: 'font-bold' },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                field="description" 
                label="Описание" 
                placeholder="Описание товара." 
              />
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