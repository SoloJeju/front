import React from 'react';
import EasyIcon from '../../assets/EASY.svg?react';
import MediumIcon from '../../assets/NORMAL.svg?react';
import HardIcon from '../../assets/HARD.svg?react';

import type { Difficulty } from '../../types/tourist';

interface DifficultyFilterProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: { label: string; value: Difficulty; icon?: React.ReactNode }[] = [
  { label: '혼놀 난이도', value: 'NONE' },
  { label: '쉬움', value: 'EASY', icon: <EasyIcon className="w-5 h-5" /> },
  { label: '보통', value: 'MEDIUM', icon: <MediumIcon className="w-5 h-5" /> },
  { label: '어려움', value: 'HARD', icon: <HardIcon className="w-5 h-5" /> },
];

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({
  selectedDifficulty,
  onDifficultyChange,
}) => {
  return (
    <div className="px-4 py-2 font-[Pretendard]">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.value}
            onClick={() => onDifficultyChange(diff.value)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out border whitespace-nowrap
              ${
                selectedDifficulty === diff.value
                  ? 'bg-[#F78938] text-white border-[#F78938] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-orange-50 hover:border-orange-200'
              }`}
          >
            {diff.icon}
            <span>{diff.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultyFilter;
