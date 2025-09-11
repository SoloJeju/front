import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReview } from '../../apis/review';
import type { UpdateReviewPayload } from '../../types/review';

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { reviewId: number; payload: UpdateReviewPayload }) =>
      updateReview(variables.reviewId, variables.payload),
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviewDetail', variables.reviewId] });
    },
  });
};