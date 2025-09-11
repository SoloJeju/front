import React, { useState } from 'react';
import EasyIcon from '../../assets/EASY.svg?react';
import MediumIcon from '../../assets/NORMAL.svg?react';
import HardIcon from '../../assets/HARD.svg?react';
import DropdownIcon from '../../assets/dropdown.svg?react';
import FilterIcon from '../../assets/Filter.svg?react'; 

import type { Difficulty } from '../../types/tourist';

interface DifficultyFilterProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: { label: string; value: Difficulty; icon?: React.ReactNode }[] = [
  { label: '혼놀 난이도', value: 'NONE', icon: <FilterIcon className="w-5 h-5 text-[#777]"/> },
  { label: '쉬움', value: 'EASY', icon: <EasyIcon className="w-5 h-5" /> },
  { label: '보통', value: 'MEDIUM', icon: <MediumIcon className="w-5 h-5" /> },
  { label: '어려움', value: 'HARD', icon: <HardIcon className="w-5 h-5" /> },
];

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({
  selectedDifficulty,
  onDifficultyChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedItem = DIFFICULTIES.find((d) => d.value === selectedDifficulty);

  return (
    <div className="px-4 py-2 font-[Pretendard] relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-between px-2 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2 mr-2">
          {selectedItem?.icon}
          <span>{selectedItem?.label ?? '난이도 선택'}</span>
        </div>
        <DropdownIcon className={`w-4 h-4 transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute mt-1 w-40 rounded-lg bg-white shadow-lg border border-gray-200 z-10">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.value}
              onClick={() => {
                onDifficultyChange(diff.value);
                setShowDropdown(false);
              }}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-100
                ${selectedDifficulty === diff.value ? 'text-[#F78938]' : 'text-gray-700'}`}
            >
              {diff.icon}
              <span>{diff.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DifficultyFilter;
