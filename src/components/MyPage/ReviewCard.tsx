import React from 'react';
import dayjs from 'dayjs';
import type { ReviewItem } from '../../types/mypage';
import MapIcon from '../../assets/mapPin.svg?react';
import ProfileDefImg from '../../assets/profileDefault.svg';
import StarIcon from '../../assets/Star.svg?react';
import NoStarIcon from '../../assets/noStar.svg?react';

const DIFFICULTY_STYLES: { [key: string]: string } = {
  EASY: 'bg-[#C8F5DA] text-[#006259]',
  NORMAL: 'bg-[#FFED8C] text-[#F78937]',
  HARD: 'bg-[#FFBBBB] text-[#FF3E3E]',
};

interface ReviewCardProps {
  review: ReviewItem;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full font-[Pretendard]">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <img
            src={review.userProfileImage || ProfileDefImg}
            alt={review.userNickname}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{review.userNickname}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) =>
                index < review.rating ? (
                  <StarIcon key={index} className="w-4 h-4 text-yellow-400" />
                ) : (
                  <NoStarIcon key={index} className="w-4 h-4 text-gray-300" />
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span
            className={`px-1 py-0.5 text-xs font-bold rounded ${
              DIFFICULTY_STYLES[review.difficulty] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {review.difficulty}
          </span>
          <div className="text-xs text-[#666666] font-normal">
            <button className="cursor-pointer">수정</button>
            <span> · </span>
            <button className="cursor-pointer text-[#FF3E3E]">삭제</button>
          </div>
        </div>
      </div>

      {review.thumbnailUrl && (
        <img
          src={review.thumbnailUrl}
          alt="리뷰 사진"
          className="w-32 h-32 object-cover rounded-lg mb-4"
        />
      )}

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{review.reviewText}</p>

      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 mt-6">
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-orange-50 text-[#F78937] rounded-full text-xs"
            >
              # {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <MapIcon />
          <span>{review.touristSpotName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{dayjs(review.createdAt).format('YYYY.MM.DD')}</span>
          {review.receipt && <span className="text-[#F78937] font-semibold">· 영수증</span>}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;