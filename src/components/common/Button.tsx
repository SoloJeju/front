// src/components/common/Button.tsx

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "large" | "small";
}

export default function Button({
  children,
  className,
  disabled,
  variant = "primary",
  size = "large",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        // 1. 공통 스타일
        "font-semibold rounded-[8px] flex-shrink-0 transition-all duration-200 ease-out transform",

        // 2. 사이즈에 따른 스타일
        {
          "w-full h-12 text-lg": size === "large",
          "h-9 px-4 text-sm": size === "small",
        },

        // 3. ✨ 활성화/비활성화 상태에 따른 스타일
        disabled
          ? "bg-[#D9D9D9] text-[#666666] cursor-default shadow-none scale-100" // 비활성화
          : {
              // 활성화
              "bg-[#F78938] text-white hover:bg-[#f57a20] hover:shadow-md hover:scale-[1.02]":
                variant === "primary",
              "bg-[#D9D9D9] text-[#666666] hover:bg-[#c1c1c1] hover:shadow-md hover:scale-[1.02]":
                variant === "secondary",
            },

        className
      )}
    >
      {children}
    </button>
  );
}
