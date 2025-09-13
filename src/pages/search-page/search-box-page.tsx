import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTouristSearch } from '../../apis/tourist';
import type { TouristSpot } from '../../types/tourist';
import SearchIcon from '../../assets/search-magnifying-glass.svg?react';
import BackIcon from '../../assets/beforeArrow.svg?react';
import CloseIcon from '../../assets/closeIcon.svg?react';
import PlaceList from '../../components/SearchPage/PlaceList';
import { useCreateRoomStore } from '../../stores/createroom-store';
import { useWriteReviewStore } from '../../stores/writereview-store';
import { usePlanStore } from '../../stores/plan-store';
import { useSearchHistory } from '../../hooks/tourist/useSearchHistory';

const SearchBoxPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addPlace } = usePlanStore();
  const { searchHistory, updateHistory, removeHistoryItem } =
    useSearchHistory(10);
  const [searchInput, setSearchInput] = useState('');
  const [isAfterSearch, setIsAfterSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<TouristSpot[]>([]);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    updateHistory(searchInput);

    try {
      const response = await getTouristSearch(searchInput);
      setSearchResults(
        response.isSuccess
          ? response.result.list.map((spot) => ({
              contentid: String(spot.contentid),
              contenttypeid: String(spot.contenttypeid),
              title: spot.title,
              addr1: spot.addr1 ?? '',
              firstimage: spot.firstimage,
              hasCompanionRoom: (spot.companionRoomCount ?? 0) > 0,
              companionRoomCount: spot.companionRoomCount ?? 0,
              difficulty: spot.difficulty,
              reviewTags: spot.reviewTags ? JSON.parse(spot.reviewTags) : null,
              mapx: '',
              mapy: '',
              averageRating: null,
            }))
          : []
      );
    } catch {
      setSearchResults([]);
    }
    setIsAfterSearch(true);
  };

  const handleCardClick = (id: string) => {
    const spot = searchResults.find((s) => s.contentid === id);
    if (!spot) return;

    const { from, dayIndex, locationIdToReplace, mode } = location.state || {};

    if (from === '/plan') {
      addPlace({
        contentId: Number(spot.contentid),
        spotName: spot.title,
        dayIndex,
      });
      return navigate(from);
    }

    if (from?.startsWith('/plan/')) {
      return navigate(from, {
        state: {
          selectedSpotForReplacement: spot,
          dayIndex,
          locationIdToReplace,
          mode,
        },
      });
    }

    if (from === '/create-room') {
      useCreateRoomStore.getState().setFormData({
        contentId: Number(spot.contentid),
        spotName: spot.title,
      });
      return navigate(from);
    }

    if (from === '/write-review') {
      useWriteReviewStore.getState().setFormData({
        contentId: Number(spot.contentid),
        spotName: spot.title,
        contentTypeId: Number(spot.contenttypeid),
      });
      return navigate(from);
    }
    navigate(`/search-detail/${spot.contentid}`, {
      state: {
        contentTypeId: spot.contenttypeid,
      },
    });
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex justify-center bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] pb-10 px-4 font-[Pretendard]">
        <div className="flex items-center w-full gap-2 mt-5">
          <button
            type="button"
            className="cursor-pointer w-6 h-6 z-20"
            onClick={() => navigate(-1)}
          >
            <BackIcon />
          </button>
          <div className="flex-1 h-[40px] flex items-center border border-[#F78938] rounded-[20px] bg-[#FFFFFD] px-4">
            <input
              type="text"
              placeholder="검색어를 입력해주세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleEnterPress}
              className="flex-1 text-sm focus:outline-none font-medium placeholder:text-[#B4B4B4]"
            />
          </div>
          <SearchIcon
            className="w-[30px] h-[30px] text-[#F78938] cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {!isAfterSearch ? (
          <div className="mt-5">
            <p className="text-black text-base font-semibold mb-4">
              최근 검색어
            </p>
            <ul className="flex flex-col gap-3">
              {searchHistory.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between pb-1"
                  onClick={() => {
                    setSearchInput(item);
                    handleSearch();
                  }}
                >
                  <span className="text-sm text-[#5D5D5D] cursor-pointer">
                    {item}
                  </span>
                  <button
                    type="button"
                    className="w-4 h-4 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistoryItem(item);
                    }}
                  >
                    <CloseIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-5">
            {searchResults.length > 0 ? (
              <PlaceList spots={searchResults} onCardClick={handleCardClick} />
            ) : (
              <p className="text-center text-gray-500 mt-10">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBoxPage;
