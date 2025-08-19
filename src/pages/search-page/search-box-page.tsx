import { useState } from 'react';
import SearchIcon from '../../assets/search-magnifying-glass.svg?react';
import CloseIcon from '../../assets/closeIcon.svg?react';

const SearchBoxPage = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([
    '돌솥밥',
    '고등어 덮밥',
    '바다가 보이는 집',
    '성산 일출봉',
    '돌돔솥밥',
    '돌돌돌돌솥밥',
    '돌돌돌돌돌솥밥',
    '돌돌돌돌돌돌돌솥밥'
  ]);

  const removeHistoryItem = (item: string) => {
    setSearchHistory(prev => prev.filter(history => history !== item));
  };

  return (
<div className="flex justify-center bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] pb-10 px-4">
        <div className="flex items-center w-full gap-[12px] mt-5">
          <div className="flex-1 h-[40px] flex items-center border border-[#F78938] rounded-[20px] bg-[#FFFFFD] px-4">
            <input
              type="text"
              placeholder="검색어를 입력해주세요"
              className="flex-1 text-sm focus:outline-none font-medium placeholder:text-[#B4B4B4]"
            />
          </div>
          <SearchIcon className="w-[30px] h-[30px] text-[#F78938] cursor-pointer" />
        </div>
        <div className="mt-5">
          <p className="text-black text-base font-semibold mb-3">최근 검색어</p>
          <ul className="flex flex-col gap-3">
            {searchHistory.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between pb-1"
              >
                <span className="text-sm text-[#5D5D5D]">{item}</span>
                <button onClick={() => removeHistoryItem(item)}>
                  <CloseIcon className="w-4 h-4 text-[#F78938]" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchBoxPage;