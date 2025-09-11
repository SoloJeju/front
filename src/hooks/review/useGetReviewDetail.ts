import { useQuery } from '@tanstack/react-query';
import { getReviewDetail } from '../../apis/review';

export const useGetReviewDetail = (reviewId: number) => {
  return useQuery({
    queryKey: ['reviewDetail', reviewId],
    queryFn: () => getReviewDetail(reviewId),
    
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    select: (data) => data.result,
    
    enabled: !!reviewId && !isNaN(reviewId),
  });
};