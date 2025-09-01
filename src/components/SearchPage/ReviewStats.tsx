const difficultyData = {
  EASY: 73,
  NORMAL: 20,
  HARD: 7,
};

const pointsData = [
  { label: "직원이 친절해요", emoji: "😊", value: 80 },
  { label: "가성비가 좋아요", emoji: "💸", value: 65 },
  { label: "혼밥하기 좋아요", emoji: "🍚", value: 98 },
];

const colors = ["#FAA14B", "#F7C999", "#F78938"];


export default function ReviewStats() {
  const displayedPoints = pointsData;
  return (
    <div className="flex-col items-start w-full flex-shrink-0">
      <div>
        <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
        혼놀 난이도
        </h2>

        <div className="w-full h-8 flex overflow-hidden mt-4">
            <div
                className="h-full"
                style={{ width: `${difficultyData.EASY}%` }}
            >
                <div className="h-full bg-[#F7C999]" style={{ width: '100%' }} />
            </div>
            <div
                className="h-full"
                style={{ width: `${difficultyData.NORMAL}%` }}
            >
                <div className="h-full bg-[#FAA14B]" style={{ width: '100%' }} />
            </div>
            <div
                className="h-full"
                style={{ width: `${difficultyData.HARD}%` }}
            >
                <div className="h-full bg-[#F78938]" style={{ width: '100%' }} />
            </div>
        </div>
        <h4 className="mt-2 font-[Pretendard] text-[14px] font-not-italic leading-[20px] tracking-[-0.36px]">
            73%의 혼놀인들이 EASY를 택했어요 🌱<br/>  
            혼자여도 전혀 부담 없는 곳이에요!
        </h4>
      </div>

      <div className="mt-10 flex flex-col items-start w-full flex-shrink-0">
        <h2 className="self-stretch text-[#000] font-[Pretendard] text-[18px] not-italic font-semibold leading-[20px] tracking-[-0.36px] mt-[4px]">
            혼행 포인트
        </h2>
        <div className="mt-4 flex flex-col gap-2 w-full">
            {displayedPoints.map((point, index) => (
              <div key={point.label} 
                className="w-full h-[48px] flex-shrink-0 border border-gray-300 rounded-xl relative flex items-center">
                  <div
                    className="h-full bg-orange-500 flex items-center px-2 rounded-xl text-[#262626] font-[Pretendard] text-[16px] not-italic font-medium leading-[16px]"
                    style={{ 
                      width: `${point.value}%`,
                      backgroundColor: colors[index % colors.length],}}                    >
                    <span className="flex items-center gap-1">
                      {point.emoji} {point.label}
                    </span>
                  </div>
                <span className="absolute right-2 text-[#262626] font-[Pretendard] text-[16px] not-italic font-medium leading-[16px]">
                  {point.value}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
