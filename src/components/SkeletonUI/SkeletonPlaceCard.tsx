import { memo } from "react";

const SkeletonPlaceCard = () => {
  return (
    <div
      className="flex w-full h-[92px] bg-[#FFFFFD] items-center font-[Pretendard] animate-pulse"
      style={{ borderBottom: "1px solid #F78938" }}
    >
      <div className="relative w-[108px] h-[80px] shrink-0 bg-gray-200 rounded-[12px]" />
      <div className="flex flex-col flex-1 justify-center pl-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-3 w-40 bg-gray-200 rounded" />
          <div className="h-2 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

// memo로 불필요한 리렌더링 방지
export default memo(SkeletonPlaceCard);
