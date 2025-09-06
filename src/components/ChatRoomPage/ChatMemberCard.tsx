import { useNavigate } from 'react-router-dom';
import BasicProfile from '/src/assets/basicProfile.png';

interface ChatMemberCardProps {
  profileUrl: string;
  name: string;
  id: number;
  isMine?: boolean;
  isActive?: boolean;
}

const ChatMemberCard = ({
  profileUrl,
  name,
  id,
  isMine = false,
  isActive = true,
}: ChatMemberCardProps) => {
  const navigate = useNavigate();

  const handleProfileDetail = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <div
      className="flex items-center gap-2 select-none cursor-pointer"
      onClick={handleProfileDetail}
    >
      <img
        src={profileUrl ? profileUrl : BasicProfile}
        alt={`${name}님의 프로필`}
        className="w-8 h-8"
      />
      <span className="font-[pretendard] font-normal text-sm text-black">
        {name}
      </span>
      {isMine && (
        <span className="w-4 h-4 p-0.5 flex justify-center items-center rounded-full bg-[#FFCEAA] font-[pretendard] font-semibold text-[10px] text-[#F78938] shrink-0">
          나
        </span>
      )}
      {!isActive && (
        <span className="w-4 h-4 p-0.5 flex justify-center items-center rounded-full bg-gray-300 font-[pretendard] font-semibold text-[10px] text-gray-600 shrink-0">
          비활성
        </span>
      )}
    </div>
  );
};

export default ChatMemberCard;
