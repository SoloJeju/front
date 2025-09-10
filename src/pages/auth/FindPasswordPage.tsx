import { useState, useEffect, useMemo } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

import { useEmail } from '../../hooks/auth/useEmail';
import { useValidatePassword } from '../../hooks/auth/useValidatePassword';
import { usePasswordChange } from '../../hooks/auth/usePasswordChange';

/** 칩 형태의 규칙 표시 */
function CriteriaChips({ items }: { items: { met: boolean; text: string }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2 text-[12px] leading-5">
      {items.map((it, i) => (
        <span
          key={i}
          className={[
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors',
            it.met
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-50 text-gray-500 border border-gray-200',
          ].join(' ')}
        >
          <span
            className={[
              'inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
              it.met
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-600',
            ].join(' ')}
          >
            {it.met ? '✓' : '✕'}
          </span>
          {it.text}
        </span>
      ))}
    </div>
  );
}

/** 비밀번호 보기/숨기기 아이콘 (마이크로 인터랙션 포함) */
function EyeAdornment({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      aria-label={shown ? '비밀번호 숨기기' : '비밀번호 보기'}
      className="flex items-center justify-center w-7 h-7 -mr-1 cursor-pointer select-none rounded opacity-60 hover:opacity-100 focus:opacity-100 transition duration-150 active:scale-95"
      title={shown ? '비밀번호 숨기기' : '비밀번호 보기'}
    >
      {shown ? (
        <svg
          viewBox="0 0 24 24"
          className="block h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {' '}
          <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" />{' '}
          <circle cx="12" cy="12" r="3" />{' '}
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="block h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {' '}
          <path d="M3 3l18 18" />{' '}
          <path d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.12-.88" />{' '}
          <path d="M9.9 4.6A10.7 10.7 0 0112 4c6 0 10 6 10 8 0 1.36-.69 2.92-1.82 4.28M6.1 6.1A10.7 10.7 0 002 12c0 2 4 8 10 8 1.35 0 2.64-.27 3.82-.74" />{' '}
        </svg>
      )}
    </span>
  );
}

/** 비밀번호 규칙 설정 객체 */
const passwordCriteria = [
  {
    text: '8~12자 이내',
    validator: (pwd: string) => pwd.length >= 8 && pwd.length <= 12,
  },
  {
    text: '영문(대/소), 숫자 중 2가지 이상',
    validator: (pwd: string) => {
      const typeCount = [
        /[A-Z]/.test(pwd),
        /[a-z]/.test(pwd),
        /[0-9]/.test(pwd),
      ].filter(Boolean).length;
      return typeCount >= 2;
    },
  },
];

export default function FindPasswordPage() {
  const [step, setStep] = useState(1);

  // --- 1단계: 이메일 인증 로직 ---
  const {
    email,
    setEmail,
    authCode,
    setAuthCode,
    timer,
    isCodeSent,
    isEmailValid,
    isSendingCode,
    isVerifyingCode,
    handleSendCode,
    handleVerifyCode,
  } = useEmail({
    onSuccess: () => setStep(2),
    skipDuplicateCheck: true,
  });

  // --- 2단계: 비밀번호 설정 로직 ---
  const { executeChangePassword, isChangingPassword } = usePasswordChange();
  const { checkPassword, isCheckingPassword } = useValidatePassword();

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const validationResults = useMemo(() => {
    return passwordCriteria.map((criterion) => ({
      text: criterion.text,
      met: criterion.validator(password),
    }));
  }, [password]);

  const areCriteriaMet = validationResults.every((item) => item.met);

  const isPasswordFormValid =
    password && passwordCheck && !passwordError && areCriteriaMet;

  useEffect(() => {
    setPasswordError(passwordCheck !== '' && password !== passwordCheck);
  }, [password, passwordCheck]);

  const handlePasswordBlur = () => {
    if (areCriteriaMet) {
      checkPassword(password);
    }
  };

  const handlePasswordReset = () => {
    if (!isPasswordFormValid || !email) {
      toast.error('입력 정보를 다시 확인해주세요.');
      return;
    }
    executeChangePassword({ email, password });
  };

  // Step 1: 이메일 인증
  if (step === 1) {
    return (
      <div className="min-h-screen px-6 pt-15 pb-6 font-Pretendard bg-white">
        <main className="w-full mx-auto mb-20">
          <h1 className="text-[24px] font-bold mb-6">비밀번호 찾기</h1>
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
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
              endAdornment={
                isCodeSent &&
                timer > 0 && (
                  <span className="ml-4 text-gray-400 whitespace-nowrap">{`${Math.floor(
                    timer / 60
                  )}:${String(timer % 60).padStart(2, '0')}`}</span>
                )
              }
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
          <h1 className="text-[24px] font-bold mb-6">새 비밀번호 설정</h1>
          <div className="flex flex-col space-y-5">
            <div>
              <Input
                type={showPwd ? 'text' : 'password'}
                placeholder="새 비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                endAdornment={
                  <EyeAdornment
                    shown={showPwd}
                    onToggle={() => setShowPwd((v) => !v)}
                  />
                }
              />
              <CriteriaChips items={validationResults} />
            </div>
            <div>
              <Input
                type={showPwd2 ? 'text' : 'password'}
                placeholder="새 비밀번호 확인"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                error={passwordError}
                endAdornment={
                  <EyeAdornment
                    shown={showPwd2}
                    onToggle={() => setShowPwd2((v) => !v)}
                  />
                }
              />
              {passwordError && (
                <p className="mt-2 text-xs text-red-500">
                  {' '}
                  비밀번호가 일치하지 않습니다.{' '}
                </p>
              )}
            </div>
          </div>
          <div className="mt-8">
            <Button
              onClick={handlePasswordReset}
              disabled={
                !isPasswordFormValid || isChangingPassword || isCheckingPassword
              }
            >
              {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
