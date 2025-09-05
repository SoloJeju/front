import { useInfiniteQuery } from '@tanstack/react-query';
import { getTouristSpots } from '../../apis/tourist';

export const useGetTouristList = () => {
  return useInfiniteQuery({
    queryKey: ['touristSpots'],
    queryFn: ({ pageParam = 0 }) => getTouristSpots({ page: pageParam, size: 100 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.result.list.length === 0) {
        return undefined;
      }
      return allPages.length;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.flatMap((page) => page.result.list),
    }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};