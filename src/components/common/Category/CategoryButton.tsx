import React from 'react';

interface CategoryButtonProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const CategoryButton = ({ icon, label, selected, onClick }: CategoryButtonProps) => {
  const styledIcon = React.cloneElement(icon, {
    className: `w-4 h-4 ${selected ? 'stroke-[#FFFFFD]' : 'stroke-[#5D5D5D]'}`,
  });

  return (
    <button
      onClick={onClick}
      className={`flex items-center font-['Pretendard'] gap-1 px-3 py-1.5 rounded-[20px] text-sm font-medium
        ${selected 
          ? 'bg-[#F78938] text-white shadow-[0px_0px_2px_1px_rgba(247,137,56,1.00)]' 
          : 'bg-white text-[#5D5D5D] shadow-[0px_0px_2px_1px_rgba(0,0,0,0.25)]'}
        transition-colors duration-200`}
    >
      {styledIcon}
      <span>{label}</span>
    </button>
  );
};

export default CategoryButton;
