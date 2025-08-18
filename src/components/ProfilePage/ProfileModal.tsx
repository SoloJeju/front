import { useParams } from 'react-router-dom';

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
  // zustand store
  const myId = 50;
  const { userId } = useParams();

  const isMine = myId === Number(userId);

  return (
    <div>
      {isMine ? (
        <div
          className="flex flex-col gap-4 px-4 py-5 bg-[#FFFFFD] rounded-xl shadow-md z-50"
          ref={ref}
        >
          <button
            type="button"
            className="font-[pretendard] font-normal text-[#666666]"
            onClick={() => onModify?.()}
          >
            수정하기
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col gap-4 px-4 py-5 bg-[#FFFFFD] rounded-xl shadow-md z-50"
          ref={ref}
        >
          <button
            type="button"
            className="font-[pretendard] font-normal text-[#666666]"
            onClick={() => onReport?.()}
          >
            프로필 신고하기
          </button>
          <button
            type="button"
            className="font-[pretendard] font-normal text-[#666666]"
            onClick={() => onBlock?.()}
          >
            프로필 차단하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
