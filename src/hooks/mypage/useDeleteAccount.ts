import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteProfile } from '../../apis/mypage';
import type { DeleteProfileResponse } from '../../types/mypage';
import toast from 'react-hot-toast';

export const useDeleteProfile = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation<DeleteProfileResponse>({
    mutationFn: deleteProfile,
    onSuccess: ({ result, message }) => {
      toast.success(result || message || '회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      qc.clear(); // React Query 캐시 전체 비우기
      navigate('/login', { replace: true });
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error
          ? error.message
          : '회원 탈퇴 중 오류가 발생했습니다.';
      console.error('[useDeleteProfile] 탈퇴 실패:', error);
      toast.error(msg);
    },
  });
};
