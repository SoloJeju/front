import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import type { PostCategory } from '../../types/post';
import { getPostList } from '../../apis/post';

function useGetInfinitePostList(category?: PostCategory) {
  return useInfiniteQuery({
    queryKey: category ? ['posts', category] : ['posts'],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<string[], string | undefined>) =>
      getPostList({
        category,
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

export default useGetInfinitePostList;
