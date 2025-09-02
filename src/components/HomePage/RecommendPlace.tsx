import { useNavigate } from 'react-router-dom';
import ExamplePlace from '/src/assets/ex-place.png';

interface RecommendPlaceProps {
  id: number;
  title: string;
  image?: string;
  level: string;
}

const RecommendPlace = ({
  id,
  title,
  image = '',
  level,
}: RecommendPlaceProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`search-detail/${id}`);
  };

  return (
    <div className="relative cursor-pointer" onClick={handleNavigate}>
      <p
        className={`absolute right-2 top-2 px-0.5 py-1 font-[pretendard] font-bold text-[10px] rounded-sm   ${level === 'EASY' ? 'text-[#006259] bg-[#C8F5DA]' : level === 'NORMAL' ? 'text-[#FFC32A] bg-[#FFEE8C]' : level === 'HARD' ? 'text-[#FF3E3E] bg-[#FFBBBB]' : 'text-[#707070] bg-[#C2C6C4]'}`}
      >
        {level}
      </p>
      <figure>
        <img
          src={image ? image : ExamplePlace}
          alt={title}
          className="h-32 rounded-2xl"
        />
        <figcaption className="text-center font-[pretendard] font-medium text-black">
          {title}
        </figcaption>
      </figure>
    </div>
  );
};

export default RecommendPlace;
