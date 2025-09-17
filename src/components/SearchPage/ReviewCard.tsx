import ProfileDefImg from '/src/assets/profileDefault.svg?react';
import StarIcon from '/src/assets/Star.svg?react';
import StarEmptyIcon from '/src/assets/StarEmpty.svg?react';
import ReceiptIcon from '/src/assets/receipt.svg?react';

type ReviewCardProps = {
  user: string;
  date: Date;
  level: string;
  content: string;
  profile?: string;
  images?: string[];
  receipt?: boolean;
  rating: number;
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
  const Star = Math.floor(rating);
  const StarEmpty = 5 - Star;

  return (
    <div className="w-full rounded-[12px] border border-[#D9D9D9] shadow-[0_2px_4px_rgba(0,0,0,0.1)] p-4 bg-white mb-4">
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
          <p
            className={`w-fit px-1 py-0.5 font-bold text-[10px] rounded-sm   ${level === 'EASY' ? 'text-[#006259] bg-[#C8F5DA]' : level === 'MEDIUM' ? 'text-[#F78938] bg-[#FFEE8C]' : level === 'HARD' ? 'text-[#FF3E3E] bg-[#FFBBBB]' : 'text-[#707070] bg-[#C2C6C4]'}`}
          >{level === 'MEDIUM' ? 'NORMAL' : level}
          </p>
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
          <div className="flex items-center gap-1">
            <p className="text-[#666] font-[Pretendard] text-[12px] not-italic font-normal leading-[14px] tracking-[-0.24px]">
              ㆍ 영수증
            </p>
            <ReceiptIcon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
