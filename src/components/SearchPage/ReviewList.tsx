import ReviewCard from "./ReviewCard";
import ExampleImage from "../../assets/exampleImage.png";
import StarIcon from "../../assets/Star.svg?react";
import StarEmptyIcon from "../../assets/StarEmpty.svg?react";

const dummyReviews = [
  {
    user: "홍길동",
    date: "2025.04.28",
    level: "NORMAL" as const,
    content:
      "웨이팅도 없고 혼자가기 딱 좋은 분위기였어요!\n음식도 너무 맛있었습니다~\n또 가고싶어요!",
    image: ExampleImage,
    receipt: "영수증",
  },
  {
    user: "홍길동",
    date: "2025.04.28",
    level: "NORMAL" as const,
    content:
      "웨이팅도 없고 혼자가기 딱 좋은 분위기였어요!!\n음식도 너무 맛있었습니다~\n또 가고싶어요!",
  },
  {
    user: "홍길동",
    date: "2025.04.28",
    level: "NORMAL" as const,
    content:
      "웨이팅도 없고 혼자가기 딱 좋은 분위기였어요!\n또 가고싶어요!",
  },
];

export default function ReviewList() {
    const rating = 4.5;

    const Star = Math.floor(rating);
    const StarEmpty = 5 - Star;

    return (

    <div className="flex flex-col gap-4 mt-8">
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
      {dummyReviews.map((review, idx) => (
        <ReviewCard key={idx} {...review} />
      ))}
    </div>
  );
}
