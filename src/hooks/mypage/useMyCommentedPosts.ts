import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyCommentedPosts } from '../../apis/mypage';
import type { ResponseMyPostsDto } from '../../types/mypage';

export const useMyCommentedPosts = (size: number) => {
  return useInfiniteQuery<ResponseMyPostsDto, Error>({
    queryKey: ['myCommentedPosts', 'infinite', size],
    initialPageParam: undefined,


    queryFn: (context) => {
      const pageParam = context.pageParam;
      return getMyCommentedPosts(
        pageParam as string | undefined,
        undefined,
        size
      );
    },

    getNextPageParam: (lastPage) => {
      const { result } = lastPage;
      if (result && 'hasNext' in result && result.hasNext) {
        return result.nextCursor;
      }
      return undefined;
    },
  });
};
