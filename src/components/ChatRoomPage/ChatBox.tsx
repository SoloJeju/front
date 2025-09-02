import React from 'react';
import BasicProfile from '/src/assets/basicProfile.png';

interface ChatBoxProps {
  senderName: string;
  message: string;
  time: string;
}

const ChatBox = ({ senderName, message, time }: ChatBoxProps) => {
  // localStorage에서 사용자 정보 가져오기
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userName = userInfo.name || '';
  const isMine = userName === senderName;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    let displayHours = Number(hours);
    let period = '오전';

    if (displayHours >= 12) {
      period = '오후';
      if (displayHours > 12) {
        displayHours = displayHours - 12;
      }
    }
    return `${period} ${displayHours}:${minutes}`;
  };

  return (
    <div
      className={`flex justify-start items-end gap-1 ${isMine ? 'flex-row-reverse' : ''}`}
    >
      <div className="flex gap-2">
        {!isMine && (
          <img
            src={BasicProfile}
            alt={`사용자님의 프로필`}
            className="w-8 h-8"
          />
        )}
        <div className="flex flex-col gap-1">
          {!isMine && (
            <span className="font-[pretendard] font-normal text-[10px] text-[#262626]">
              {senderName}
            </span>
          )}
          <p
            className={`max-w-68 px-4 py-2.5 rounded-xl  font-[pretendard] font-normal text-sm  ${isMine ? 'bg-[#F78938] text-white' : 'text-black bg-[#F5F5F5]'}`}
          >
            {message}
          </p>
        </div>
      </div>
      <time className="font-[pretendard] font-normal text-[10px] text-[#B4B4B4]">
        {formatTime(time)}
      </time>
    </div>
  );
};

export default React.memo(ChatBox);
