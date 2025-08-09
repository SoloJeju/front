import React from 'react';
import DefaultProfile from '/src/assets/defaultProfile.png';
import MoreButton from './MoreButton';
import More from '/src/assets/more.svg';

interface CommentCardProps {
  id: number;
  writer: string;
  image: string | null;
  time: string;
  comment: string;
  isOpenMore: boolean;
  isMine: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  setIsOpenMore: (id: number) => void;
  onDelete: (id: number) => void;
  onModify: (id: number) => void;
  onReport: (id: number) => void;
}

const CommentCard = ({
  id,
  writer,
  image,
  time,
  comment,
  isOpenMore,
  isMine,
  ref,
  setIsOpenMore,
  onDelete,
  onModify,
  onReport,
}: CommentCardProps) => {
  return (
    <div className="relative">
      <img
        src={image ? image : DefaultProfile}
        alt={`${writer}의 프로필`}
        className="w-8 h-8 absolute top-5 -left-5"
      />
      <div className="p-4 border border-[#FFCEAA] rounded-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-[pretendard] font-medium text-sm text-black">
              {writer}
            </span>
            <time className="font-[pretendard] font-normal text-xs text-[#5D5D5D]">
              {time}
            </time>
          </div>
          <button type="button" onClick={() => setIsOpenMore(id)}>
            <img src={More} alt="더보기" />
          </button>
        </div>
        <div className="absolute right-0 top-10">
          {isOpenMore && (
            <MoreButton
              isMine={isMine}
              ref={ref}
              onDelete={() => onDelete?.(id)}
              onModify={() => onModify?.(id)}
              onReport={() => onReport?.(id)}
            />
          )}
        </div>
        <p className="font-[pretendard] font-normal text-sm text-black break-keep">
          {comment}
        </p>
      </div>
    </div>
  );
};

export default React.memo(CommentCard);
