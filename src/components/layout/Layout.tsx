import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode; // Layout으로 감싸질 자식 요소들
}

function Layout({ children }: LayoutProps) {
  return (
    // 전체 배경은 회색으로 설정하나요.....?
    <div className="flex justify-center w-full min-h-screen bg-gray-100">
      {/* 실제 콘텐츠가 보여질 영역 */}
      <div className="w-full max-w-[480px] min-h-screen bg-white shadow-md">
        {children}
      </div>
    </div>
  );
}

export default Layout;
