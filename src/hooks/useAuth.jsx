import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // Изменяем начальное состояние на false, чтобы не блокировать главную страницу при старте
  const [loading, setLoading] = useState(false); 
  const fetchInProgress = useRef(false);

  const fetchProfile = async (userId) => {
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;
    
    console.log('📡 [fetchProfile] Фоновая загрузка для:', userId);
    // Для фоновой загрузки на главной не ставим глобальный setLoading(true), 
    // чтобы не показывать спиннер на весь экран.

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single({ abortSignal: controller.signal });

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('⚠️ Профиль не найден в БД');
        } else {
          throw error;
        }
      }

      if (data) {
        console.log('✅ [fetchProfile] Профиль получен:', data.role);
        setProfile(data);
        // Сохраняем роль для мгновенного отображения кнопки админа в PWA
        localStorage.setItem('user_role', data.role);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn('🛑 Запрос профиля прерван по таймауту');
      } else {
        console.error('❌ [fetchProfile] Ошибка:', err.message);
      }
    } finally {
      clearTimeout(timeoutId);
      fetchInProgress.current = false;
      // Выключаем загрузку только если она была включена (например, для ProtectedRoute)
      setLoading(false); 
    }
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 [Auth Event]:', event);

      if (session?.user && isMounted) {
        setUser(session.user);
        // Запускаем загрузку профиля в фоне
        fetchProfile(session.user.id);
      } else if (isMounted) {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('user_role');
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    
    try {
      // 1. Сначала чистим локальные данные
      localStorage.clear();
      setUser(null);
      setProfile(null);

      // 2. Уведомляем Service Worker (если есть), чтобы сбросить кэш
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let reg of registrations) {
          reg.active?.postMessage({ type: 'SKIP_WAITING' });
        }
      }

      // 3. Выходим из Supabase
      await supabase.auth.signOut();
      
      // 4. Жёсткая перезагрузка страницы для очистки всех зависших AbortController
      window.location.href = '/'; 
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      setLoading, // Добавляем возможность включать лоадер из ProtectedRoute
      signOut, 
      isAdmin: profile?.role === 'admin' || localStorage.getItem('user_role') === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);