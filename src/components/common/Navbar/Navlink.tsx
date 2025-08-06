import React from 'react';
import { NavLink as RR_NavLink, type To } from 'react-router-dom';

interface NavLinkProps {
  to: To;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  alt: string;
}

const Navlink = ({ to, Icon, alt }: NavLinkProps) => {
  const isPlus = alt === '더보기';

  return (
    <RR_NavLink to={to} className="flex flex-col items-center w-6">
      {({ isActive }) => (
        <>
          <Icon
            aria-label={alt}
            className={`transition-colors ${isPlus ? 'w-10 h-10' : 'w-6 h-6'} ${
              isActive ? 'text-[#F78938]' : 'text-[#D9D9D9]'
            }`}
          />
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
