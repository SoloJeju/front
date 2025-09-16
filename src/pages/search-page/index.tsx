import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/SearchPage/FliterBar';
import PlaceList from '../../components/SearchPage/PlaceList';
import DifficultyFilter from '../../components/SearchPage/DifficultyFilter';
import Menu from '../../assets/menu.svg?react';
import Cart from '../../assets/cartIcon.svg?react';
import PostNone from '../../assets/post-none.svg';
import { useGetTouristList } from '../../hooks/tourist/useGetTouristList';
import type { ContentTypeId, Difficulty } from '../../types/tourist';
import ScrollTopButton from '../../components/SearchPage/ScrollTopButton';
import SkeletonPlaceList from '../../components/SkeletonUI/SkeletonPlaceList';
import type { Category } from '../../types/searchmap';

const SIGUNGU_CODE_MAP: { [key: string]: number | undefined } = {
  '전체': undefined, '남제주군': 1, '북제주군': 2, '서귀포시': 3, '제주시': 4,
};

const CONTENT_TYPE_ID_MAP: { [key: string]: ContentTypeId | undefined } = {
  '전체': undefined, '관광지': 12, '문화시설': 14, '축제': 15, '여행코스': 25, '레포츠': 28, '숙박': 32, '쇼핑': 38, '음식점': 39,
};

const SearchPage = () => {
  const navigate = useNavigate();
  const loader = useRef<HTMLDivElement | null>(null);

  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('NONE');

  const getContentTypeIdForFilter = () => {
    const isDifficultySet = selectedDifficulty !== 'NONE';
    const isCategoryAll = selectedCategory === '전체';
    if (isDifficultySet && isCategoryAll) {
      return undefined;
    }
    return CONTENT_TYPE_ID_MAP[selectedCategory];
  };

  const filters = {
    sigunguCode: SIGUNGU_CODE_MAP[selectedRegion],
    contentTypeId: getContentTypeIdForFilter(),
    difficulty: selectedDifficulty === 'NONE' ? undefined : selectedDifficulty,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useGetTouristList(filters);

  const spots = data?.pages ?? [];
  const isEmpty = !isLoading && spots.length === 0;

  const handleAddCart = () => {
    navigate('/cart');
  };

  useEffect(() => {
    if (!loader.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loader, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleCardClick = (id: string, typeId: string) => {
    navigate(`/search-detail/${id}`, {
      state: {
        contentTypeId: typeId,
      },
    });
  };

  return (
    <div>
      <FilterBar
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <div className="shrink-0 rounded-t-[12px] border-t border-[#F78938] bg-[#FFFFFD] mt-4 relative">
        <div className="mt-4 flex justify-center">
          <button
            className="absolute left-1/2 -translate-x-1/2 -top-[15px] w-[108px] h-[30px] justify-center items-center gap-[4px] flex flex-shrink-0 rounded-[20px] border border-[#F78938] bg-[#FFFFFD] text-black text-[12px] font-medium leading-[30px] tracking-[-0.24px] font-[Pretendard]"
            onClick={() => navigate('/search-map')}
          >
            <Menu className="text-[#F78938] w-[20px] h-[20px]" />
            지도로 보기
          </button>
        </div>
        <DifficultyFilter
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
        />
        {isLoading ? (
          <SkeletonPlaceList />
        ) : isError ? (
          <div className="text-center p-4">오류가 발생했습니다.</div>
        ) : isEmpty ? (
          <div className="pt-20 pb-20 text-center flex flex-col items-center text-gray-500 font-[Pretendard]">
            <img
              src={PostNone}
              alt="결과 없음"
              className="w-[170px] h-[102px] mb-4"
            />
            <p className="text-lg">해당하는 장소가 없습니다.</p>
            <p className="mt-2 text-sm">다른 필터를 선택해보세요.</p>
          </div>
        ) : (
          <>
            <PlaceList spots={spots} onCardClick={handleCardClick} />
            <div ref={loader}/>
            {isFetchingNextPage && <SkeletonPlaceList />}
          </>
        )}
      </div>
      <ScrollTopButton/>
      <div className="flex justify-end">
        <button
          type="button"
          className="fixed bottom-25 p-3 rounded-full bg-[#fffffd] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer"
          onClick={handleAddCart}
        >
          <Cart className='w-9 h-9'/>
        </button>
      </div>
    </div>
  );
};

export default SearchPage;