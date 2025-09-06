import MoreArrow from '/src/assets/arrow-more.svg';
import People from '/src/assets/people.svg';
import Exit from '/src/assets/Exit.svg';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import ChatMemberCard from './ChatMemberCard';
import chatApiService from '../../services/chat';
import useGetMyChatRooms from '../../hooks/mypage/useGetMyChatRooms';
import type { ChatRoomUsersResponse } from '../../types/chat';
import type { MyChatRoom } from '../../types/home';

interface ChatModalProps {
  ref: React.RefObject<HTMLDivElement | null>;
  roomId: string | undefined;
  onLeaveRoom: () => void;
  onClose?: () => void;
}

const ChatModal = ({ ref, roomId, onLeaveRoom, onClose }: ChatModalProps) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usersData, setUsersData] = useState<ChatRoomUsersResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: myChatRooms, isPending: isRoomDetailPending } =
    useGetMyChatRooms();

  // 해당 채팅방 정보 찾기 (roomId로 찾기)
  const room = myChatRooms?.pages?.[0]?.result?.content?.find(
    (room: MyChatRoom) => room.roomId === Number(roomId)
  );

  const loadChatRoomUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await chatApiService.getChatRoomUsers(Number(roomId));

      if (response.isSuccess) {
        setUsersData(response.result);
      } else {
        setError(response.message || '사용자 목록을 불러오는데 실패했습니다.');
      }
    } catch (err: unknown) {
      console.error('채팅방 사용자 목록 로드 오류:', err);
      setError('사용자 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      loadChatRoomUsers();
    }
  }, [roomId, loadChatRoomUsers]);

  const handleGoToRoomDetail = () => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  // 바깥 부분 클릭 시 모달 닫기
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (isLoading || isRoomDetailPending) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-black/20"
        onClick={handleOutsideClick}
      >
        <div
          className="fixed right-0 z-100 w-[75%] h-full flex flex-col gap-5 bg-[#FFFFFD] px-5 pt-15"
          ref={ref}
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-black/20"
        onClick={handleOutsideClick}
      >
        <div
          className="fixed right-0 z-100 w-[75%] h-full flex flex-col gap-5 bg-[#FFFFFD] px-5 pt-15"
          ref={ref}
        >
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-red-500 text-center">
              정보를 불러오는데 실패했습니다.
            </p>
            <button
              onClick={loadChatRoomUsers}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!usersData) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black/20"
      onClick={handleOutsideClick}
    >
      <div
        className="fixed right-0 z-100 w-[75%] h-full flex flex-col gap-5 bg-[#FFFFFD] px-5 pt-15 overflow-y-auto"
        ref={ref}
      >
        {/* 채팅방 이름을 맨 위에 배치 */}
        <h1 className="font-[pretendard] font-semibold text-[22px] text-black">
          {room.title}
        </h1>

        {/* 동행방 글 다시 보러가기 버튼 */}
        <button
          type="button"
          className="flex items-center gap-2 font-[pretendard] font-medium text-sm text-[#F78938] cursor-pointer"
          onClick={handleGoToRoomDetail}
        >
          동행방 글 다시 보러가기 <img src={MoreArrow} className="w-3 h-3" />
        </button>

        <p className="flex gap-3">
          <span className="font-[pretendard] font-medium text-sm text-[#5D5D5D]">
            참여자
          </span>
          <span
            className="flex font-[pretendard] font-semibold text-sm text-[#F78938]"
            aria-label={`총 ${usersData.totalMembers}명 참여자`}
          >
            <img src={People} />
            {usersData.totalMembers} /{' '}
            {room.maxMembers || room.maxParticipants || 0}
          </span>
        </p>

        {usersData.users?.map((user) => (
          <ChatMemberCard
            key={user.userId}
            profileUrl={user.profileImage || '/src/assets/basicProfile.png'}
            name={user.username}
            id={user.userId}
            isMine={user.mine}
            isActive={user.active}
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
  );
};

export default ChatModal;
