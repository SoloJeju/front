// src/hooks/auth/useSignupMutation.ts
import { useMutation } from '@tanstack/react-query';
import { AuthApi } from '../../apis/auth';
import { useNavigate } from 'react-router-dom';

export const useSignUpMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: AuthApi.userSignUp,
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 입력한 정보를 다시 확인해주세요.');
    },
  });
};