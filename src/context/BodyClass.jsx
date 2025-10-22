import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function BodyClassManager() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.replace('/', '') || 'home';
    document.body.className = '';
    document.body.classList.add(`page-${currentPath}`);

    return () => {
      document.body.className = '';
    };
  }, [location]);

  return null;
}

export default BodyClassManager;