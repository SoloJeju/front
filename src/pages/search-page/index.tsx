import FilterBar from '../../components/SearchPage/FliterBar';
import PlaceList from '../../components/SearchPage/PlaceList';
import Menu from '../../assets/menu.svg?react';
import Cart from '../../assets/cartIcon.svg';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const navigate = useNavigate();

  const handleAddCart = () => {
    navigate('/cart');
  };
  return (
    <div>
      <FilterBar />
      <div className=" shrink-0 rounded-t-[12px] border-t border-[var(--PrimaryColor,#F78938)] bg-[var(--white-2,#FFFFFD)] mt-4 relative">
        <div className="mt-4 flex justify-center">
          <button className="absolute left-1/2 -translate-x-1/2 -top-[15px] w-[108px] h-[30px] justify-center items-center gap-[4px] flex flex-shrink-0 rounded-[20px] border border-[#F78938] bg-[#FFFFFD] text-black text-[12px] font-medium leading-[30px] tracking-[-0.24px] font-[Pretendard]"
            onClick={() => navigate('/search-map')}>
            <Menu className="text-[#F78938] w-[20px] h-[20px]"/>지도로 보기
          </button>
        </div>

        <PlaceList />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="fixed bottom-25 p-3 rounded-full bg-[#fffffd] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer"
          onClick={handleAddCart}
        >
          <img src={Cart} alt="장소 담기" />
        </button>
      </div>
    </div>
  );
};



export default SearchPage;
