import React from "react";
import clsx from "clsx"; // 클래스 이름을 합치기 위한 유틸리티

// ✨ 1. React의 기본 div 속성을 포함하도록 타입을 확장합니다.
interface InputProps extends React.HTMLAttributes<HTMLDivElement> {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  endAdornment?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  // ✨ 2. className과 error를 비롯한 prop들을 분리해서 받습니다.
  className,
  type,
  placeholder,
  value,
  onChange,
  error,
  endAdornment,
  onKeyDown,
  ...props // 나머지 div 속성들 (id, style 등)
}: InputProps) {
  return (
    // ✨ 3. 최상위 div에 외부 className과 에러 상태에 따른 스타일을 적용합니다.
    <div
      className={clsx(
        "flex items-center justify-between border-b h-12",
        error ? "border-red-500" : "border-[#D9D9D9]", // 에러 상태에 따라 테두리 색 변경
        className // 외부에서 전달받은 className 적용
      )}
      {...props} // id 같은 나머지 속성들 적용
    >
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        // ✨ input 자체의 className은 내부 스타일로 고정
        className="flex-1 w-full bg-transparent focus:outline-none placeholder:text-[#B4B4B4] font-[Pretendard]"
      />
      {endAdornment && <div className="ml-4">{endAdornment}</div>}
    </div>
  );
}
