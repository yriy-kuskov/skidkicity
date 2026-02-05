import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
  <Routes>
    {/* Группа маршрутов С основным лейаутом (Шапка + Меню) */}
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      {/* Только для АДМИНОВ */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPage />
        </ProtectedRoute>
      } />
    </Route>

    {/* Группа маршрутов С легким лейаутом (Только назад и лого) */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>
  </Routes>
</AuthProvider>
  )
}

export default App
