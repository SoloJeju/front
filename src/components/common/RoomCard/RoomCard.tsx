import WithIcon from '../../../assets/with.svg?react';
import Map from '../../../assets/mapPin.svg?react';
import Clock from '../../../assets/clock.svg?react';
import { useNavigate } from 'react-router-dom';

type RoomCardProps = {
  id: number | undefined;
  isEnd: boolean; // true: 모집완료, false: 모집중
  title: string | undefined;
  location: string | undefined;
  date: Date | string | undefined;
  pre: number | undefined;
  all: number | undefined;
  imageUrl?: string | undefined;
  iamgeName?: string | undefined;
  gender?: string | null;
  hasUnreadMessages?: boolean;
  unreadCount?: number; // 읽지 않은 메시지 개수
  from?: 'home' | 'mypage'; // 어디서 왔는지 구분
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
  iamgeName,
  gender,
  hasUnreadMessages,
  from = 'mypage', // 기본값은 마이페이지
}: RoomCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // from 파라미터를 추가하여 어디서 왔는지 구분
    navigate(`/room/${id}?from=${from}`);
  };

  return (
    <div
      className={`flex w-full rounded-xl shadow-[0px_0px_2px_0px_rgba(247,137,56,1.00)] border border-[#F78938] overflow-hidden cursor-pointer relative ${
        hasUnreadMessages ? 'bg-orange-50' : 'bg-white'
      }`}
      onClick={handleNavigate}
    >
      {/* 안읽은 메시지 표시 */}
      {hasUnreadMessages && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      )}

      <div className="flex flex-col justify-between p-4 w-2/3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div
              className={`text-xs font-medium font-['Pretendard'] leading-3 ${
                isEnd
                  ? 'text-[#666666]'
                  : hasUnreadMessages
                    ? 'text-[#F78938] font-bold'
                    : 'text-[#F78938]'
              }`}
            >
              {isEnd ? '모집완료' : '모집중'}
            </div>
            <div
              className={`px-1 py-0.5 rounded-sm text-xs font-medium font-['Pretendard'] ${
                gender === 'MALE'
                  ? hasUnreadMessages
                    ? 'bg-[#BBE7FF] text-[#3E7EFF] font-bold'
                    : 'bg-[#BBE7FF] text-[#3E7EFF]'
                  : gender === 'FEMALE'
                    ? hasUnreadMessages
                      ? 'bg-[#FFCFCF] text-[#FF3E3E] font-bold'
                      : 'bg-[#FFCFCF] text-[#FF3E3E]'
                    : ''
              }`}
            >
              {gender === 'MALE' ? '남성' : gender === 'FEMALE' ? '여성' : ''}
            </div>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <div
              className={`text-base font-['Pretendard'] leading-tight tracking-tight ${
                hasUnreadMessages
                  ? 'text-black font-bold'
                  : 'text-black font-semibold'
              }`}
            >
              {title}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1 text-[#666666] text-xs font-normal font-['Pretendard']">
          <div className="inline-flex items-center gap-1">
            <Map />
            <span
              className={
                hasUnreadMessages ? 'text-black font-medium' : 'text-[#666666]'
              }
            >
              {location}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 pb-1">
            <Clock />
            <span
              className={
                hasUnreadMessages
                  ? 'text-red-600 font-medium'
                  : 'text-[#666666]'
              }
            >
              {date ? new Date(date).toLocaleDateString() : ''}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 text-[#F78938]">
            <WithIcon className="w-3.5 h-3.5" />
            <div
              className={`text-xs font-medium font-['Pretendard'] ${
                hasUnreadMessages ? 'font-bold' : 'font-medium'
              }`}
            >
              {pre}명/{all}명
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-1/3 flex items-end justify-end p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={iamgeName}
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
