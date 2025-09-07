import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { getTouristReviews } from '../../apis/tourist';

function useGetInfiniteReveiws(contentId: number) {
  return useInfiniteQuery({
    queryKey: ['spotReviews', contentId],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<(string | number)[], string | undefined>) =>
      getTouristReviews({
        contentId,
        cursor: pageParam,
        size: 10,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    retry: 1,
  });
}
export default useGetInfiniteReveiws;
