import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchInProgress = useRef(false);

  const fetchProfile = async (userId) => {
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;
    
    console.log('📡 [fetchProfile] Запуск для:', userId);
    setLoading(true);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 5000)
    );

    try {
      const { data, error } = await Promise.race([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        timeoutPromise
      ]);

      if (error) {
        console.error('❌ [fetchProfile] Ошибка БД:', error.message);
        throw error;
      }

      console.log('✅ [fetchProfile] Данные получены:', data);
      setProfile(data);
    } catch (err) {
      console.error('❌ [fetchProfile] Глобальная ошибка:', err.message);
      setProfile(null);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Слушаем изменение состояния авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 [Auth Event]:', event, session?.user?.id);

      if (session?.user) {
        setUser(session.user);
        // Загружаем профиль, если его нет
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
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
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.clear();
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut, 
      isAdmin: profile?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);