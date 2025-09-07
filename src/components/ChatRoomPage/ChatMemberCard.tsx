import { useNavigate } from 'react-router-dom';
import BasicProfile from '/src/assets/basicProfile.png';
import Crown from '/src/assets/crown.png';

interface ChatMemberCardProps {
  profileUrl: string;
  name: string;
  id: number;
  isMine?: boolean;
  isActive?: boolean;
  isOwner?: boolean; 
}


const ChatMemberCard = ({ profileUrl, name, id, isMine = false, isActive = true, isOwner = false }: ChatMemberCardProps) => {

  const navigate = useNavigate();

  const handleProfileDetail = () => {
    navigate(`/profile/${id}`);
  };

  

  return (
    <div
      className="flex items-center gap-2 select-none cursor-pointer py-1"
      onClick={handleProfileDetail}
    >
      {/* ✅ 프로필 + 왕관 오버레이 */}
    <div className="relative w-8 h-10 -mt-2">
      {/* 왕관: 래퍼 내부 '맨 위 중앙' */}
      {isOwner && (
        <img
          src={Crown}
          alt="방장"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 z-20 pointer-events-none"
        />
      )}

      {/* 아바타: 래퍼의 '아래'에 붙임 */}
      <img
        src={profileUrl ? profileUrl : BasicProfile}
        alt={`${name}님의 프로필`}
        className="absolute bottom-0 left-0 w-8 h-8 rounded-full object-cover"
      />
    </div>


      {/* 이름 */}
      <span className="font-[pretendard] font-normal text-sm text-black">
        {name}
      </span>

      {/* 나 표시 */}
      {isMine && (
        <span className="w-4 h-4 p-0.5 flex justify-center items-center rounded-full bg-[#FFCEAA] font-[pretendard] font-semibold text-[10px] text-[#F78938] shrink-0">
          나
        </span>
      )}

      {/* 비활성 표시 */}
      {!isActive && (
        <span className="w-4 h-4 p-0.5 flex justify-center items-center rounded-full bg-gray-300 font-[pretendard] font-semibold text-[10px] text-gray-600 shrink-0">
          비활성
        </span>
      )}
    </div>
  );
};

export default ChatMemberCard;
