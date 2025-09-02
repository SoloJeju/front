import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/SearchPage/FliterBar';
//import KakaoMap from '../../components/SearchPage/KaKaoMap';
import Menu from '../../assets/menu.svg?react';
import MapImg from '../../assets/Mapimage.png';

const SearchMapPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <FilterBar />
      <div className="relative shrink-0 rounded-t-[12px] border-t border-[var(--PrimaryColor,#F78938)] bg-[var(--white-2,#FFFFFD)] mt-4 overflow-hidden">
        <img src={MapImg} alt="Map" className="w-full h-full object-cover rounded-t-[12px]" />
        <div className="absolute top-4 w-full flex justify-center">
          <button className="flex w-[108px] h-[30px] justify-center items-center gap-[4px] flex-shrink-0 rounded-[20px] border border-[#F78938] bg-[#FFFFFD] text-black text-[12px] font-medium leading-[30px] tracking-[-0.24px] font-[Pretendard]"
           onClick={() => navigate('/search')}>
            <Menu className="text-[#F78938] w-[20px] h-[20px]" />
            리스트로 보기
          </button>
        </div>
      </div>
    </div>
  );
};



export default SearchMapPage;