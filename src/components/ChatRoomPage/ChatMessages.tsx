import React from 'react';
import ChatBox from './ChatBox';

interface ChatMessagesProps {
  senderName: string;
  message: string;
  time: string;
  prevDate: string;
  type: string;
}

const ChatMessages = ({
  senderName,
  message,
  time,
  prevDate,
  type,
}: ChatMessagesProps) => {
  const date = time.split('T')[0];
  const [year, month, day] = date.split('-');
  const formattedTime = time.split('T')[1];

  const shouldShowDate = prevDate !== date && type === 'CHAT';
  const isEnter = type === 'ENTER';
  const isLeave = type === 'LEAVE';

  return (
    <div className="flex flex-col pb-4">
      {shouldShowDate && (
        <time className="text-center pb-4 font-[pretendard] font-medium text-xs text-[#5D5D5D]">
          {`${year}년 ${month}월 ${day}일`}
        </time>
      )}

      {(isEnter || isLeave) && (
        <p className="text-center pb-4 font-[pretendard] font-medium text-xs text-[#5D5D5D]">
          {isEnter
            ? `${senderName}님이 들어왔습니다.`
            : `${senderName}님이 나갔습니다.`}
        </p>
      )}

      {type === 'CHAT' && (
        <ChatBox
          senderName={senderName}
          message={message}
          time={formattedTime}
        />
      )}
    </div>
  );
};

export default React.memo(ChatMessages);
