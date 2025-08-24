import { useQuery } from '@tanstack/react-query';
import { getLatestReviews } from '../../apis/home';

function useGetLatestReviews() {
  return useQuery({
    queryKey: ['lastReviews'],
    queryFn: () => getLatestReviews(),
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
    select: (data) => data.result,
  });
}

export default useGetLatestReviews;
