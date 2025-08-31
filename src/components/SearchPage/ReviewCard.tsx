import ProfileDefImg from "../../assets/profileDefault.svg?react";
import EASYIcon from "../../assets/TagEASY.svg?react";
import NORMALIcon from "../../assets/TagNORMAL.svg?react";
import HARDIcon from "../../assets/TagHARD.svg?react";
import ReceiptIcon from "../../assets/receipt.svg?react";

type ReviewCardProps = {
  user: string;
  date: string;
  level: "EASY" | "NORMAL" | "HARD";
  content: string;
  profile?: string;
  image?: string;
  receipt?: string;
};

// 레벨별 아이콘 매핑
const levelIcon = {
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
  image,
  receipt,
}: ReviewCardProps) {
  const LevelIcon = levelIcon[level];

  return (
    <div className="rounded-[12px] border border-[#D9D9D9] shadow-[0_2px_4px_rgba(0,0,0,0.1)] p-4 bg-white w-full">
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
          <p className="text-black font-[Pretendard] text-[16px] not-italic font-medium leading-[18px] tracking-[-0.28px]">
            {user}
          </p>
        </div>
        <div className="flex items-center">
          <LevelIcon className="h-8 w-10" />
        </div>
      </div>
      {image && (
        <img
          src={image}
          alt="리뷰 이미지"
          className="w-[107px] h-[128px] rounded-[12px] object-cover mb-2"
        />
      )}
      <p className="text-black font-[Pretendard] text-[16px] not-italic font-normal leading-[22px] tracking-[-0.28px]">
        {content}
      </p>
      <div className="flex justify-end items-center gap-1">
        <p className="text-[#666] font-[Pretendard] text-[12px] not-italic font-normal leading-[14px] tracking-[-0.24px]">
          {date}
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
