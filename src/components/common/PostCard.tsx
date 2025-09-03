import Question from '/src/assets/question.svg?react';
import With from '/src/assets/with.svg?react';
import Tip from '/src/assets/tip.svg?react';
import Challenge from '/src/assets/challenge.svg?react';
import Comment from '/src/assets/comment.svg';
import { useNavigate } from 'react-router-dom';
import { filterCategoryEntoKo } from '../../utils/filterCategory';

interface PostCardProps {
  id: number;
  type: string;
  title: string;
  content: string;
  commentNumber: number;
  time: Date | string;
  writer: string | null;
  image: string | null;
}

const PostCard = ({
  id,
  type,
  title,
  content,
  commentNumber,
  time,
  writer,
  image,
}: PostCardProps) => {
  const navigate = useNavigate();

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

  const handleNavigate = () => {
    navigate(`/community/${id}`);
  };

  return (
    <div
      className="flex justify-between items-center px-5 py-4 border border-[#FFCEAA] rounded-xl select-none"
      onClick={handleNavigate}
    >
      <div className="flex flex-col gap-2">
        <h2 className="flex gap-1.5">
          {typeIcon(filterCategoryEntoKo(type) || '')}
          <p className="font-[pretendard] font-medium text-sm text-[#F78938]">
            {filterCategoryEntoKo(type)}
          </p>
        </h2>
        <h3 className="font-[pretendard] font-semibold text-black">{title}</h3>
        <p className="font-[pretendard] font-normal text-sm text-[#5D5D5D] line-clamp-2">
          {content}
        </p>

        <div className="flex gap-1">
          <div className="flex gap-1">
            <img src={Comment} alt="댓글" />
            <span
              aria-label="댓글 수"
              className='font-[pretendard] font-medium text-xs text-[#F78938] after:content-["|"] after:pl-1 after:text-[#666666]'
            >
              {commentNumber}
            </span>
          </div>
          <time className='font-[pretendard] font-normal text-xs text-[#666666] after:content-["|"] after:pl-1 after:text-[#666666]'>
            {new Date(time).toLocaleDateString()}
          </time>
          <span
            aria-label="작성자"
            className="font-[pretendard] font-normal text-xs text-[#666666]"
          >
            {writer ? writer : '익명'}
          </span>
        </div>
      </div>

      {image && (
        <img src={image} alt={title} className="w-25 h-25 rounded-xl" />
      )}
    </div>
  );
};

export default PostCard;
