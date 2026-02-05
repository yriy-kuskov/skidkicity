import { useAuth } from '../../hooks/useAuth';

/**
 * @component HasAccess
 * @description Отображает контент только если роль пользователя совпадает
 */
export default function HasAccess({ roles = [], children }) {
  const { profile, loading } = useAuth();

  if (loading) return null; // Или мелкий спиннер

  if (profile && roles.includes(profile.role)) {
    return <>{children}</>;
  }

  return null;
}