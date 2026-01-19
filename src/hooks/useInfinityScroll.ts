import { PaginatedResponse } from "../services/types";
import { useRef, useState } from "react";

export const useInfinityScroll = <T = unknown>(
  getData: (page: number, filter?: any) => Promise<PaginatedResponse<T>>,
) => {
  const [data, setData] = useState<T[]>([]);

  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const currentPageRef = useRef(1);

  const fetchData = async (page = 1, filter?: any) => {
    if (loading || loadingMore) return;

    page === 1 && filter === undefined
      ? setLoading(true)
      : setLoadingMore(true);

    try {
      const response = await getData(page, filter);

      if (page === 1) {
        setData(response.data);
      } else {
        setData((prev) => [...prev, ...response.data]);
      }

      currentPageRef.current = response.meta.current_page;
      setLastPage(response.meta.last_page);
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && currentPageRef.current < lastPage) {
      fetchData(currentPageRef.current + 1);
    }
  };

  return {
    data,
    loadingMore,
    loading,
    fetchData,
    loadMore,
  };
};
