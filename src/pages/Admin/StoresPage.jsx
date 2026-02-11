import React, { useEffect, useMemo } from 'react';
import { useController } from '@cakereact/core';
import { CakeForm, CakeInput } from '@cakereact/core';
import {
  AdminPage,
  AdminHeader,
  AdminFormSection,
  AdminTableSection
} from '@cakereact/core';
import { StoreModel } from '../../models/Store';

export default function StoresPage() {
  // Модель создается только при первом рендере страницы
  const storeModel = useMemo(() => new StoreModel(), []);
  const controller = useController(storeModel);
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
    {
      label: 'Адрес', key: 'address', render: (row) => (
        <span className="text-gray-500">{row.address || '-'}</span>
      )
    },
    {
      label: 'Описание', key: 'description', render: (row) => (
        <span className="text-gray-500">{row.description || '-'}</span>
      )
    },
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
              helpText="Используйте текст. Например, иконку эмодзи 🏪"
            />
            <CakeInput
              field="name"
              label="Название"
              placeholder="Магнит"
              required
            />
            <CakeInput
              type="textarea"
              field="address"
              label="Адрес магазина"
              placeholder="Лихославль, ул. Советская, д.28"
            />
            <CakeInput
              type="textarea"
              field="description"
              label="Описание"
              placeholder="Описание магазина."
              helpText="Введите текст описания магазина."
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