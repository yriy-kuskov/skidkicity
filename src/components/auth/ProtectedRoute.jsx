import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Если идет загрузка ИЛИ мы залогинены, но профиль еще в пути
  const isWaiting = loading || (user && !profile);

  console.log('🛡️ [ProtectedRoute] Состояние:', { 
    isWaiting, 
    hasUser: !!user, 
    hasProfile: !!profile,
    role: profile?.role 
  });

  if (isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.warn('🛡️ [ProtectedRoute] Нет пользователя -> на /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    console.error('🛡️ [ProtectedRoute] Роль не совпадает!', {
      current: profile?.role,
      required: requiredRole
    });
    return <Navigate to="/" replace />;
  }

  return children;
}