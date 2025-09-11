import { useQuery } from '@tanstack/react-query';
import { getMyPosts } from '../../apis/mypage';

export const useMyPosts = (page: number, size: number) => {
  return useQuery({
    queryKey: ['myPosts', page, size],
    queryFn: () => getMyPosts(undefined, page, size),
  });
};
