import { usePrevious } from './usePrevious';

export const useOnChange = (value: unknown, callback: () => void) => {
  if (value !== usePrevious(value)) {
    callback();
  }
};
