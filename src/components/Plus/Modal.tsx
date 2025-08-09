import CloseIcon from '../../assets/closeIcon.svg?react';
import ReviewIcon from '../../assets/review.svg';
import PlanIcon from '../../assets/plan.svg';
import RoomIcon from '../../assets/withRoom.svg';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  onClose: () => void;
}

const Modal = ({ onClose }: ModalProps) => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0px_0px_2px_1px_rgba(247,137,56,1.00)] flex flex-col pt-4 pb-2">
        <div className="w-full flex justify-end pr-4">
          <button className="cursor-pointer" onClick={onClose} aria-label="닫기">
            <CloseIcon />
          </button>
        </div>
        <div className="flex flex-col font-['Pretendard'] divide-y-[0.5px] divide-[#F78938]">
            <button className="flex flex-col items-center gap-3 pb-4 cursor-pointer" onClick={() => handleClick('/write-review')}>
                <img src={ReviewIcon} alt="혼행 리뷰 작성" className="w-10 h-10" />
                <span className="text-[#F78938] text-xl font-semibold leading-snug tracking-tight">혼행 리뷰 작성</span>
            </button>
            <button className="flex flex-col items-center gap-3 py-4 cursor-pointer"  onClick={() => handleClick('/plan')}>
                <img src={PlanIcon} alt="계획 짜기" className="w-10 h-10" />
                <span className="text-[#F78938] text-xl font-semibold leading-snug tracking-tight">계획 짜기</span>
            </button>
            <button className="flex flex-col items-center gap-3 py-4 cursor-pointer" onClick={() => handleClick('/create-room')}>
                <img src={RoomIcon} alt="동행방 만들기" className="w-10 h-10" />
                <span className="text-[#F78938] text-xl font-semibold leading-snug tracking-tight">동행방 만들기</span>
            </button>
            </div>
      </div>
    </div>
  );
};

export default Modal;