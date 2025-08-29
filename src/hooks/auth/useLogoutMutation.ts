// src/hooks/auth/useLogoutMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../../apis/auth';
import { useAuthStore } from '@/stores/auth-store'; //아직 안 만ㄷ름
import { useNavigate } from 'react-router-dom';

export const useLogoutMutation = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Tanstack Query 클라이언트

  return useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
};