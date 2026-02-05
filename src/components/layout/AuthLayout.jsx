import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Если в истории браузера есть куда возвращаться, идем назад.
    // Иначе (зашли по прямой ссылке) — на главную.
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Упрощенная шапка */}
      <header className="p-4 flex items-center justify-between bg-transparent">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Назад</span>
        </button>

        <Link to="/" className="text-xl font-bold text-primary tracking-tight">
          SkidkiCity
        </Link>
        
        {/* Пустой блок для баланса флекса (чтобы лого было по центру или справа) */}
        <div className="w-20"></div>
      </header>

      {/* Контент страницы */}
      <main className="flex-1 flex flex-col justify-center">
      <Outlet />
      </main>
      
      {/* Маленький футер */}
      <footer className="p-6 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} SkidkiCity. Все права защищены.
      </footer>
    </div>
  );
}