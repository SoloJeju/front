import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 버튼 활성화 여부를 결정하는 변수
  const isFormValid = isEmailValid && password;

  // API 호출 대신 alert 띄우는 상태
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    alert(`UI 테스트\n아이디: ${email}\n비밀번호: ${password}`);
  };

  // 카카오 로그인 버튼 클릭 시 동작 (UI 테스트용)
  const handleKakaoLogin = () => {
    alert("UI 테스트: 카카오로 시작하기 버튼 클릭");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 font-Pretendard bg-white">
      <main className="w-full max-w-sm mx-auto mb-20">
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
            <Button type="submit" disabled={!isFormValid}>
              로그인
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
          className="flex items-center justify-center w-full py-3 bg-[#FEE500] rounded-lg hover:opacity-75"
        >
          <img src="/kakao.svg" alt="카카오 로고" className="w-5 h-5" />
          <span className="ml-2 text-lg font-bold text-black text-opacity-85">
            카카오 로그인
          </span>
        </button>

        {/* 하단 링크 */}
        <div className="flex items-center justify-center mt-12 space-x-4 text-sm text-[#000000CC]">
          <Link to="/find-password">비밀번호 찾기</Link>
          <span className="text-gray-300">|</span>
          <Link
            to="/signup"
            className="font-SemiBold text-primary text-[#F78938]"
          >
            가입하기
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
