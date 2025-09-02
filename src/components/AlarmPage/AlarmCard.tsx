import { useNavigate } from 'react-router-dom';
import { putReadNoti } from '../../apis/alarm';

interface AlarmCardProps {
  id: number;
  type: string;
  message: string;
  resourceId: number;
  isRead: boolean;
}

const AlarmCard = ({
  id,
  type,
  message,
  resourceId,
  isRead,
}: AlarmCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = async () => {
    // 메시지 알림일 경우, 해당 동행방으로 이동
    if (type === 'MESSAGE') {
      await putReadNoti(id).then(() => {
        navigate(`/room/${resourceId}`);
      });
    }
    // 댓글 알림일 경우, 해당 게시글로 이동
    else {
      await putReadNoti(id).then(() => {
        navigate(`community/${resourceId}`);
      });
    }
  };

  return (
    <div
      className="px-5 py-4 border border-[#FFCEAA] rounded-xl relative select-none"
      onClick={handleNavigate}
    >
      {!isRead && (
        <div
          className="w-2 h-2 bg-red-500 rounded-full absolute right-3 top-5"
          aria-label="읽지 않은 알림"
        ></div>
      )}
      <h2 className="font-medium text-[14px] text-black">
        {type === 'MESSAGE' ? '메시지' : '댓글'} 알림
      </h2>
      <h3 className="font-semibold text-black">
        {type === 'MESSAGE'
          ? '동행방에 새로운 메시지가 있어요!'
          : '게시글에 새로운 댓글이 달렸어요!'}
      </h3>
      <p className="font-normal text-[#5D5D5D]">{message}</p>
    </div>
  );
};

export default AlarmCard;
