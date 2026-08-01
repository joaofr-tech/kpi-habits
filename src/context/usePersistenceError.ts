import { useEffect, useState } from "react";

export function usePersistenceError<T>(
  save: (value: T) => boolean,
  value: T
): boolean {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(!save(value));
  }, [save, value]);

  return hasError;
}
