import React from 'react';
import BasicProfile from '/src/assets/basicProfile.png';
import MoreButton from './MoreButton';
import More from '/src/assets/more.svg';
import { useNavigate } from 'react-router-dom';

interface CommentCardProps {
  id: number;
  author: string;
  authorId: number;
  image: string | null;
  time: Date;
  comment: string;
  isOpenMore: boolean;
  isMine: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  setIsOpenMore: (id: number) => void;
  onDelete: (id: number) => void;
  onReport: (id: number) => void;
}

const CommentCard = ({
  id,
  author,
  authorId,
  image,
  time,
  comment,
  isOpenMore,
  isMine,
  ref,
  setIsOpenMore,
  onDelete,
  onReport,
}: CommentCardProps) => {
  const navigate = useNavigate();

  const handleProfileDetail = (id: number) => {
    navigate(`/profile/${id}`);
  };
  return (
    <div className="relative">
      <img
        src={image ? image : BasicProfile}
        alt={`${author}의 프로필`}
        className="w-8 h-8 absolute top-5 -left-5 cursor-pointer rounded-full"
        onClick={() => handleProfileDetail(authorId)}
      />
      <div className="p-4 border border-[#FFCEAA] rounded-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-[pretendard] font-medium text-sm text-black cursor-pointer"
              onClick={() => handleProfileDetail(authorId)}
            >
              {author}
            </span>
            <time className="font-[pretendard] font-normal text-xs text-[#5D5D5D]">
              {new Date(time).toLocaleDateString()}
            </time>
          </div>
          <button type="button" onClick={() => setIsOpenMore(id)}>
            <img src={More} alt="더보기" />
          </button>
        </div>
        <div className="absolute right-0 top-10 z-50">
          {isOpenMore && (
            <MoreButton
              isMine={isMine}
              isComment={true}
              ref={ref}
              onDelete={() => onDelete?.(id)}
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
