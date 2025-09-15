import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyPosts } from '../../apis/mypage';
import type { ResponseMyPostsDto } from '../../types/mypage';

export const useMyPosts = (size: number) => {
  return useInfiniteQuery<ResponseMyPostsDto, Error>({
    queryKey: ['myPosts', 'infinite', size],
    initialPageParam: undefined,

    queryFn: (context) => {
      const pageParam = context.pageParam;
      return getMyPosts(pageParam as string | undefined, undefined, size);
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
