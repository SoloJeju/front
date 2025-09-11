import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '../../apis/review';

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });
};