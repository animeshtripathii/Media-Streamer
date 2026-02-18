import { useState, useEffect } from "react";

export default function usePaginationWithTokens(fetchPage) {
  const [pages, setPages] = useState([]);
  const [tokens, setTokens] = useState([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const goToPage = async (pageIndex) => {
    if (pageIndex < 0 || pageIndex > tokens.length - 1) return;
    setCurrentPage(pageIndex);
    if (pages[pageIndex]) return;
    setLoading(true);
    setError(null);
    try {
      const token = tokens[pageIndex];
      const { data, nextToken } = await fetchPage(token);
      setPages((prev) => {
        const updated = [...prev];
        updated[pageIndex] = { data, token };
        return updated;
      });
      if (nextToken && tokens.length === pageIndex + 1) {
        setTokens((prev) => [...prev, nextToken]);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const next = () => goToPage(currentPage + 1);
  const prev = () => goToPage(currentPage - 1);

  useEffect(() => {
    if (!pages[0]) goToPage(0);
  }, []);

  return {
    data: pages[currentPage]?.data || [],
    loading,
    error,
    currentPage,
    hasNext: !!tokens[currentPage + 1],
    hasPrev: currentPage > 0,
    next,
    prev,
    goToPage,
    totalPages: tokens.length,
  };
}
