import { useRef, useCallback } from 'react';

export function useDebouncedCallback(callback, delay) {
  const timer = useRef(null);

  return useCallback((...args) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}
