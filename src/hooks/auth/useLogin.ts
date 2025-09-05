import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../apis/auth';
import type { LoginRequest } from '../../types/auth';
import { isAxiosError } from 'axios';

type LoginHooksOptions = {
  onAfterSuccess?: () => Promise<void> | void;
};

export const useLogin = (opts?: LoginHooksOptions) => {
  const navigate = useNavigate();

  const { mutate: executeLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: async (loginData: LoginRequest) => {
      try {
        return await login(loginData);
      } catch (error) {
        console.error('[useLogin/mutationFn] 로그인 요청 실패:', error);

        if (isAxiosError(error) && error.response) {
          const status = error.response.status;
          const message = (error.response.data as any)?.message;

          if (status === 401) {
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
          }
          if (status === 500) {
            throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          }
          throw new Error(message || '로그인 중 오류가 발생했습니다.');
        }

        throw new Error('서버에 연결할 수 없거나, 알 수 없는 오류가 발생했습니다.');
      }
    },
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.result.accessToken);
      localStorage.setItem('refreshToken', data.result.refreshToken);

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
      toast.error(error.message);
    },
  });

  return { executeLogin, isLoggingIn };
};
