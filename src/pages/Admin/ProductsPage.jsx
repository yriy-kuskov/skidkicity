import React, { useEffect, useMemo } from 'react';
import { useController } from '@cakereact/core';
import { CakeForm, CakeInput, CakeSelect, CakeMultiSelect } from '@cakereact/core';
import {
  AdminPage,
  AdminHeader,
  AdminFormSection,
  AdminTableSection
} from '@cakereact/core';
import { ProductModel } from '../../models/Product';
import { CategoryModel } from '../../models/Category';
import { CakeImage } from '@cakereact/core';

export default function ProductsPage() {
  // Модель создается только при первом рендере страницы
  const productModel = useMemo(() => new ProductModel(), []);
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
    {
      label: 'Фото', key: 'image_url', render: (row) => (
        <CakeImage
          src={row.image_url}
          alt={`Товар: ${row.name}`}
          zoomable={true} // Теперь картинку можно увеличить!
        />
      )
    },
    {
      label: 'Изображение штрихкода товара', key: 'barcode_image_url', render: (row) => (
        <CakeImage
          src={row.barcode_image_url}
          alt={`Штрихкод товара: ${row.name}`}
          zoomable={true} // Теперь картинку можно увеличить!
        />
      )
    },
    { label: 'Штрихкод', key: 'barcode', className: 'font-bold' },
    { label: 'Название', key: 'name', className: 'font-bold' },
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