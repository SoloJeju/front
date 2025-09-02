import { useQuery } from '@tanstack/react-query';
import { getTodayRecommendedSpots } from '../../apis/home';

function useGetTodayRecommendedSpots() {
  return useQuery({
    queryKey: ['TodayRecommendedSpots', new Date().toISOString().split('T')[0]],
    queryFn: () => getTodayRecommendedSpots(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24시간
    retry: 1,
    select: (data) => data.result,
  });
}

export default useGetTodayRecommendedSpots;
