import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (fetchCallback) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  
  // Use useRef for the token to prevent unnecessary re-renders or dependency loops
  const nextTokenRef = useRef(null);
  const isFirstLoad = useRef(true);

  const loadMore = useCallback(async (isInitial = false) => {
    if (loading) return;
    if (!isInitial && !hasNext) return;

    console.log(isInitial ? "🚀 Initial Fetch Starting" : `🔄 Loading Next Page: ${nextTokenRef.current}`);
    
    setLoading(true);
    setError(null);

    try {
      const result = await fetchCallback(isInitial ? null : nextTokenRef.current);
      
      if (!result || !result.data) {
        setHasNext(false);
        return;
      }

      setData((prev) => (isInitial ? result.data : [...prev, ...result.data]));
      nextTokenRef.current = result.nextToken;
      setHasNext(!!result.nextToken);
      
      console.log(`✅ Success: Added ${result.data.length} items. Next Token: ${result.nextToken}`);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNext, fetchCallback]);

  // Handle initial mount
  useEffect(() => {
    if (isFirstLoad.current) {
      loadMore(true);
      isFirstLoad.current = false;
    }
  }, [loadMore]);

  return { data, loading, error, hasNext, loadMore };
};

export default useInfiniteScroll;