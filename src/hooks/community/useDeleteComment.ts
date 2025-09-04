import { useMutation } from '@tanstack/react-query';
import { deleteComment } from '../../apis/post';
import { queryClient } from '../../App';
import toast from 'react-hot-toast';

function useDeleteComment() {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
    },
    onError: () => {
      toast.error('댓글 삭제 실패! 잠시 후 다시 시도해주세용...');
    },
  });
}

export default useDeleteComment;
