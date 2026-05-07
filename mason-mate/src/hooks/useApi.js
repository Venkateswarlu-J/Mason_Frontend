/* src/hooks/useApi.js
   Generic hook that wraps any async service call with loading + error state. */

import { useState, useCallback } from 'react';

export function useApi(serviceFn) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [serviceFn]);

  return { data, loading, error, execute };
}
