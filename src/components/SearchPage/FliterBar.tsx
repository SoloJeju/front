import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../../assets/search-magnifying-glass.svg?react';
import DropdownIcon from '../../assets/dropdown.svg?react';
import AllIcon from '../../assets/category-all.svg?react';
import TourIcon from '../../assets/category-travel.svg?react';
import BedIcon from '../../assets/category-bed.svg?react';
import FoodIcon from '../../assets/category-food.svg?react';
import FestivalIcon from '../../assets/category-festival.svg?react';
import LeisureIcon from '../../assets/category-leisure.svg?react';
import ShoppingIcon from '../../assets/category-shopping.svg?react';
import CourseIcon from '../../assets/category-course.svg?react';
import CultureIcon from '../../assets/category-culture.svg?react';
import type { Category } from '../../types/searchmap';

const defaultRegions = ['전체', '남제주군', '북제주군', '서귀포시', '제주시'];
const defaultCategories = [
  { label: '전체', icon: AllIcon },
  { label: '관광지', icon: TourIcon },
  { label: '숙박', icon: BedIcon },
  { label: '음식점', icon: FoodIcon },
  { label: '축제', icon: FestivalIcon },
  { label: '레포츠', icon: LeisureIcon },
  { label: '쇼핑', icon: ShoppingIcon },
  { label: '여행코스', icon: CourseIcon },
  { label: '문화시설', icon: CultureIcon },
];

interface FilterBarProps {
  selectedRegion: string;
  onRegionChange: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: Category;
  onCategoryChange: React.Dispatch<React.SetStateAction<Category>>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedRegion,
  onRegionChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const navigate = useNavigate();
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center relative">
          <span className="text-black font-[Pretendard] text-2xl font-bold leading-[26px] tracking-[-0.48px]">
            {selectedRegion === '전체' ? '제주도' : selectedRegion}
          </span>
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="ml-2"
            aria-label="지역 선택"
          >
            <DropdownIcon className={`w-6 h-6 transform transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showRegionDropdown && (
            <div
              className="absolute top-full left-0 mt-1 flex-shrink-0 z-10 shadow-md rounded-[12px] bg-[#FFFFFD]"
              style={{ width: '140px', height: '175px' }}
            >
              {defaultRegions.map((region) => (
                <button
                  key={region}
                  className={`w-full py-2 text-left font-[Pretendard] text-base font-medium leading-[18px] tracking-[-0.32px] hover:bg-gray-100
                    ${selectedRegion === region ? 'text-black' : 'text-[#666]'}`}
                  onClick={() => {
                    onRegionChange(region);
                    setShowRegionDropdown(false);
                  }}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/search-box')}>
            <SearchIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 py-3 overflow-x-auto scrollbar-hide">
        {defaultCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.label + index}
              onClick={() => onCategoryChange(category.label as Category)}

            >
              <IconComponent
                className={`w-16 h-16 ${selectedCategory === category.label ? 'opacity-100' : 'opacity-60'}`}
                style={{ color: selectedCategory === category.label ? '#FFF7D1' : '#FFFFFD' }}
              />
              <span
                className="mt-1 text-center text-[12px] font-medium leading-[14px] font-[Pretendard]"
                style={{ color: selectedCategory === category.label ? '#F78938' : '#000' }}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;