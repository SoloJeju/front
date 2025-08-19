import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../../assets/search-magnifying-glass.svg?react';
import DropdownIcon from '../../assets/dropdown.svg?react';
import CircleIcon from '../../assets/circleIcon.svg?react';

const defaultRegions = ['전체', '남제주군', '북제주군', '서귀포시', '제주시'];
const defaultCategories = [
  { label: '전체', icon: CircleIcon },
  { label: '관광지', icon: CircleIcon },
  { label: '숙박', icon: CircleIcon },
  { label: '음식점', icon: CircleIcon },
  { label: '축제', icon: CircleIcon },
  { label: '레포츠', icon: CircleIcon },
  { label: '쇼핑', icon: CircleIcon },
  { label: '여행코스', icon: CircleIcon },
  { label: '문화시설', icon: CircleIcon },
];

const FilterBar = () => {
  const navigate = useNavigate();

  const [selectedRegion, setSelectedRegion] = useState('제주도');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center relative">
          <span className="text-black font-[Pretendard] text-2xl font-bold leading-[26px] tracking-[-0.48px]">
            {selectedRegion}
          </span>
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="ml-2"
            aria-label="지역 선택"
          >
            <DropdownIcon className="w-6 h-6" />
          </button>

          {showRegionDropdown && (
            <div
              className="absolute top-full left-0 mt-1 flex-shrink-0 z-10 shadow-md rounded-[12px] bg-[#FFFFFD]"
              style={{ width: '140px', height: '175px' }}
            >
              {defaultRegions.map((region) => (
                <button
                  key={region}
                  className={`w-full px-4 py-2 text-left font-[Pretendard] text-base font-medium leading-[18px] tracking-[-0.32px] hover:bg-gray-100
                    ${selectedRegion === region ? 'text-black' : 'text-[#666]'}`}
                  onClick={() => {
                    setSelectedRegion(region);
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

      <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
        {defaultCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <button  key={category.label + index} onClick={() => setSelectedCategory(category.label)}>
              <IconComponent
                className={`w-16 h-16 ${selectedCategory === category.label ? 'opacity-100' : 'opacity-60'}`}
              />
              <span className="mt-1 text-center text-black text-[12px] font-medium leading-[14px] font-[Pretendard]">
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
