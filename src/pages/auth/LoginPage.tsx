import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import logoImage from '../../assets/logo-sernam.svg';
import kakaoLogo from '../../assets/kakao.svg';
import { useLogin } from '../../hooks/auth/useLogin';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { executeLogin, isLoggingIn } = useLogin();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    executeLogin({ email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 font-Pretendard bg-white">
      <main className="w-full mx-auto mb-20">
        {/* 로고 영역 */}
        <div className="my-16 text-center">
          <img src={logoImage} alt="혼자옵서예 로고" className="w-65 mx-auto" />
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="pt-8">
            <Button type="submit" disabled={!isFormValid || isLoggingIn}>
              <span className="font-semibold">
                {isLoggingIn ? '로그인 중...' : '로그인'}
              </span>
            </Button>
          </div>
        </form>

        {/* 구분선 */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-[#D9D9D9]"></div>
          <span className="mx-4 text-sm text-[#B4B4B4]">또는</span>
          <div className="flex-grow border-t border-[#D9D9D9]"></div>
        </div>

        {/* 카카오 로그인  */}
        <a
          href={`${import.meta.env.VITE_API_URL}/oauth2/authorization/kakao`}
          className="flex items-center justify-center w-full py-3 bg-[#FEE500] rounded-[10px] hover:opacity-75"
        >
          <img src={kakaoLogo} alt="카카오 로고" className="w-5 h-5" />
          <span className="ml-2 text-[16px] font-semibold text-black text-opacity-85">
            카카오 로그인
          </span>
        </a>

        {/* 하단 링크 */}
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
