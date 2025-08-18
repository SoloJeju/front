import React from 'react';

interface InputContentProps {
  content: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

const InputContent = ({ content, onChange }: InputContentProps) => {
  return (
    <div className="w-full max-w-[480px] mx-auto">
      <label htmlFor="content" className="sr-only">
        내용
      </label>
      <textarea
        name="content"
        id="content"
        placeholder="내용을 입력하세요"
        className="w-full h-[calc(100dvh-300px)] placeholder:text-[#B4B4B4] text-base resize-none focus:border-[#FFCEAA] focus:outline focus:border-2 focus:rounded-lg"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default React.memo(InputContent);
