import { useQuery } from '@tanstack/react-query';
import { getMyCommentedPosts } from '../../apis/mypage';

export const useMyCommentedPosts = (page: number, size: number) => {
  return useQuery({
    queryKey: ['myCommentedPosts', page, size],
    queryFn: () => getMyCommentedPosts(undefined, page, size),
  });
};
