import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyReviews } from '../../apis/mypage';

function useGetMyReviews(size: number = 10) {
  return useInfiniteQuery({
    queryKey: ['myReviews'],
    queryFn: ({ pageParam }) => getMyReviews(undefined, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.result.last) {
        return undefined;
      }
      return lastPage.result.number + 1;
    },
    select: (data) => ({
      pages: data.pages.flatMap((page) => page.result.content),
      pageParams: data.pageParams,
    }),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,  
    retry: 1,
  });
}

export default useGetMyReviews;