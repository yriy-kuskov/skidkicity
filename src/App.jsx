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
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';

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
          {/* Будущие страницы: 
          <Route path="stores" element={<StoresPage />} /> 
          */}
        </Route>

        {/* Авторизация */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App;