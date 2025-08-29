// src/hooks/mutations/useLoginMutation.ts
import { useMutation } from '@tanstack/react-query';
import { AuthApi } from '../../apis/auth';
import { useAuthStore } from '@/stores/auth-store'; //아직 안 만들었슴
import { useNavigate } from 'react-router-dom';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: (data) => {
      // Zustand 스토어에 저장
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
      // 성공 시 원하는 페이지로 이동
      navigate('/');
    },
    onError: (error: any) => {
      console.error('로그인 실패:', error);
      alert('아이디와 비밀번호를 확인해주세요.');
    },
  });
};