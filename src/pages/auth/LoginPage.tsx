import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { login } from '../../apis/auth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 버튼 활성화 여부를 결정하는 변수
  const isFormValid = isEmailValid && password;

  // 실제 로그인 API 호출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);

      if (response.isSuccess) {
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', response.result.accessToken);
        localStorage.setItem('refreshToken', response.result.refreshToken);

        toast.success('로그인되었습니다!');
        navigate('/'); // 홈페이지로 이동
      } else {
        toast.error(response.message || '로그인에 실패했습니다.');
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : '로그인 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인 버튼 클릭 시 동작
  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 구현
    toast.success('카카오 로그인은 준비 중입니다.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 font-Pretendard bg-white">
      <main className="w-full mx-auto mb-20">
        {/* 로고 영역 */}
        <div className="my-16 text-center">
          <img
            src="/logo-sernam.svg"
            alt="혼자옵서예 로고"
            className="w-65 mx-auto"
          />
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* 아이디(이메일) 입력 필드 */}
          <Input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* 비밀번호 입력 필드 */}
          <Input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 로그인 버튼 */}
          <div className="pt-8">
            <Button type="submit" disabled={!isFormValid || isLoading}>
              <span className="font-semibold">
                {isLoading ? '로그인 중...' : '로그인'}
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

        {/* 카카오 로그인 버튼 */}
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="flex items-center justify-center w-full py-3 bg-[#FEE500] rounded-[10px] hover:opacity-75"
        >
          <img src="/kakao.svg" alt="카카오 로고" className="w-5 h-5" />
          <span className="ml-2 text-[16px] font-semibold text-black text-opacity-85">
            카카오 로그인
          </span>
        </button>

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
