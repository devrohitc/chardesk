import { useState, useEffect } from 'react';
import { readStore, writeStore } from '../utils/storage';

export function useSavedState(key, fallback) {
  const [value, setValue] = useState(() => readStore(key, fallback));

  useEffect(() => {
    writeStore(key, value);
  }, [key, value]);

  return [value, setValue];
}

export default useSavedState;

