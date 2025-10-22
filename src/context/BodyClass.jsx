import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function BodyClassManager() {
  const location = useLocation();

  useEffect(() => {
    const normalizedPath =
      location.pathname === '/' ? 'home' : location.pathname.slice(1).replace(/\//g, '-');

    document.body.className = '';
    document.body.classList.add(`page-${normalizedPath}`);

    return () => {
      document.body.className = '';
    };
  }, [location]);

  return null;
}

export default BodyClassManager;
