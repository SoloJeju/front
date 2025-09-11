import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import logoImage from '../../assets/logo-sernam.svg';
import kakaoLogo from '../../assets/kakao.svg';
import { useLogin } from '../../hooks/auth/useLogin';
import useFCM from '../../hooks/alarm/useFCM';

// 아이토글
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
      className="
        flex items-center justify-center
        w-7 h-7 -mr-1 cursor-pointer select-none rounded
        opacity-60 hover:opacity-100 focus:opacity-100
        transition duration-150 active:scale-95
      "
      title={shown ? '비밀번호 숨기기' : '비밀번호 보기'}
    >
      {shown ? (
        // 눈 뜬 아이콘
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
        // 눈 감은(슬래시) 아이콘
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const { updateToken } = useFCM();

  const { executeLogin, isLoggingIn } = useLogin({
    onAfterSuccess: async () => {
      await updateToken();
    },
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isLoggingIn) return;
    executeLogin({ email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 font-[Pretendard] bg-white">
      <main className="w-full mx-auto mb-20">
        <div className="my-16 text-center">
          <img src={logoImage} alt="혼자옵서예 로고" className="w-65 mx-auto" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type={showPwd ? 'text' : 'password'}
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <EyeAdornment
                shown={showPwd}
                onToggle={() => setShowPwd((v) => !v)}
              />
            }
          />
          <div className="pt-8">
            <Button type="submit" disabled={!isFormValid || isLoggingIn}>
              <span className="font-semibold">
                {isLoggingIn ? '로그인 중...' : '로그인'}
              </span>
            </Button>
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-[#D9D9D9]" />
          <span className="mx-4 text-sm text-[#B4B4B4]">또는</span>
          <div className="flex-grow border-t border-[#D9D9D9]" />
        </div>

        <a
          href={`${import.meta.env.VITE_API_URL}/oauth2/authorization/kakao`}
          className="flex items-center justify-center w-full py-3 bg-[#FEE500] rounded-[10px] hover:opacity-75"
        >
          <img src={kakaoLogo} alt="카카오 로고" className="w-5 h-5" />
          <span className="ml-2 text-[16px] font-semibold text-black/85">
            카카오 로그인
          </span>
        </a>

        <div className="flex items-center justify-center mt-12 space-x-4 text-sm text-[#000000CC]">
          <Link to="/find-password" className="font-semibold">
            비밀번호 찾기
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/signup" className="font-semibold text-[#F78938]">
            가입하기
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
