// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout'; // Новый лейаут
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import DealTypesPage from './pages/Admin/DealTypesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductsPage from './pages/Admin/ProductsPage';
import CategoriesPage from './pages/Admin/CategoriesPage';
import DealsPage from './pages/Admin/DealsPage';
import StoresPage from './pages/Admin/StoresPage';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { CakeNotFound } from './cakereact/src/Components/Pages/CakeNotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Публичная часть */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Админка с новым AdminLayout */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          {/* Вложенные маршруты будут рендериться в Outlet внутри AdminLayout */}
          <Route index element={<AdminPage />} />
          <Route path="deal-types" element={<DealTypesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="stores" element={<StoresPage />} />
          {/* Будущие страницы: 
          <Route path="stores" element={<StoresPage />} /> 
          */}
        </Route>

        {/* Авторизация */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* 404: Ловушка для всех неопределенных путей */}
        {/* Мы помещаем её вне лейаутов или внутрь основного, в зависимости от дизайна */}
        {/*Важно: этот роут должен стоять последним в списке*/}
        <Route path="*" element={<CakeNotFound />} />
        <Route path="/admin/*" element={
  <CakeNotFound 
    title="Объект не найден в базе" 
    icon="🔍" 
    message="Мы обыскали всю базу данных, но такой записи не существует."
    homePath="/admin"
    buttonText="В панель управления"
  />
} />
      </Routes>
    </AuthProvider>
  )
}

export default App;