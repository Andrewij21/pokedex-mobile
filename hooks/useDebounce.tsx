import { useEffect, useState } from "react";

/**
 * Hook untuk menunda update value (Debounce).
 * @param value Nilai yang ingin di-debounce (misal: text search)
 * @param delay Waktu tunda dalam milidetik (default: 500ms)
 * @returns Nilai yang sudah tertunda
 */
export const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debounceValue;
};
