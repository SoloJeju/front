import React from 'react';

interface InputTitleProps {
  title: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

const InputTitle = ({ title, onChange }: InputTitleProps) => {
  return (
    <div className="w-full h-12">
      <label htmlFor="title" className="sr-only">
        제목
      </label>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="제목"
        className="w-full font-[pretendard] font-medium text-base placeholder:text-[#B4B4B4] border-b-2 border-[#FFCEAA] focus:border-[#FFCEAA] focus:outline focus:border-2 focus:rounded-lg"
        value={title}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default React.memo(InputTitle);
