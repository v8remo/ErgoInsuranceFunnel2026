import { useEffect } from 'react';
import { useLocation } from 'wouter';

export const useScrollTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Small delay to ensure page is fully loaded before scrolling
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
  }, [location]);
};