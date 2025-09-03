import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { getCommentList } from '../../apis/post';

function useGetInfiniteCommentList(postId: number) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<(string | number)[], string | undefined>) =>
      getCommentList({
        postId,
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

export default useGetInfiniteCommentList;
