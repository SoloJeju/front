import WithIcon from '../../../assets/with.svg?react';
import Map from '../../../assets/mapPin.svg?react';
import Clock from '../../../assets/clock.svg?react';
import { useNavigate } from 'react-router-dom';

type RoomCardProps = {
  id: number;
  isEnd: boolean; // true: 모집완료, false: 모집중
  title: string;
  location: string;
  date: Date | string;
  pre: number;
  all: number;
  imageUrl?: string;
  gender?: string | null;
  hasUnreadMessages?: boolean;
};

const RoomCard = ({
  id,
  isEnd,
  title,
  location,
  date,
  pre,
  all,
  imageUrl,
  gender,
  hasUnreadMessages,
}: RoomCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/room/${id}`);
  };

  return (
    <div
      className="flex w-full rounded-xl shadow-[0px_0px_2px_0px_rgba(247,137,56,1.00)] border border-[#F78938] overflow-hidden cursor-pointer relative"
      onClick={handleNavigate}
    >
      {/* 안읽은 메시지 표시 */}
      {hasUnreadMessages && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full z-10" />
      )}
      
      <div className="flex flex-col justify-between p-4 w-2/3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div
              className={`text-xs font-medium font-['Pretendard'] leading-3 ${isEnd ? 'text-[#666666]' : 'text-[#F78938]'}`}
            >
              {isEnd ? '모집완료' : '모집중'}
            </div>
            <div
              className={`px-1 py-0.5 rounded-sm text-xs font-medium font-['Pretendard'] ${gender === 'MALE' ? 'bg-[#BBE7FF] text-[#3E7EFF]' : gender === 'FEMALE' ? 'bg-[#FFCFCF] text-[#FF3E3E]' : ''}`}
            >
              {gender === 'MALE' ? '남성' : gender === 'FEMALE' ? '여성' : ''}
            </div>
          </div>
          <div className="text-black text-base font-semibold font-['Pretendard'] leading-tight tracking-tight pb-2">
            {title}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1 text-[#666666] text-xs font-normal font-['Pretendard']">
          <div className="inline-flex items-center gap-1">
            <Map />
            {location}
          </div>
          <div className="inline-flex items-center gap-1 pb-1">
            <Clock />
            {date ? new Date(date).toLocaleDateString() : ''}
          </div>
          <div className="inline-flex items-center gap-1 text-[#F78938]">
            <WithIcon className="w-3.5 h-3.5" />
            <div className="text-xs font-medium font-['Pretendard']">
              {pre}명/{all}명
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-1/3 flex items-end justify-end p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#FFFFFD]" />
        )}
      </div>
    </div>
  );
};

export default RoomCard;
