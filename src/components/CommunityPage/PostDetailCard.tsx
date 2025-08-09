import React from 'react';
import Question from '/src/assets/question.svg?react';
import With from '/src/assets/with.svg?react';
import Tip from '/src/assets/tip.svg?react';
import Challenge from '/src/assets/challenge.svg?react';
import More from '/src/assets/more.svg';
import DefaultProfile from '/src/assets/DefaultProfile.png';
import Comment from '/src/assets/comment.svg';
import Script from '/src/assets/script.svg';
import MoreButton from './MoreButton';

interface PostDetailCardProps {
  id: number;
  type: string;
  title: string;
  writer: string | null;
  time: string;
  content: string;
  image: string | null;
  commentNumber: number;
  scriptNumber: number;
  onClick: () => void;
  isOpenMore: boolean;
  isMine: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  onDelete: () => void;
  onModify: () => void;
  onReport?: () => void;
}

const PostDetailCard = ({
  type,
  title,
  writer,
  time,
  content,
  image,
  commentNumber,
  scriptNumber,
  onClick,
  isOpenMore,
  isMine,
  ref,
  onDelete,
  onModify,
  onReport,
}: PostDetailCardProps) => {
  const typeIcon = (type: string) => {
    switch (type) {
      case '궁금해요':
        return <Question className="text-[#F78938]" />;
      case '동행제안':
        return <With className="text-[#F78938]" />;
      case '혼행꿀팁':
        return <Tip className="text-[#F78938]" />;
      case '챌린지':
        return <Challenge className="text-[#F78938]" />;
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5 border border-[#FFCEAA] rounded-xl relative">
      <div className="flex justify-between">
        <div className="flex gap-1.5">
          {typeIcon(type)}
          <span className="font-[pretendard] font-medium text-sm text-[#F78938]">
            {type}
          </span>
        </div>
        <button type="button" onClick={() => onClick?.()}>
          <img src={More} alt="더보기" />
        </button>
      </div>
      <div className="absolute right-0 top-10">
        {isOpenMore && (
          <MoreButton
            isMine={isMine}
            ref={ref}
            onDelete={() => onDelete?.()}
            onModify={() => onModify?.()}
            onReport={() => onReport?.()}
          />
        )}
      </div>

      <h3 className="font-[pretendard] font-semibold text-black text-lg">
        {title}
      </h3>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <img
            src={DefaultProfile}
            alt={writer ? writer : '익명'}
            className="w-6 h-6"
          />
          <span className="font-[pretendard] font-medium text-sm text-[#5D5D5D]">
            {writer ? writer : '익명'}
          </span>
        </div>

        <time className="font-[pretendard] font-normal text-xs text-[#5D5D5D]">
          {time}
        </time>
      </div>

      <div>
        <p className="font-[pretendard] font-medium text-[#262626] break-keep">
          {content}
        </p>
        {image ? <img src={image} alt={`${title}의 이미지`} /> : null}
      </div>

      <div className="flex justify-end gap-1">
        <div className="flex gap-1 items-center">
          <img src={Comment} alt="댓글 수" className="w-6 h-6" />
          <span className="font-[pretendard] font-medium text-xs text-[#F78938]">
            {commentNumber}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <img src={Script} alt="스크립 수" className="w-6 h-6" />
          <span className="font-[pretendard] font-medium text-xs text-[#F78938]">
            {scriptNumber}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PostDetailCard);
