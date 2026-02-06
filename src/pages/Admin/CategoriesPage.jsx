import React, { useEffect } from 'react';
import { useController } from '../../cakereact/src/Controller/useController';
import { CakeForm, CakeInput } from '../../cakereact/src/Components/FormHelper';
import { 
  AdminPage, 
  AdminHeader, 
  AdminFormSection, 
  AdminTableSection 
} from '../../cakereact/src/Components/AdminUI';
import { CategoryModel } from '../../models/Category';

export default function CategoriesPage() {
    const controller = useController(CategoryModel);
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
      { label: 'Название', key: 'name', className: 'font-bold' }
    ];
  
    return (
      <AdminPage>
        <AdminHeader 
          title="Категории" 
          subtitle="Управление категориями товаров" 
          icon="📁"
        />
  
        {/* Секция Формы */}
        <CakeForm controller={controller}>
          <AdminFormSection controller={controller} title="Категория">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CakeInput 
                field="name" 
                label="Название" 
                placeholder="Молочные продукты" 
                required 
              />
            </div>
          </AdminFormSection>
        </CakeForm>
  
        {/* Секция Таблицы */}
        <AdminTableSection 
          controller={controller} 
          title="Список категорий товаров" 
          columns={tableColumns} 
          onEdit={handleEdit} 
        />
      </AdminPage>
    );
  }