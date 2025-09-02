import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../App';
import { scrapPost } from '../../apis/post';

function useUpdateScrap() {
  return useMutation({
    mutationFn: scrapPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['postDetail'],
      });
    },
    onError: () => {
      alert('스크랩 실패! 잠시 후 다시 시도해주세용');
    },
  });
}
export default useUpdateScrap;
