// 회원가입 2단계 - 비밀번호 입력, 유효성 검사
import { useState, useMemo } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { usePassword } from '../../../hooks/auth/usePassword';

function CriteriaChips({ items }: { items: { met: boolean; text: string }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2 text-[12px] leading-5 font-[Pretendard]">
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

function EyeAdornment({
  shown,
  onToggle,
  labelOn = '비밀번호 숨기기',
  labelOff = '비밀번호 보기',
}: {
  shown: boolean;
  onToggle: () => void;
  labelOn?: string;
  labelOff?: string;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      aria-label={shown ? labelOn : labelOff}
      className="
        flex items-center justify-center
        w-7 h-7 -mr-1 cursor-pointer select-none rounded
        opacity-60 hover:opacity-100 focus:opacity-100
        transition duration-150 active:scale-95
      "
      title={shown ? labelOn : labelOff}
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
          <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
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
          <path d="M3 3l18 18" />
          <path d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.12-.88" />
          <path d="M9.9 4.6A10.7 10.7 0 0112 4c6 0 10 6 10 8 0 1.36-.69 2.92-1.82 4.28M6.1 6.1A10.7 10.7 0 002 12c0 2 4 8 10 8 1.35 0 2.64-.27 3.82-.74" />
        </svg>
      )}
    </span>
  );
}

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

export default function PasswordStep({ onNext }: { onNext: () => void }) {
  const {
    password,
    setPassword,
    passwordCheck,
    setPasswordCheck,
    passwordError,
    isCheckingPassword,
    isPasswordValid,
    handlePasswordBlur,
    handleProceed,
  } = usePassword({ onSuccess: onNext });

  const validationResults = useMemo(
    () =>
      passwordCriteria.map((c) => ({
        text: c.text,
        met: c.validator(password),
      })),
    [password]
  );

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const isButtonDisabled =
    !password ||
    !passwordCheck ||
    passwordError ||
    !isPasswordValid ||
    isCheckingPassword;

  return (
    <div className="pt-15 pb-6 font-[Pretendard]">
      <h1 className="text-[24px] font-bold mb-6">비밀번호 설정</h1>

      <div className="flex flex-col space-y-5">
        {/* 비밀번호 입력 */}
        <div>
          <Input
            type={showPwd ? 'text' : 'password'}
            placeholder="비밀번호 입력"
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

        {/* 비밀번호 확인 */}
        <div>
          <Input
            type={showPwd2 ? 'text' : 'password'}
            placeholder="비밀번호 확인"
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
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleProceed} disabled={isButtonDisabled}>
          다음으로
        </Button>
      </div>
    </div>
  );
}
