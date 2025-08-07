// import { useNavigate } from 'react-router-dom';
import ExamplePlace from '/src/assets/ex-place.png';

interface RecommendPlaceProps {
  id: number;
  name: string;
  image?: string;
  level: string;
}

const RecommendPlace = ({ name, image = '', level }: RecommendPlaceProps) => {
  // const navigate = useNavigate();

  // const handleNavigate = () => {
  //   navigate(`recommendation/${id}`);
  // };

  return (
    <div className='relative'>
      <p className={`absolute right-2 top-2 px-0.5 py-1 font-[pretendard] font-bold text-[10px] rounded-sm   ${level === 'EASY' ? 'text-[#006259] bg-[#C8F5DA]' : level === 'NORMAL' ? 'text-[#FFC32A] bg-[#FFEE8C]' : 'text-[#FF3E3E] bg-[#FFBBBB]'}`}>{level}</p>
      <figure>
        <img src={image ? image : ExamplePlace} alt={name} className='h-32 rounded-2xl' />
        <figcaption className='text-center font-[pretendard] font-medium text-black'>{name}</figcaption>
      </figure>
    </div>
  );
};

export default RecommendPlace;
