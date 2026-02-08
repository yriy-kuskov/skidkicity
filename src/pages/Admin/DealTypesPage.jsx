import React, { useEffect, useMemo } from 'react';
import { useController } from '../../cakereact/src';
import { CakeForm, CakeInput } from '../../cakereact/src';
import { 
  AdminPage, 
  AdminHeader, 
  AdminFormSection, 
  AdminTableSection 
} from '../../cakereact/src';
import { DealTypeModel } from '../../models/DealType';

export default function DealTypesPage() {
  // Модель создается только при первом рендере страницы
  const dealTypeModel = useMemo(() => new DealTypeModel(), []);
  const controller = useController(dealTypeModel);
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
        title="Типы скидок" 
        subtitle="Управляйте типами акций (например: 1+1, Скидка в рублях и т.д.)" 
        icon="🏷️"
      />

      {/* Секция Формы */}
      <CakeForm controller={controller}>
        <AdminFormSection controller={controller} title="Тип скидки">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CakeInput 
              field="name" 
              label="Название" 
              placeholder="Например: 2+1" 
              required 
            />
            <CakeInput 
              type="textarea"
              field="description" 
              label="Описание" 
              placeholder="Краткое описание механики" 
            />
          </div>
        </AdminFormSection>
      </CakeForm>

      {/* Секция Таблицы */}
      <AdminTableSection 
        controller={controller} 
        title="Список типов" 
        columns={tableColumns} 
        onEdit={handleEdit} 
      />
    </AdminPage>
  );
}