import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { changePassword } from '../../apis/auth';
import type { ChangePasswordRequest } from '../../types/auth';

export const usePasswordChange = () => {
  const navigate = useNavigate();

  const { mutate: executeChangePassword, isPending: isChangingPassword } =
    useMutation({
      mutationFn: (data: ChangePasswordRequest) => changePassword(data),
      onSuccess: () => {
        toast.success('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/login'); // 성공 시 로그인 페이지로 이동
      },
      onError: (error) => {
        console.error('비밀번호 변경 실패:', error);
        toast.error(error.message || '비밀번호 변경에 실패했습니다.');
      },
    });

  return {
    executeChangePassword,
    isChangingPassword,
  };
};