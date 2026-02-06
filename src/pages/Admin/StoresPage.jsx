import React, { useEffect } from 'react';
import { useController } from '../../cakereact/src/Controller/useController';
import { CakeForm, CakeInput } from '../../cakereact/src/Components/FormHelper';
import { 
  AdminPage, 
  AdminHeader, 
  AdminFormSection, 
  AdminTableSection 
} from '../../cakereact/src/Components/AdminUI';
import { StoreModel } from '../../models/Store';

export default function StoresPage() {
    const controller = useController(StoreModel);
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
      { label: 'Logo', key: 'logo', className: 'font-bold' },
      { label: 'Название', key: 'name', className: 'font-bold' },
      { label: 'Адрес', key: 'address', render: (row) => (
        <span className="text-gray-500">{row.address || '-'}</span>
    )},
      { label: 'Описание', key: 'description', render: (row) => (
          <span className="text-gray-500">{row.description || '-'}</span>
      )},
      // Можно легко добавить колонку даты или ID
      // { label: 'ID', key: 'id', className: 'w-10 text-gray-400' }
    ];
  
    return (
      <AdminPage>
        <AdminHeader 
          title="Магазины" 
          subtitle="Управление магазинами" 
          icon="🏪"
        />
  
        {/* Секция Формы */}
        <CakeForm controller={controller}>
          <AdminFormSection controller={controller} title="Магазин">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CakeInput 
                field="logo" 
                label="Logo" 
                placeholder="" 
                required 
              />
              <CakeInput 
                field="name" 
                label="Название" 
                placeholder="Магнит" 
                required 
              />
              <CakeInput 
                field="address" 
                label="Адрес магазина" 
                placeholder="Лихославль, ул. Советская, д.28" 
              />
              <CakeInput 
                field="description" 
                label="Описание" 
                placeholder="Описание магазина." 
              />
            </div>
          </AdminFormSection>
        </CakeForm>
  
        {/* Секция Таблицы */}
        <AdminTableSection 
          controller={controller} 
          title="Список магазинов" 
          columns={tableColumns} 
          onEdit={handleEdit} 
        />
      </AdminPage>
    );
  }