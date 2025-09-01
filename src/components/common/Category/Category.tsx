import CategoryButton from './CategoryButton';
import Menu from '../../../assets/menu.svg?react';
import Help from '../../../assets/question.svg?react';
import Users from '../../../assets/with.svg?react';
import Tip from '../../../assets/tip.svg?react';

interface CategoryGroupProps {
  selected: string;
  setSelected: (type: string) => void;
}

const categories = [
  { type: '전체', icon: <Menu /> },
  { type: '궁금해요', icon: <Help /> },
  { type: '동행제안', icon: <Users /> },
  { type: '혼행꿀팁', icon: <Tip /> },
] as const;

export default function CategoryGroup({
  selected,
  setSelected,
}: CategoryGroupProps) {
  return (
    <div className="fixed top-15 overflow-x-auto scrollbar-hide bg-[#fffffd]">
      <div className="flex gap-2 whitespace-nowrap px-1 py-3 w-max">
        {categories.map(({ type, icon }) => (
          <CategoryButton
            key={type}
            icon={icon}
            label={type}
            selected={selected === type}
            onClick={() => setSelected(type)}
          />
        ))}
      </div>
    </div>
  );
}
