import { getReviewText } from '../../utils/getReviewText';

const colors = {
    EASY: '#F78938',
    NORMAL: '#F7C999',
    HARD: '#FAA14B',
};

interface ReviewStatsProps {
    easy: number;
    medium: number;
    hard: number;
    topTags: {
        tagCode: number;
        label: string;
        count: number;
        pct: number;
    }[];
}

export default function ReviewStats({
    easy,
    medium,
    hard,
    topTags,
}: ReviewStatsProps) {
    const stats = [
        { label: 'EASY', value: easy, color: colors.EASY },
        { label: 'HARD', value: hard, color: colors.HARD },
        { label: 'NORMAL', value: medium, color: colors.NORMAL },
    ];
    
    const dominantStat = [...stats].sort((a, b) => b.value - a.value)[0];
    const reviewText = getReviewText({ easy, normal: medium, hard });

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;
    let cumulativeAngleForLabels = 0; 
    
    return (
        <div className="flex-col items-start w-full flex-shrink-0 pt-6 font-[Pretendard]">
            <div>
                <h2 className="text-[18px] font-semibold tracking-[-0.36px]">
                    혼놀 난이도
                </h2>
                <div className="relative w-52 h-52 mx-auto ">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        <g transform="rotate(-90 100 100)">
                            {stats.map((stat) => {
                                if (stat.value === 0) return null;
                                const dashOffset = circumference - (circumference * stat.value) / 100;
                                const rotation = (accumulatedOffset / 100) * 360;
                                accumulatedOffset += stat.value;
                                return (
                                    <circle
                                        key={stat.label}
                                        className="circle-segment"
                                        cx="100"
                                        cy="100"
                                        r={radius}
                                        fill="transparent"
                                        stroke={stat.color}
                                        strokeWidth="35"
                                        strokeDasharray={circumference}
                                        style={{ '--final-offset': dashOffset } as React.CSSProperties}
                                        transform={`rotate(${rotation} 100 100)`}
                                    />
                                );
                            })}
                        </g>
                        
                        {stats.map((stat) => {
                            if (stat.value === 0) return null;
                            let labelAngle;

                            if (stat.value === 100) {
                                labelAngle = 120;
                            } else {
                                const segmentAngle = (stat.value / 100) * 360;
                                labelAngle = cumulativeAngleForLabels + segmentAngle / 2;
                                cumulativeAngleForLabels += segmentAngle;
                            }
                            
                            const angleInRad = ((labelAngle - 90) * Math.PI) / 180;
                            const x = 100 + radius * Math.cos(angleInRad);
                            const y = 100 + radius * Math.sin(angleInRad);

                            return (
                                <foreignObject key={stat.label} x={x-40} y={y-20} width="80" height="40">
                                   <div className="flex flex-col items-center px-2 py-1 bg-white rounded-full shadow-lg text-xs font-bold text-gray-700 whitespace-nowrap">
                                        <span>{stat.label}</span>
                                        <span>
                                            <span className="text-orange-500">{stat.value}</span>%
                                        </span>
                                    </div>
                                </foreignObject>
                            );
                        })}
                    </svg>
                </div>
                
                <div className="text-center mt-3">
                    <h3 className="text-base font-medium text-gray-800 leading-tight">
                        <span className="font-bold text-[#F78938]">{dominantStat.value}%</span>
                        의 사람들이{' '}
                        <span className="font-bold text-[#F78938]">{dominantStat.label}</span>
                        {' '}난이도를 선택했어요!
                    </h3>
                    {Array.isArray(reviewText) && (
                        <div className="mt-2 text-sm text-gray-500 leading-snug">
                            <p>{reviewText[0]}</p>
                            <p>{reviewText[1]}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-10 flex flex-col items-start w-full flex-shrink-0">
                <h2 className="self-stretch text-[#000] text-[18px] not-italic font-semibold leading-[20px] tracking-[-0.36px] mt-[4px]">
                    혼행 포인트
                </h2>
                <div className="mt-4 flex flex-col gap-2 w-full">
                    {topTags.map((tag, index) => (
                        <div
                            key={tag.label}
                            className="w-full h-[48px] flex-shrink-0 border border-gray-200 rounded-xl relative flex items-center"
                        >
                            <div
                                className="h-full flex items-center px-4 rounded-l-xl text-[#262626] font-medium text-sm text-nowrap transition-all duration-1000 ease-out"
                                style={{
                                    width: `${tag.pct}%`,
                                    backgroundColor: ['#F78938', '#FAA14B', '#F7C999'][index % 3],
                                }}
                            >
                                <span>{tag.label}</span>
                            </div>
                            <span className="absolute right-6 text-gray-600 font-medium text-sm">
                                {tag.pct}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}