import { useNavigate } from 'react-router-dom';
import Back from '/src/assets/beforeArrow.svg';
import Menu from '/src/assets/chat-menu.svg';

interface BackHeaderProps {
  title?: string;
  isChatRoom?: boolean;
  onClick?: () => void;
  //rightContent?: React.ReactNode;
}

const BackHeader = ({
  title,
  // rightContent,
  isChatRoom = false,
  onClick,
}: BackHeaderProps) => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <header className="w-full p-3 flex items-center justify-between relative">
      <button
        type="button"
        className="cursor-pointer w-6 h-6"
        onClick={handleClickBack}
      >
        <img src={Back} alt="뒤로가기" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 justify-start text-black-2 text-lg font-semibold font-['Pretendard'] leading-relaxed">
        {title}
      </div>
      {isChatRoom ? (
        <button
          type="button"
          className="w-7 h-7 cursor-pointer"
          onClick={() => onClick?.()}
        >
          <img src={Menu} alt="채팅방 정보 보기" />
        </button>
      ) : (
        <div className="w-6 h-6"></div>
      )}
      {/* {rightContent || <div className="w-6 h-6"></div>} */}
    </header>
  );
};

export default BackHeader;
