import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { getMyNotiList } from '../../apis/alarm';

function useGetInfiniteNotiList() {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<string[], string | undefined>) =>
      getMyNotiList({
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

export default useGetInfiniteNotiList;
