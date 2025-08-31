import MoreArrow from '/src/assets/arrow-more.svg';
import People from '/src/assets/people.svg';
import Exit from '/src/assets/Exit.svg';
import { useState } from 'react';
import Modal from '../common/Modal';
import ChatMemberCard from './ChatMemberCard';

const mockData = [
  {
    title: '가람돌솥밥',
    currentPeople: 2,
    limitPeople: 4,
    participants: [
      {
        id: 1,
        name: '박길동',
        profileURL: '/src/assets/basicProfile.png',
      },
      {
        id: 2,
        name: '홍길동',
        profileURL: '/src/assets/basicProfile.png',
      },
    ],
  },
];

interface ChatModalProps {
  ref: React.RefObject<HTMLDivElement | null>;
  roomId: string | undefined;
  onLeaveRoom: () => void;
}

const ChatModal = ({ ref, roomId, onLeaveRoom }: ChatModalProps) => {
  console.log(roomId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return mockData.map((data, idx) => (
    <div key={idx}>
      <div className="fixed inset-0 w-full h-full bg-black/20">
        <div
          className="fixed right-0 z-100 w-[75%] h-full flex flex-col gap-5 bg-[#FFFFFD] px-5 pt-15"
          ref={ref}
        >
          <h1 className="font-[pretendard] font-semibold text-[22px] text-black">
            {data.title}
          </h1>
          <button
            type="button"
            className="flex items-center gap-4 font-[pretendard] font-medium text-base text-[#F78938] cursor-pointer"
          >
            동행방 글 다시 보러가기 <img src={MoreArrow} className="w-3 h-3" />
          </button>

          <p className="flex gap-3">
            <span className="font-[pretendard] font-medium text-sm text-[#5D5D5D]">
              참여자
            </span>
            <span
              className="flex font-[pretendard] font-semibold text-sm text-[#F78938]"
              aria-label={`최대 ${data.limitPeople}명 참여자 ${data.currentPeople}명`}
            >
              <img src={People} />
              {data.currentPeople}/{data.limitPeople}
            </span>
          </p>

          {data.participants?.map((participant) => (
            <ChatMemberCard
              key={participant.id}
              profileUrl={participant.profileURL}
              name={participant.name}
              id={participant.id}
            />
          ))}

          <div className="flex-1"></div>

          <button
            type="button"
            className="flex gap-2 justify-end py-4 font-[pretendard] font-normal text-sm text-[#5D5D5D] border-t border-[#FFCEAA]"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={Exit} />방 나가기
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title="동행방을 정말로 나가시겠어요?"
          children={<p>대화 내용은 복구할 수 없습니다.</p>}
          buttons={[
            {
              text: '취소',
              onClick: () => setIsModalOpen(false),
              variant: 'gray',
            },
            {
              text: '확인',
              onClick: onLeaveRoom,
              variant: 'orange',
            },
          ]}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  ));
};

export default ChatModal;
