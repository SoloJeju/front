import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { getMyGroupedNotiList } from '../../apis/alarm';

function useGetInfiniteGroupedNoti() {
  return useInfiniteQuery({
    queryKey: ['notifications-grouped'],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<string[], string | undefined>) =>
      getMyGroupedNotiList({
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

export default useGetInfiniteGroupedNoti;
