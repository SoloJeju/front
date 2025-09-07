import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../../apis/auth';
import { clearAuthData } from '../../apis/axios'; // clearAuthData 
import { isAxiosError } from 'axios';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: executeLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      try {
        const response = await logout();
        return response;
      } catch (error) {
        console.error("로그아웃 실패:", error);
        
        if (isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
          }
          throw new Error(error.response.data?.message || '로그아웃 중 오류가 발생했습니다.');
        }
        throw new Error('서버에 연결할 수 없거나, 알 수 없는 오류가 발생했습니다.');
      }
    },
    onSuccess: () => {
      clearAuthData(); // 로그아웃 성공 시 토큰 및 데이터 제거
      queryClient.clear(); // Tanstack Query 캐시 클리어
      
      toast.success('로그아웃되었습니다.');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message);

      if (error.message.includes('인증이 만료')) {
        clearAuthData();
        queryClient.clear();
        navigate('/login');
      }
    },
  });

  return { executeLogout, isLoggingOut };
};