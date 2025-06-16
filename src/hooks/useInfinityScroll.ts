import { AxiosResponse } from "axios";
import { useRef, useState } from "react";

export const useInfinityScroll = <T = unknown>(
  getData: (page: number) => Promise<
    AxiosResponse<
      {
        data: T[];
        meta: any;
      },
      any
    >
  >,
  ...args: any[]
) => {
  const [data, setData] = useState<T[]>([]);

  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const currentPageRef = useRef(1);

  const fetchData = async (page = 1) => {
    if (loading || loadingMore) return;

    page === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const response = await getData(page);
      const responseData = response.data;

      if (page === 1) {
        setData(responseData.data);
      } else {
        setData((prev) => [...prev, ...responseData.data]);
      }

      currentPageRef.current = responseData.meta.current_page;
      setLastPage(responseData.meta.last_page);
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
