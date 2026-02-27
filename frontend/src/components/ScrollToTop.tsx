import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This tells the browser to instantly jump to the top-left corner
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};