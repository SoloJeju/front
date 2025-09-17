import MoreArrow from '/src/assets/arrow-more.svg';
import People from '/src/assets/people.svg';
import Exit from '/src/assets/Exit.svg';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import ChatMemberCard from './ChatMemberCard';
import chatApiService from '../../services/chat';
import useGetMyChatRooms from '../../hooks/mypage/useGetMyChatRooms';
import type { ChatRoomUsersResponse } from '../../types/chat';
import type { MyChatRoom } from '../../types/home';
import { useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import BasicProfile from '/src/assets/basicProfile.png';

interface ChatModalProps {
  panelRef: React.RefObject<HTMLDivElement | null>;
  roomId: string | undefined;
  onLeaveRoom: () => void;
  onClose?: () => void;
  onDeleteRoom?: () => void;
  usersData: ChatRoomUsersResponse | null;
  isLoading: boolean;
}

const ChatModal = ({
  panelRef,
  roomId,
  onLeaveRoom,
  onClose,
  onDeleteRoom,
  usersData,
  isLoading,
}: ChatModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const { data: myChatRooms, isPending: isRoomDetailPending } = useGetMyChatRooms();
  const room = myChatRooms?.pages?.[0]?.result?.content?.find(
    (r: MyChatRoom) => r.roomId === Number(roomId)
  );

  const handleDeleteRoom = useCallback(async () => {
    if (!roomId) return;
    try {
      const res = await chatApiService.deleteChatRoom(Number(roomId));
      if (res.isSuccess) {
        await queryClient.invalidateQueries({ queryKey: ['myChatRooms'] });
        onDeleteRoom?.();
        navigate(-2);
      } else {
        alert(res.message || '채팅방 삭제에 실패했습니다.');
      }
    } catch (e: unknown) {
      console.error(e);
      alert('채팅방 삭제 중 오류 발생');
    }
  }, [roomId, queryClient, navigate, onDeleteRoom]);

  const handleCompleteRoom = useCallback(async () => {
    if (!roomId || isCompleting) return;
    setIsCompleting(true);
    try {
      const res = await chatApiService.completeChatRoom(Number(roomId));
      if (res.isSuccess) {
        await queryClient.invalidateQueries({ queryKey: ['myChatRooms'] });
        setIsCompleteModalOpen(false);
        alert('동행방 모집을 완료했습니다.');
      } else {
        alert(res.message || '모집 완료 처리에 실패했습니다.');
      }
    } catch (e: unknown) {
      console.error(e);
      alert('모집 완료 처리 중 오류 발생');
    } finally {
      setIsCompleting(false);
    }
  }, [roomId, isCompleting, queryClient]);

  const handleGoToRoomDetail = () => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (isLoading || isRoomDetailPending) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black/20" onClick={handleOutsideClick}>
        <div className="fixed right-0 top-0 h-full w-[88vw] max-w-[420px] bg-[#FFFFFD] shadow-2xl rounded-l-2xl" ref={panelRef}>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!usersData || !room) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black/20" onClick={handleOutsideClick}>
        <div className="fixed right-0 top-0 h-full w-[88vw] max-w-[420px] bg-[#FFFFFD] shadow-2xl rounded-l-2xl p-5" ref={panelRef}>
          <p className="text-center text-red-500">정보를 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  const me = usersData.users?.find((u) => u.mine);
  const amOwner = !!me?.owner;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black/40 z-[1000]" onClick={handleOutsideClick}>
      <div className="fixed right-0 top-0 h-full w-[80vw] max-w-[420px] bg-[#FFFFFD] shadow-2xl rounded-l-2xl overflow-y-auto px-5 pt-[100px] flex flex-col" ref={panelRef}>
        <h1 className="font-[pretendard] font-semibold text-[22px] text-black mb-2">
          {room.title}
        </h1>
        <button type="button" className="flex items-center gap-2 font-[pretendard] font-medium text-sm text-[#F78938] cursor-pointer mb-3" onClick={handleGoToRoomDetail}>
          동행방 글 다시 보러가기 <img src={MoreArrow} className="w-3 h-3" />
        </button>
        <p className="flex gap-3 items-center mb-4">
          <span className="font-[pretendard] font-medium text-sm text-[#5D5D5D]">참여자</span>
          <span className="flex font-[pretendard] font-semibold text-sm text-[#F78938]" aria-label={`총 ${usersData.totalMembers}명 참여자`}>
            <img src={People} />
            {usersData.totalMembers} / {room.maxMembers || room.maxParticipants || 0}
          </span>
        </p>
        <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
          {usersData.users?.map((user) => (
            <ChatMemberCard
              key={user.userId}
              profileUrl={user.profileImage || BasicProfile}
              name={user.username}
              id={user.userId}
              isMine={user.mine}
              isActive={user.active}
              isOwner={user.owner}
            />
          ))}
        </div>
        <div className="flex-1 overflow-y-auto"></div>
        <div className="w-full border-t border-[#FFCEAA]">
          <div className="flex items-center justify-between w-full px-4 py-4">
            {amOwner && (
              <button
                type="button"
                className="px-3 py-2 rounded-xl font-[pretendard] text-sm font-semibold bg-[#F78938] text-white disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={room.isCompleted || isCompleting}
                onClick={() => setIsCompleteModalOpen(true)}
              >
                {isCompleting ? '완료 중...' : '동행 완료하기'}
              </button>
            )}
            <button
              type="button"
              className="flex gap-2 items-center font-[pretendard] font-normal text-sm text-[#5D5D5D]"
              onClick={() => setIsModalOpen(true)}
            >
              <img src={Exit} />
              {amOwner ? '방 삭제' : '방 나가기'}
            </button>
          </div>
        </div>
      </div>
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999]">
            <Modal
              title={amOwner ? '동행방을 삭제하시겠어요?' : '동행방을 나가시겠어요?'}
              buttons={[
                { text: '취소', onClick: () => setIsModalOpen(false), variant: 'gray' },
                {
                  text: '확인',
                  onClick: () => {
                    setIsModalOpen(false);
                    if (amOwner) {
                      handleDeleteRoom();
                    } else {
                      onLeaveRoom();
                    }
                  },
                  variant: 'orange',
                },
              ]}
              onClose={() => setIsModalOpen(false)}
            />
          </div>,
          document.body
        )}
      {isCompleteModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999]">
            <Modal
              title="동행방 모집을 완료하시겠어요?"
              children={
                <div className="space-y-2">
                  <p>모집 완료 시 아래 제한이 적용됩니다.</p>
                  <ul className="list-disc pl-5 text-sm text-[#5D5D5D]">
                    <li>완료 이후의 <b>메시지 전송이 더 이상 불가</b>합니다.</li>
                    <li>새로운 사용자의 <b>방 입장이 불가</b>합니다.</li>
                  </ul>
                </div>
              }
              buttons={[
                { text: '취소', onClick: () => setIsCompleteModalOpen(false), variant: 'gray' },
                { text: '확인', onClick: handleCompleteRoom, variant: 'orange' },
              ]}
              onClose={() => setIsCompleteModalOpen(false)}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default ChatModal;
