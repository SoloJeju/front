import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { getTouristImages } from '../../apis/tourist';

function useGetInfiniteSpotImages(contentId: number) {
  return useInfiniteQuery({
    queryKey: ['spotImages', contentId],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<(string | number)[], string | undefined>) =>
      getTouristImages({
        contentId,
        cursor: pageParam,
        size: 10,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.result.hasNext ? lastPage.result.nextCursor : undefined;
    },
    retry: 1,
  });
}

export default useGetInfiniteSpotImages;
