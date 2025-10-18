// src/hooks/useIsMobile.js
import { useState, useEffect } from "react";

export default function useIsMobile(breakpoint = 700) {
  // Se estiver em SSR, assume desktop até que o window exista
  const getInitial = () =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false;

  const [isMobile, setIsMobile] = useState(getInitial);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // atualiza instantaneamente (caso o componente monte após redimensionamento)
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
