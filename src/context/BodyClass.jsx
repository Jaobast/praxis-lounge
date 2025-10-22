import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function BodyClassManager() {
  const location = useLocation();

  useEffect(() => {
    // Normaliza a rota: "/chat/box" → "page-chat-box"
    const normalizedPath =
      location.pathname === '/' ? 'home' : location.pathname.slice(1).replace(/\//g, '-');

    // Limpa classes antigas
    document.body.className = '';
    document.body.classList.add(`page-${normalizedPath}`);

    // Limpa ao desmontar (opcional)
    return () => {
      document.body.className = '';
    };
  }, [location]);

  return null;
}

export default BodyClassManager;
