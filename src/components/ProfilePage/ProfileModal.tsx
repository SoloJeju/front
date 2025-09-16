import React from 'react';
import { useParams } from 'react-router-dom';
import useGetMyInfo from '../../hooks/mypage/useGetMyInfo';

interface ProfileModalProps {
  ref: React.RefObject<HTMLDivElement | null>;
  onModify: () => void;
  onReport: () => void;
  onBlock: () => void;
}

const ProfileModal = ({
  ref,
  onModify,
  onReport,
  onBlock,
}: ProfileModalProps) => {
  const { userId } = useParams();
  const targetId = Number(userId);

  const { data: myInfo } = useGetMyInfo();

  const myId = myInfo?.result?.userId;

  const isMine =
    Number.isFinite(targetId) &&
    Number.isFinite(myId) &&
    (myId as number) === targetId;

  return (
    <div
      ref={ref}
      role="menu"
      className="w-40 rounded-xl bg-white/90 backdrop-blur-sm ring-1 ring-black/5 shadow-md overflow-hidden z-50"
    >
      {isMine ? (
        <button
          type="button"
          role="menuitem"
          autoFocus
          onClick={onModify}
          className="w-full text-left px-4 py-3 text-sm text-[#262626] outline-none hover:bg-gray-50 cursor-pointer"
        >
          프로필 수정하기
        </button>
      ) : (
        <>
          <button
            type="button"
            role="menuitem"
            autoFocus
            onClick={onReport}
            className="w-full text-left px-4 py-3 text-sm text-[#262626] outline-none hover:bg-gray-50 cursor-pointer"
          >
            프로필 신고하기
          </button>
          <div className="h-px bg-[#EDEDED]" />
          <button
            type="button"
            role="menuitem"
            onClick={onBlock}
            className="w-full text-left px-4 py-3 text-sm text-[#262626] outline-none hover:bg-gray-50 cursor-pointer"
          >
            프로필 차단하기
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileModal;
