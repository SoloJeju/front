import { useMutation } from '@tanstack/react-query';
import { createComment } from '../../apis/post';
import { queryClient } from '../../App';
import toast from 'react-hot-toast';

function useCreateComment() {
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
    },
    onError: () => {
      toast.error('댓글 작성 실패! 잠시 후 다시 시도해주세용...');
    },
  });
}

export default useCreateComment;
