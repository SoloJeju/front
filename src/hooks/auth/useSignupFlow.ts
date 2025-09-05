// 회원가입 흐름 제어 (최종제출 훅)


import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signup } from '../../apis/auth';
import type { SignupRequest, SignupResponse } from '../../types/auth';
import type { CommonResponse } from '../../types/common';
import { isAxiosError } from 'axios';

export const useSignup = () => {
  const navigate = useNavigate();

  const { mutate: executeSignup, isPending: isSigningUp } = useMutation<
    CommonResponse<SignupResponse>,
    Error,
    SignupRequest
  >({
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success(`${data.result.name}님, 회원가입이 완료되었습니다.`);
      navigate('/'); 
    },
    onError: (error) => {
      console.error('최종 회원가입 실패:', error);
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || '회원가입에 실패했습니다.');
      } else {
        toast.error((error as Error).message || '회원가입에 실패했습니다.');
      }
    },
  });

  return { executeSignup, isSigningUp };
};