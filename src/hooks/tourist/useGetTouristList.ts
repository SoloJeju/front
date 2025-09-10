import { useInfiniteQuery } from '@tanstack/react-query';
import { getTouristSpots } from '../../apis/tourist';
import type { ContentTypeId, Difficulty } from '../../types/tourist';

interface TouristListFilters {
  sigunguCode: number | undefined;
  contentTypeId: ContentTypeId | undefined;
  difficulty: Difficulty | undefined;
}

export const useGetTouristList = (filters: TouristListFilters) => {
  return useInfiniteQuery({
    queryKey: ['touristSpots', filters],
    queryFn: ({ pageParam = 0 }) => getTouristSpots({ page: pageParam, size: 100, ...filters }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.result.list || lastPage.result.list.length === 0) {
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