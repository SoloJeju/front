import { useMutation } from '@tanstack/react-query';
import { validatePassword } from '../../apis/auth';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';

export const useValidatePassword = () => {
  const { 
    mutate: checkPassword, 
    isPending: isCheckingPassword,
    isSuccess: isPasswordValid,
  } = useMutation({
    mutationFn: validatePassword,
    onSuccess: (data) => {
      toast.success(data.result || '사용 가능한 비밀번호입니다.');
    },
    onError: (error) => {
      console.error('비밀번호 유효성 검사 실패:', error); 
      if (isAxiosError(error) && error.response) {
        const serverMessage = error.response.data?.message;
        toast.error(serverMessage || '사용할 수 없는 비밀번호입니다.');
      } else {
        toast.error((error as Error).message || '알 수 없는 오류가 발생했습니다.');
      }
    },
  });

  return { checkPassword, isCheckingPassword, isPasswordValid };
};
