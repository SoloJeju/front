import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180);
  const [passwordError, setPasswordError] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordFormValid = password && passwordCheck && !passwordError;

  // 타이머 로직
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

  // 비밀번호 일치 체크
  useEffect(() => {
    setPasswordError(passwordCheck !== '' && password !== passwordCheck);
  }, [password, passwordCheck]);

  const handleSendCode = () => {
    if (!isEmailValid) return;
    setTimer(180);
    setIsCodeSent(true);
    toast.success('인증번호가 전송되었습니다.');
  };

  const handleVerifyCode = () => {
    if (authCode === '123455') {
      setIsVerified(true);
      toast.success('인증되었습니다.');
    } else {
      setIsVerified(false);
      toast.error('인증번호가 틀립니다.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleVerifyCode();
  };

  if (step === 1)
    return (
      <div className="px-6 pt-15 pb-6 bg-white min-h-screen">
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
                disabled={!isEmailValid}
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
          <Button onClick={() => setStep(2)} disabled={!isVerified}>
            비밀번호 입력하러 가기
          </Button>
        </div>
      </div>
    );

  if (step === 2)
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
          {/* navigate로 프로필 페이지 이동 */}
          <Button
            onClick={() => navigate('/profile/create')}
            disabled={!isPasswordFormValid}
          >
            프로필 생성하러 가기
          </Button>
        </div>
      </div>
    );
}
