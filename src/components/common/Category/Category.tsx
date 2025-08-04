import React, { useState } from 'react';
import CategoryButton from './CategoryButton';
import Menu from '../../../assets/menu.svg?react';
import Help from '../../../assets/question.svg?react';
import Users from '../../../assets/with.svg?react';
import Tip from '../../../assets/tip.svg?react';
import Challenge from '../../../assets/challenge.svg?react';

const categories = [
  { type: '전체', icon: <Menu/> },
  { type: '궁금해요', icon: <Help/> },
  { type: '동행제안', icon: <Users/> },
  { type: '혼행꿀팁', icon: <Tip/> },
  { type: '챌린지', icon: <Challenge/> },
] as const;

export default function CategoryGroup() {
  const [selected, setSelected] = useState('전체');

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 whitespace-nowrap py-3 w-max">
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

