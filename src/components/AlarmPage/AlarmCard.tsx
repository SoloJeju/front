import { useNavigate } from 'react-router-dom';
import { putReadGroupedNoti } from '../../apis/alarm';

interface AlarmCardProps {
  type: string;
  message: string;
  resourceId: number;
  unreadCount: number;
  resourceType: string;
}

const AlarmCard = ({
  type,
  message,
  resourceId,
  unreadCount,
  resourceType,
}: AlarmCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = async () => {
    // 메시지 알림일 경우, 해당 동행방으로 이동
    if (type === 'MESSAGE') {
      await putReadGroupedNoti({ type, resourceType, resourceId }).then(() => {
        navigate(`/room/${resourceId}`);
      });
    }
    // 댓글 알림, 좋아요 알림일 경우, 해당 게시글로 이동
    else if (type === 'LIKE' || type === 'COMMENT') {
      await putReadGroupedNoti({ type, resourceType, resourceId }).then(() => {
        navigate(`/community/${resourceId}`);
      });
    }
    // 이외의 경우, 임시로 마이페이지로 이동 (추후 수정)
    else {
      await putReadGroupedNoti({ type, resourceType, resourceId }).then(() => {
        navigate(`/mypage`);
      });
    }
  };

  return (
    <div
      className="px-5 py-4 border border-[#FFCEAA] rounded-xl relative select-none font-[Pretendard]"
      onClick={handleNavigate}
    >
      {unreadCount !== 0 && (
        <div
          className="bg-red-500 text-white rounded-full absolute right-3 top-5 flex justify-center items-center w-6 h-6"
          aria-label="읽지 않은 알림"
        >
          {unreadCount}
        </div>
      )}
      <h2 className="font-medium text-[14px] text-black">
        {type === 'MESSAGE' ? '메시지' : '댓글'} 알림
      </h2>
      <h3 className="font-semibold text-black">
        {type === 'MESSAGE'
          ? '동행방에 새로운 메시지가 있어요!'
          : type === 'COMMENT'
            ? '게시글에 새로운 댓글이 달렸어요!'
            : ''}
      </h3>
      <p className="font-normal text-[#5D5D5D]">{message}</p>
    </div>
  );
};

export default AlarmCard;
