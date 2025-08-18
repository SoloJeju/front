import { useNavigate } from 'react-router-dom';
import Back from '/src/assets/beforeArrow.svg';

interface BackHeaderProps {
  title?: string;
  rightContent?: React.ReactNode; 
}

const BackHeader = ({ title, rightContent }: BackHeaderProps) => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <header className="w-full py-3 flex items-center justify-between relative">
      <button type="button" className="cursor-pointer w-6 h-6" onClick={handleClickBack}>
        <img src={Back} alt="뒤로가기" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 text-black-2 text-lg font-semibold font-['Pretendard'] leading-relaxed">{title}</div>
      {rightContent || <div className="w-6 h-6"></div>}
    </header>
  );
};

export default BackHeader;