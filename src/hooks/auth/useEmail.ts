import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useProfileStore } from '../../stores/profile-store';
import { checkEmail, sendEmailCode, checkEmailCode } from '../../apis/auth';
import { isAxiosError } from 'axios';

interface UseEmailProps {
  onSuccess: () => void;
  skipDuplicateCheck?: boolean; // 이메일 중복 검사 건너뛰기 옵션
}

export const useEmail = ({ onSuccess, skipDuplicateCheck = false }: UseEmailProps) => {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(180);
  const storeSetEmail = useProfileStore((state) => state.setEmail);

  const { mutate: checkEmailMutation, isPending: isCheckingEmail } = useMutation({ mutationFn: checkEmail });
  const { mutate: sendCodeMutation, isPending: isSendingCode } = useMutation({ mutationFn: sendEmailCode });
  const { mutate: verifyCodeMutation, isPending: isVerifyingCode } = useMutation({ mutationFn: checkEmailCode });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendCode = () => {
    if (!isEmailValid) return;

    const sendCodeAction = () => {
      sendCodeMutation({ email }, {
        onSuccess: () => { 
          toast.success('인증번호가 전송되었습니다.'); 
          setIsCodeSent(true); 
          setTimer(180); 
        },
        onError: (err: Error) => {
          toast.error(err.message || '인증번호 전송 실패');
        },
      });
    };

    if (skipDuplicateCheck) {
      // 비밀번호 찾기: 중복 검사 없이 바로 인증번호 전송
      sendCodeAction();
    } else {
      // 회원가입: 중복 검사 후 인증번호 전송
      checkEmailMutation({ email }, {
        onSuccess: sendCodeAction,
        onError: (err) => {
          if (isAxiosError(err) && err.response) toast.error(err.response.data.message || '이미 사용 중인 이메일');
          else toast.error((err as Error).message || '이미 사용 중인 이메일');
        },
      });
    }
  };

  const handleVerifyCode = () => {
    verifyCodeMutation({ email, number: Number(authCode) }, {
      onSuccess: () => {
        toast.success('이메일이 인증되었습니다.');
        // 회원가입 시에만 Zustand 스토어에 이메일 저장
        if (!skipDuplicateCheck) {
          storeSetEmail(email);
        }
        onSuccess();
      },
      onError: (err) => {
        if (isAxiosError(err) && err.response) toast.error(err.response.data.message || '인증번호가 틀립니다.');
        else toast.error((err as Error).message || '인증번호가 틀립니다.');
      },
    });
  };

  useEffect(() => {
    if (!isCodeSent) return;
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [isCodeSent]);
  
  useEffect(() => { 
    if (timer === 0) setIsCodeSent(false); 
  }, [timer]);

  return { email, setEmail, authCode, setAuthCode, isCodeSent, timer, isEmailValid, isCheckingEmail, isSendingCode, isVerifyingCode, handleSendCode, handleVerifyCode };
};