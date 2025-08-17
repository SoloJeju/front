//회원가입, 로그인 페이지에 공통으로 사용
import React from "react";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="px-6 pt-10 pb-6 bg-white">
      <h1 className="text-[24px] font-semibold mb-8">{title}</h1>
      {children}
    </div>
  );
}
