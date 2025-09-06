import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean; // 에러 시 테두리 색
  endAdornment?: React.ReactNode; // 우측 아이콘/버튼 등
  caption?: string; // caption props 추가
}

export default function Input({
  className,
  error,
  endAdornment,
  caption,
  ...props
}: InputProps) {
  return (
    <div className={className}>
      <div
        className={clsx(
          'flex items-center justify-between border-b h-12',
          error ? 'border-red-500' : 'border-[#D9D9D9]'
        )}
      >
        <input
          {...props}
          className="flex-1 w-full bg-transparent focus:outline-none placeholder:text-[#B4B4B4] font-[Pretendard]"
        />
        {endAdornment && <div className="ml-4">{endAdornment}</div>}
      </div>

      {caption && <p className="mt-1.5 text-xs text-gray-500">{caption}</p>}
    </div>
  );
}
