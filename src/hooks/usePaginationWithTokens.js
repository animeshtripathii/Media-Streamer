import { useState, useEffect } from "react";

export default function usePaginationWithTokens(fetchPage) {
  const [pages, setPages] = useState([]);
  const [tokens, setTokens] = useState([null]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(0);

  const goToPage = async (pageIndex) => {
    if (pageIndex < 0 || (tokens.length > 0 && pageIndex > tokens.length - 1 && !hasNext)) return;
    setCurrentPage(pageIndex);
    if (pages[pageIndex]) return;
    setLoading(true);
    setError(null);
    try {
      const token = tokens[pageIndex];
      const { data, nextToken, pageInfo } = await fetchPage(token);

      if (pageInfo) {
        setTotalResults(pageInfo.totalResults);
        setResultsPerPage(pageInfo.resultsPerPage);
      }

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

  const totalPagesInitial = resultsPerPage > 0 ? Math.ceil(totalResults / resultsPerPage) : 0;
  // Ensure we don't show 0 pages if we have data but calculation fails or is 0
  const totalPages = Math.max(totalPagesInitial, tokens.length);

  return {
    data: pages[currentPage]?.data || [],
    loading,
    error,
    currentPage,
    hasNext: !!tokens[currentPage + 1] || (currentPage < totalPages - 1),
    hasPrev: currentPage > 0,
    next,
    prev,
    goToPage,
    totalPages,
  };
}
