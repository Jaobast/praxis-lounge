import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ThemeColorManager() {
  const location = useLocation();

  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (!metaThemeColor) return;

    // Escolhe a cor conforme a rota atual
    let color = "#4A00E0"; // padrão

    if (location.pathname.startsWith("/profile")) {
      color = "#3b82f6"; // azul
    } else if (location.pathname.startsWith("/chat")) {
      color = "#9333ea"; // roxo
    } else if (location.pathname.startsWith("/settings")) {
      color = "#16a34a"; // verde
    }

    metaThemeColor.setAttribute("content", color);
  }, [location]);

  return null;
}
