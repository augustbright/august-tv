import { useRef } from 'react';

export const usePrevious = <T>(value: T) => {
  const previousRef = useRef<T | undefined>(undefined);
  const previous = previousRef.current;
  previousRef.current = value;
  return previous;
};
