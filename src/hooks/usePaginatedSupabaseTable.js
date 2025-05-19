import { useEffect, useState, useCallback } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

const PAGE_SIZE = 1000; // Supabase default limit

export function usePaginatedSupabaseTable(tableName) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch a single page of data
  const fetchPage = useCallback(
    async (pageNum) => {
      setLoading(true);
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data: rows, error } = await SupabaseClient.from(tableName)
        .select("*")
        .range(from, to);

      if (error) {
        setLoading(false);
        return;
      }

      setData((prev) => [...prev, ...(rows || [])]);
      setHasMore((rows || []).length === PAGE_SIZE);
      setLoading(false);
    },
    [tableName]
  );

  // Initial load
  useEffect(() => {
    setData([]); // Reset if tableName changes
    setPage(0);
    fetchPage(0);
  }, [tableName, fetchPage]);

  // Function to load the next page
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage);
  };

  return { data, loading, hasMore, loadMore };
}
