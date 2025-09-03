import React from 'react';
import { NavLink as RR_NavLink, type To } from 'react-router-dom';
import { useUnreadMessages } from '../../../hooks/mypage/useUnreadMessages';

interface NavLinkProps {
  to: To;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  alt: string;
}

const Navlink = ({ to, Icon, alt }: NavLinkProps) => {
  const isPlus = alt === '더보기';
  const isMyPage = alt === '마이';
  const { data: unreadMessagesData } = useUnreadMessages();
  const hasUnreadMessages = unreadMessagesData?.result;

  return (
    <RR_NavLink to={to} className="flex flex-col items-center w-6 relative">
      {({ isActive }) => (
        <>
          <div className="relative">
            <Icon
              aria-label={alt}
              className={`transition-colors ${isPlus ? 'w-10 h-10' : 'w-6 h-6'} ${
                isActive ? 'text-[#F78938]' : 'text-[#D9D9D9]'
              }`}
            />
            {/* 미확인 메시지가 있을 때 빨간색 점 표시 */}
            {isMyPage && hasUnreadMessages && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>
          {!isPlus && (
            <span
              className={`font-['Pretendard'] text-[10px] text-center text-semibold leading-3 truncate ${
                isActive ? 'text-[#F78938]' : 'text-[#D9D9D9]'
              }`}
            >
              {alt}
            </span>
          )}
        </>
      )}
    </RR_NavLink>
  );
};

export default Navlink;
