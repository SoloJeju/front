import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../apis/auth';
import type { LoginRequest } from '../../types/auth';
import { isAxiosError } from 'axios';

type LoginHooksOptions = {
  onAfterSuccess?: () => Promise<void> | void;
};


interface ApiErrorResponse {
  message: string;
}

export const useLogin = (opts?: LoginHooksOptions) => {
  const navigate = useNavigate();

  const { mutate: executeLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: async (loginData: LoginRequest) => {
      return login(loginData);
    },
    onSuccess: async (data) => {
      if (data.result.accessToken && data.result.refreshToken) {
         localStorage.setItem('accessToken', data.result.accessToken);
         localStorage.setItem('refreshToken', data.result.refreshToken);
      }
      
      try {
        await opts?.onAfterSuccess?.();
      } catch (hookError) {
        console.error('[useLogin/onSuccess] 부가작업 실패:', hookError);
      }

      toast.success('로그인되었습니다!');
      navigate('/');
    },
    onError: (error: Error) => {
      console.error('[useLogin/onError] 로그인 최종 실패:', error);
      
  
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
    
        const status = error.response.status;
        const message = error.response.data.message; 

        if (status === 401) {
          toast.error('이메일 또는 비밀번호가 올바르지 않습니다.');
          return;
        }
        if (status === 500) {
          toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          return;
        }
        toast.error(message || '로그인 중 오류가 발생했습니다.');
      } else {
        // Axios 에러가 아닌 다른 종류의 에러 처리
        toast.error(error.message || '알 수 없는 오류가 발생했습니다.');
      }
    },
  });

  return { executeLogin, isLoggingIn };
};
