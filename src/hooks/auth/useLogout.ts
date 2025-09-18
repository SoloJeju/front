import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../../apis/auth';
import { clearAuthData } from '../../apis/axios';
import { useProfileStore } from '../../stores/profile-store';
import { isAxiosError } from 'axios';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: executeLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuthData();

      queryClient.clear();

      useProfileStore.getState().reset();

      localStorage.removeItem('user-profile-storage');

      toast.success('로그아웃되었습니다.');
      navigate('/login');
    },
    onError: (error: unknown) => {
      let message = '로그아웃 중 오류가 발생했습니다.';
      if (isAxiosError(error) && error.response) {
        message = error.response.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);

      // 인증 만료(401) 시에도 모든 데이터 초기화
      if (isAxiosError(error) && error.response?.status === 401) {
        clearAuthData();
        queryClient.clear();
        useProfileStore.getState().reset();
        localStorage.removeItem('user-profile-storage');
        navigate('/login');
      }
    },
  });

  return { executeLogout, isLoggingOut };
};
