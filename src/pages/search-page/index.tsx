import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/SearchPage/FliterBar';
import PlaceList from '../../components/SearchPage/PlaceList';
import Menu from '../../assets/menu.svg?react';
import Cart from '../../assets/cartIcon.svg';
import { useGetTouristList } from '../../hooks/tourist/useGetTouristList';

const SearchPage = () => {
  const navigate = useNavigate();
  const loader = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
  } = useGetTouristList();

  const spots = data?.pages ?? [];

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

  const handleCardClick = (id: string) => {
    navigate(`/search-detail/${id}`);
  };
  // 로딩 스피너 만들어!!!!
  if (isLoading) return <div className="text-center p-4">로딩 중...</div>;
  if (isError)
    return <div className="text-center p-4">오류가 발생했습니다.</div>;

  return (
    <div>
      <FilterBar />
      <div className="shrink-0 rounded-t-[12px] border-t border-[var(--PrimaryColor,#F78938)] bg-[var(--white-2,#FFFFFD)] mt-4 relative">
        <div className="mt-4 flex justify-center">
          <button
            className="absolute left-1/2 -translate-x-1/2 -top-[15px] w-[108px] h-[30px] justify-center items-center gap-[4px] flex flex-shrink-0 rounded-[20px] border border-[#F78938] bg-[#FFFFFD] text-black text-[12px] font-medium leading-[30px] tracking-[-0.24px] font-[Pretendard]"
            onClick={() => navigate('/search-map')}
          >
            <Menu className="text-[#F78938] w-[20px] h-[20px]" />
            지도로 보기
          </button>
        </div>

        <PlaceList spots={spots} onCardClick={handleCardClick} />

        <div ref={loader} style={{ height: 50 }} />
        {isFetchingNextPage && (
          <p className="text-center p-4">더 불러오는 중...</p>
        )}
        {!hasNextPage && spots.length > 0 && (
          <p className="text-center text-gray-500 pb-4">
            더 이상 데이터가 없습니다
          </p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="fixed bottom-25 p-3 rounded-full bg-[#fffffd] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer"
          onClick={handleAddCart}
        >
          <img src={Cart} alt="담은 장소 리스트" />
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
