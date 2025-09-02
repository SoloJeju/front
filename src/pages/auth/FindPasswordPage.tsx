import { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { usePasswordChange } from '../../hooks/auth/usePasswordChange';
import { useSignup } from '../../hooks/auth/useSignup';

export default function FindPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const { executeChangePassword, isChangingPassword } = usePasswordChange();
  const { sendCode, isSendingCode, verifyCode, isVerifyingCode } = useSignup();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordFormValid = password && passwordCheck && !passwordError;

  useEffect(() => {
    setPasswordError(passwordCheck !== '' && password !== passwordCheck);
  }, [password, passwordCheck]);

  const handleSendCode = () => {
    if (!isEmailValid) return;
    sendCode({ email });
  };

  const handleVerifyCode = () => {
    verifyCode(
      { email, code: Number(authCode) },
      {
        onSuccess: () => {
          setStep(2);
        },
      }
    );
  };

  const handlePasswordReset = () => {
    if (!isPasswordFormValid) return;
    executeChangePassword({ email, password });
  };

  // Step 1: 이메일 인증
  if (step === 1) {
    return (
      <div className="min-h-screen px-6 pt-15 pb-6 font-Pretendard bg-white">
        <main className="w-full mx-auto mb-20">
          <h1 className="text-2xl font-bold mb-8">비밀번호 찾기</h1>
          <div className="flex flex-col space-y-4">
            <Input
              type="email"
              placeholder="가입한 이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              endAdornment={
                <Button
                  size="small"
                  disabled={!isEmailValid || isSendingCode}
                  onClick={handleSendCode}
                >
                  {isSendingCode ? '전송중...' : '인증'}
                </Button>
              }
            />
            <Input
              type="text"
              placeholder="인증번호"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
          </div>
          <div className="mt-8">
            <Button
              onClick={handleVerifyCode}
              disabled={!authCode || isVerifyingCode}
            >
              {isVerifyingCode ? '확인중...' : '인증번호 확인'}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Step 2: 새 비밀번호 입력
  if (step === 2) {
    return (
      <div className="min-h-screen px-6 pt-15 pb-6 font-Pretendard bg-white">
        <main className="w-full max-w-sm mx-auto mb-20">
          <h1 className="text-2xl font-bold mb-8">새 비밀번호 설정</h1>
          <div className="flex flex-col space-y-4">
            <Input
              type="password"
              placeholder="새 비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              <Input
                type="password"
                placeholder="새 비밀번호 확인"
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
              onClick={handlePasswordReset}
              disabled={!isPasswordFormValid || isChangingPassword}
            >
              {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </div>
        </main>
      </div>
    );
  }
}
