import Question from '/src/assets/question.svg?react';
import With from '/src/assets/with.svg?react';
import Tip from '/src/assets/tip.svg?react';
import Challenge from '/src/assets/challenge.svg?react';
import More from '/src/assets/more.svg';
import BasicProfile from '/src/assets/basicProfile.png';
import Comment from '/src/assets/comment.svg';
import Script from '/src/assets/script.svg';
import FilledScript from '/src/assets/script-filled.svg';
import MoreButton from './MoreButton';
import { useNavigate } from 'react-router-dom';
import { filterCategoryEntoKo } from '../../utils/filterCategory';
import useUpdateScrap from '../../hooks/community/useUpdateScrap';
import RoomCard from '../common/RoomCard/RoomCard';

interface PostDetailCardProps {
  id: number;
  type: string;
  title: string;
  authorId: number;
  author: string | null;
  authorImage: string;
  time: Date;
  content: string;
  images: { imageUrl: string; imageName: string }[];
  commentNumber: number;
  scriptNumber: number;
  onClick: () => void;
  isOpenMore: boolean;
  isMine: boolean;
  isScraped: boolean;
  chatRoomId?: number;
  chatRoomTitle?: string;
  location?: string;
  date?: Date;
  pre?: number;
  all?: number;
  chatRoomImage?: string;
  chatRoomImageName?: string;
  gender?: string;
  ref: React.RefObject<HTMLDivElement | null>;
  onDelete: () => void;
  onModify: () => void;
  onReport?: () => void;
}

const PostDetailCard = ({
  id,
  type,
  title,
  authorId,
  author,
  authorImage,
  time,
  content,
  images,
  commentNumber,
  scriptNumber,
  onClick,
  isOpenMore,
  isMine,
  isScraped,
  chatRoomId,
  chatRoomTitle,
  location,
  date,
  pre,
  all,
  chatRoomImage,
  chatRoomImageName,
  gender,
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

  const navigate = useNavigate();

  const handleProfileDetail = () => {
    navigate(`/profile/${authorId}`);
  };

  const { mutate: updateScrap } = useUpdateScrap();

  const handleScrap = () => {
    updateScrap(id);
  };

  return (
    <div className="flex flex-col gap-3 p-5 border border-[#FFCEAA] rounded-xl relative">
      <div className="flex justify-between">
        <div className="flex gap-1.5">
          {typeIcon(filterCategoryEntoKo(type) || '')}
          <span className="font-[pretendard] font-medium text-sm text-[#F78938]">
            {filterCategoryEntoKo(type)}
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
            isComment={false}
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
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={handleProfileDetail}
        >
          <img
            src={authorImage ?? BasicProfile}
            alt={author ? author : '익명'}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-[pretendard] font-medium text-sm text-[#5D5D5D]">
            {author ? author : '익명'}
          </span>
        </div>

        <time className="font-[pretendard] font-normal text-xs text-[#5D5D5D]">
          {new Date(time).toLocaleDateString()}
        </time>
      </div>

      <div>
        <p className="font-[pretendard] font-medium text-[#262626] break-keep">
          {content}
        </p>
        {images ? (
          <div className="pt-2 flex flex-col gap-2">
            {images.map((img, idx) => (
              <img src={img.imageUrl} alt={`${img.imageName}`} key={idx} />
            ))}
          </div>
        ) : null}
      </div>

      {chatRoomId && (
        <RoomCard
          id={chatRoomId}
          title={chatRoomTitle}
          location={location}
          date={date}
          pre={pre}
          all={all}
          imageUrl={chatRoomImage}
          imageName={chatRoomImageName}
          gender={gender}
        />
      )}

      <div className="flex justify-end gap-1">
        <div className="flex gap-1 items-center">
          <img src={Comment} alt="댓글 수" className="w-6 h-6" />
          <span className="font-[pretendard] font-medium text-xs text-[#F78938]">
            {commentNumber}
          </span>
        </div>
        <button
          type="button"
          className="flex gap-1 items-center cursor-pointer"
          onClick={handleScrap}
        >
          <img
            src={isScraped ? FilledScript : Script}
            alt="스크립 수"
            className="w-6 h-6"
          />
          <span className="font-[pretendard] font-medium text-xs text-[#F78938]">
            {scriptNumber}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PostDetailCard;
