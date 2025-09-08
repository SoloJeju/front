import ProfileDefImg from '../../assets/profileDefault.svg?react';
import EASYIcon from '../../assets/TagEASY.svg?react';
import NORMALIcon from '../../assets/TagNORMAL.svg?react';
import HARDIcon from '../../assets/TagHARD.svg?react';
import StarIcon from '../../assets/Star.svg?react';
import StarEmptyIcon from '../../assets/StarEmpty.svg?react';
import ReceiptIcon from '../../assets/receipt.svg?react';

type ReviewCardProps = {
  user: string;
  date: Date;
  level: string;
  content: string;
  profile?: string;
  images?: string[];
  receipt?: string;
  rating: number;
};

// 레벨별 아이콘 매핑
const levelIcon: {
  [key: string]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  EASY: EASYIcon,
  NORMAL: NORMALIcon,
  HARD: HARDIcon,
};

export default function ReviewCard({
  user,
  date,
  level,
  content,
  profile,
  images,
  receipt,
  rating,
}: ReviewCardProps) {
  const LevelIcon = levelIcon[level];

  const Star = Math.floor(rating);
  const StarEmpty = 5 - Star;

  return (
    <div className="w-full rounded-[12px] border border-[#D9D9D9] shadow-[0_2px_4px_rgba(0,0,0,0.1)] p-4 bg-white">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            {profile ? (
              <img
                src={profile}
                alt="프로필"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <ProfileDefImg className="w-8 h-8" />
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-black font-[Pretendard] text-[16px] not-italic font-medium leading-[18px] tracking-[-0.28px]">
              {user}
            </p>
            <div className="flex">
              {Array.from({ length: Star }).map((_, i) => (
                <StarIcon key={`full-${i}`} className="w-3 h-3" />
              ))}
              {Array.from({ length: StarEmpty }).map((_, i) => (
                <StarEmptyIcon key={`empty-${i}`} className="w-3 h-3" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <LevelIcon className="w-14 h-12" />
        </div>
      </div>
      {images &&
        images.map((image) => (
          <img
            src={image}
            alt="리뷰 이미지"
            className="w-[107px] h-[128px] rounded-[12px] object-cover mb-2"
          />
        ))}
      <p className="text-black font-[Pretendard] text-[16px] not-italic font-normal leading-[22px] tracking-[-0.28px]">
        {content}
      </p>
      <div className="flex justify-end items-center gap-1">
        <p className="text-[#666] font-[Pretendard] text-[12px] not-italic font-normal leading-[14px] tracking-[-0.24px]">
          {new Date(date).toLocaleDateString()}
        </p>
        {receipt && (
          <div className="flex items-center">
            <p className="text-[#666] font-[Pretendard] text-[12px] not-italic font-normal leading-[14px] tracking-[-0.24px]">
              ㆍ{receipt}
            </p>
            <ReceiptIcon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
