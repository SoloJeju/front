import { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useSignup } from '../../hooks/auth/useSignup';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180);
  const [passwordError, setPasswordError] = useState(false);

  const {
    sendCode,
    isSendingCode,
    verifyCode,
    isVerifyingCode,
    executeSignup,
    isSigningUp,
  } = useSignup();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordFormValid = password && passwordCheck && !passwordError;

  useEffect(() => {
    if (!isCodeSent) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setIsCodeSent(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCodeSent]);

  useEffect(() => {
    setPasswordError(passwordCheck !== '' && password !== passwordCheck);
  }, [password, passwordCheck]);

  const handleSendCode = () => {
    if (!isEmailValid) return;
    sendCode(
      { email },
      {
        onSuccess: () => {
          setTimer(180);
          setIsCodeSent(true);
        },
      }
    );
  };

  const handleVerifyCode = () => {
    verifyCode(
      { email, code: Number(authCode) },
      {
        onSuccess: () => setIsVerified(true),
        onError: () => setIsVerified(false),
      }
    );
  };

  const handleSignup = () => {
    if (!isPasswordFormValid || !isVerified) {
      alert('이메일 인증과 비밀번호 확인이 필요합니다.');
      return;
    }
    executeSignup({ email, password });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleVerifyCode();
  };

  // Step 1: 이메일 인증
  if (!isVerified)
    return (
      <div className="px-6 pt-10 pb-6 bg-white min-h-screen">
        <h1 className="text-[24px] font-bold mb-6">회원 가입</h1>
        <div className="flex flex-col space-y-4">
          <Input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            endAdornment={
              <Button
                size="small"
                disabled={!isEmailValid || isSendingCode}
                onClick={handleSendCode}
              >
                {isCodeSent ? '재전송' : '인증'}
              </Button>
            }
          />
          {isCodeSent && (
            <p className="mt-1 text-sm text-[#F78938]">
              이메일이 전송되었습니다. 이메일을 확인해 주세요.
            </p>
          )}
          <Input
            type="text"
            placeholder="인증번호"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            onKeyDown={handleKeyDown}
            endAdornment={
              isCodeSent &&
              timer > 0 && (
                <span className="ml-4 text-[#B4B4B4]">
                  {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(
                    2,
                    '0'
                  )}`}
                </span>
              )
            }
          />
        </div>
        <div className="mt-8">
          <Button
            onClick={handleVerifyCode}
            disabled={!authCode || isVerifyingCode}
          >
            인증하기
          </Button>
        </div>
      </div>
    );

  // Step 2: 비밀번호 입력
  return (
    <div className="px-6 pt-15 pb-6 bg-white min-h-screen">
      <h1 className="text-[24px] font-bold mb-6">회원 가입</h1>
      <div className="flex flex-col space-y-4">
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            error={passwordError}
          />
          {passwordError && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <Button
          onClick={handleSignup}
          disabled={!isPasswordFormValid || isSigningUp}
        >
          프로필 생성하러 가기
        </Button>
      </div>
    </div>
  );
}
