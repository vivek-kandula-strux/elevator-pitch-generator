import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced input handling
 * @param initialValue - Initial input value
 * @param delay - The delay in milliseconds (default: 300ms)
 * @returns Object with current value, debounced value, and change handler
 */
export function useDebouncedInput(initialValue: string = '', delay: number = 300) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delay);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return {
    value,
    debouncedValue,
    handleChange,
    setValue
  };
}