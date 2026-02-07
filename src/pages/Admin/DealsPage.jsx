import React, { useEffect } from 'react';
import { useController } from '../../cakereact/src/Controller/useController';
import { CakeForm, CakeInput } from '../../cakereact/src/Components/FormHelper';
import { 
  AdminPage, 
  AdminHeader, 
  AdminFormSection, 
  AdminTableSection 
} from '../../cakereact/src/Components/AdminUI';
import { DealModel } from '../../models/Deal';

export default function DealsPage() {
    const controller = useController(DealModel);
    const { getList, setRecord } = controller;
  
    useEffect(() => {
      getList({ order: ['id', 'asc'] });
    }, [getList]);
  
    // Обработчик редактирования (скроллим наверх)
    const handleEdit = (item) => {
      setRecord(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    // Конфигурация колонок таблицы
    const tableColumns = [
      { label: 'ID', key: 'id', className: 'w-10 text-gray-400' },
      { label: 'Описание', key: 'description', render: (row) => (
        <span className="text-gray-500">{row.description || '-'}</span>
    )},
      { label: 'Фото ценника', key: 'image_url', className: 'font-bold' },
      { label: 'Старая цена', key: 'old_price', className: 'font-bold' },
      { label: 'Новая цена', key: 'new_price', className: 'font-bold' },
      { label: 'Процент скидки', key: 'discount_value', className: 'font-bold' },
      { label: 'Активность', key: 'is_active', className: 'font-bold' },
      
      // Можно легко добавить колонку даты или ID
      // { label: 'ID', key: 'id', className: 'w-10 text-gray-400' }
    ];
  
    return (
      <AdminPage>
        <AdminHeader 
          title="Скидки и акции" 
          subtitle="Управление скидками/акциями" 
          icon="🔥"
        />
  
        {/* Секция Формы */}
        <CakeForm controller={controller}>
          <AdminFormSection controller={controller} title="Скидка">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CakeInput 
                type="textarea"
                field="description" 
                label="Описание" 
                placeholder="Описание скидки/акции." 
              />
              <CakeInput 
                type="number"
                field="old_price" 
                label="Старая цена" 
              />
              <CakeInput 
                type="number"
                field="new_price" 
                label="Новая цена" 
              />
              <CakeInput 
                type="number"
                field="discount_value" 
                label="Размер скидки в %" 
              />          
            </div>
          </AdminFormSection>
        </CakeForm>
  
        {/* Секция Таблицы */}
        <AdminTableSection 
          controller={controller} 
          title="Список скидок/акций" 
          columns={tableColumns} 
          onEdit={handleEdit} 
        />
      </AdminPage>
    );
  }