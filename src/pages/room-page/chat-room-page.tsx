import { useParams } from 'react-router-dom';
import BackHeader from '../../components/common/Headers/BackHeader';
import ChatInput from '../../components/ChatRoomPage/ChatInput';
import { useEffect, useRef, useState } from 'react';
import ChatMessages from '../../components/ChatRoomPage/ChatMessages';
import ChatModal from '../../components/ChatRoomPage/ChatModal';

const mockData = [
  {
    senderName: '홍길동',
    message: '',
    time: '2025-07-09T09:00',
    type: 'ENTER',
  },
  {
    senderName: '박길동',
    message: '안녕하세요 홍길동님',
    time: '2025-07-08T09:27',
    type: 'CHAT',
  },
  {
    senderName: '홍길동',
    message: '안녕하세용 방가방가 ~~~',
    time: '2025-07-08T09:27',
    type: 'CHAT',
  },
  {
    senderName: '박길동',
    message: '저도 돌솥밥 좋아해요 얌~~~',
    time: '2025-07-08T09:27',
    type: 'CHAT',
  },
  {
    senderName: '박길동',
    message: '안녕하세요 홍길동님!!! 밥은 먹고 다니냐 맛있는거 먹어라',
    time: '2025-07-08T09:27',
    type: 'CHAT',
  },
  {
    senderName: '박길동',
    message:
      '혹시 제가 11시 이후에 도착하는데 괜찮을까요? 제발 저 돌솥밥 먹으러가고싶어요 제발요 저 두고가지마세요',
    time: '2025-07-09T09:27',
    type: 'CHAT',
  },
  {
    senderName: '홍길동',
    message: '예.. 얼른 오세요 배고프니까...',
    time: '2025-07-09T09:27',
    type: 'CHAT',
  },
];

export default function ChatRoomPage() {
  const { roomId } = useParams();
  console.log(roomId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalBg = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickModalBg = (e: MouseEvent) => {
      if (
        isModalOpen &&
        modalBg.current &&
        !modalBg.current.contains(e.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickModalBg);
    return () => document.addEventListener('mousedown', handleClickModalBg);
  }, [isModalOpen]);

  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    console.log(message);
    setMessage('');
  };

  return (
    <div>
      <div className="relative">
        <BackHeader
          title="동행방 개설"
          isChatRoom={true}
          onClick={() => setIsModalOpen(true)}
        />
        <div className="pb-10">
          {mockData.map((data, idx) => (
            <ChatMessages
              key={idx}
              senderName={data.senderName}
              message={data.message}
              time={data.time}
              prevDate={idx > 0 ? mockData[idx - 1].time.split('T')[0] : ''}
              type={data.type}
            />
          ))}
        </div>
        <ChatInput
          message={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
        />
      </div>

      {isModalOpen && (
        <div className="absolute top-0 right-7 w-2/3 h-full">
          <ChatModal ref={modalBg} roomId={roomId} />
        </div>
      )}
    </div>
  );
}
