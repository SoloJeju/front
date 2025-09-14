import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createKakaoProfile } from '../../apis/auth';
import type { KakaoProfileRequest, KakaoProfileResponse } from '../../types/auth';
import type { CommonResponse } from '../../types/common';
import { isAxiosError } from 'axios';

export const useKakaoSignup = () => {
  const navigate = useNavigate();

  const { mutate: executeKakaoSignup, isPending: isSigningUp } = useMutation<
    CommonResponse<KakaoProfileResponse>, // 성공 타입
    unknown,                             // 에러 타입
    KakaoProfileRequest                  // 변수 타입
  >({
    mutationFn: createKakaoProfile,
    onSuccess: (data) => {
      toast.success(`${data.result.name}님, 카카오 회원가입이 완료되었습니다.`);
      navigate('/');
    },
    onError: (error) => {
      console.error('카카오 회원가입 실패:', error);
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || '카카오 회원가입에 실패했습니다.');
      } else {
        const errMsg = error instanceof Error ? error.message : '카카오 회원가입에 실패했습니다.';
        toast.error(errMsg);
      }
    },
  });

  return { executeKakaoSignup, isSigningUp };
};
