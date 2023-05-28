import { useCallback, useState } from "react";

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const start = useCallback(() => {
    setLoading(true);
  }, []);
  const end = useCallback(() => {
    setLoading(false);
  }, []);
  return {
    loading,
    start,
    end,
    setLoading,
  };
};
