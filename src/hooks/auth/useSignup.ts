import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendEmailCode, checkEmailCode, signup } from '../../apis/auth';

export const useSignup = () => {
  const navigate = useNavigate();

  // 이메일 인증코드 전송 
  const { mutate: sendCode, isPending: isSendingCode } = useMutation({
    mutationFn: sendEmailCode,
    onSuccess: () => {
      toast.success('인증번호가 전송되었습니다.');
    },
    onError: (error) => {
      console.error('인증코드 전송 실패:', error); 
      toast.error(error.message || '인증번호 전송에 실패했습니다.');
    },
  });

  // 이메일 인증코드 확인 
  const { mutate: verifyCode, isPending: isVerifyingCode } = useMutation({
    mutationFn: checkEmailCode,
    onSuccess: () => {
      toast.success('인증되었습니다.');
    },
    onError: (error) => {
      console.error('인증코드 전송 실패:', error); 
      toast.error(error.message || '인증번호가 틀립니다.');
    },
  });

  // 최종 회원가입 
  const { mutate: executeSignup, isPending: isSigningUp } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      toast.success(`${data.result.name}님, 회원가입이 완료되었습니다.`);
      navigate('/profile/create');
    },
    onError: (error) => {
      console.error('인증코드 전송 실패:', error); 
      toast.error(error.message || '회원가입에 실패했습니다.');
    },
  });

  // 컴포넌트에서 사용할 함수와 상태들을 반환
  return {
    sendCode,
    isSendingCode,
    verifyCode,
    isVerifyingCode,
    executeSignup,
    isSigningUp,
  };
};