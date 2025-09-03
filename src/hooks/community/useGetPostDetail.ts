import { useQuery } from '@tanstack/react-query';
import { getPostDetail } from '../../apis/post';

function useGetPostDetail(postId: number) {
  return useQuery({
    queryKey: ['postDetail', postId],
    queryFn: () => getPostDetail(postId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    select: (data) => data.result,
  });
}

export default useGetPostDetail;
