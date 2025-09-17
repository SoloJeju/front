import ReviewCard from './ReviewCard';
import StarIcon from '/src/assets/Star.svg?react';
import StarEmptyIcon from '/src/assets/StarEmpty.svg?react';
import type { SpotReview } from '../../types/tourist';

interface ReviewListProps {
  reviewList: SpotReview[];
}

export default function ReviewList({ reviewList }: ReviewListProps) {
  const rating =
    reviewList.length > 0
      ? reviewList.reduce((acc, review) => acc + review.rating, 0) /
        reviewList.length
      : 0;

  const Star = Math.floor(rating);
  const StarEmpty = 5 - Star;

  return (
    <div className="w-full flex flex-col gap-4 mt-8">
      <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
        리뷰
      </h2>
      <div className="inline-flex items-center gap-[12px]">
        <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
          {rating}
        </h2>
        <div className="flex gap-1">
          {Array.from({ length: Star }).map((_, i) => (
            <StarIcon key={`full-${i}`} />
          ))}
          {Array.from({ length: StarEmpty }).map((_, i) => (
            <StarEmptyIcon key={`empty-${i}`} />
          ))}
        </div>
      </div>
      <div className="w-full pb-3">
        {reviewList.length > 0 &&
          reviewList.map((review, idx) => (
            <ReviewCard
              key={idx}
              user={review.userNickname}
              date={review.createdAt}
              level={review.difficulty}
              rating={review.rating}
              content={review.text}
              profile={review.userProfileImageUrl}
              receipt={review.receipt}
              images={review.imageUrls}
            />
          ))}
      </div>
    </div>
  );
}
