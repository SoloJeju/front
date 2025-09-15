import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate } from 'react-router-dom';
import PostNone from '/src/assets/post-none.svg';
import useMyPlans from '../../hooks/mypage/useGetMyPlan';
import type { PlanItem } from '../../types/mypage';

dayjs.locale('ko');

const transports = [
  { display: '🚶‍♂️', value: 'WALK' },
  { display: '🚗', value: 'CAR' },
  { display: '🚌', value: 'BUS' },
  { display: '🚕', value: 'TAXI' },
  { display: '🚆', value: 'TRAIN' },
  { display: '🚲', value: 'BICYCLE' },
] as const;

const getTransportDisplay = (type: string) =>
  transports.find((t) => t.value === type)?.display || '';

const getTripDuration = (start: string, end: string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const nights = endDate.diff(startDate, 'day');
  const days = nights + 1;
  return nights === 0 ? '당일치기' : `${nights}박 ${days}일`;
};

export default function MyPlans() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyPlans(10);

  const plans: PlanItem[] = data?.pages ?? [];
  const isEmpty = !isLoading && !isError && plans.length === 0;

  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loader.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -80px 0px' }
    );
    io.observe(loader.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div className="text-center pt-40">로딩 중...</div>;
  if (isError)
    return <div className="text-center pt-40">오류가 발생했습니다.</div>;

  return (
    <div className="font-[Pretendard] bg-[#FFFFFD] min-h-screen flex justify-center">
      <div className="w-full max-w-[480px]">
        {isEmpty ? (
          <div className="pt-40 text-center flex flex-col items-center text-gray-500">
            <img
              src={PostNone}
              alt="빈 상태"
              className="w-[170px] h-[102px] mb-4"
            />
            <p className="text-lg">아직 여행 계획이 없네요!</p>
            <p className="mt-2 text-sm">새로운 여행을 계획해보세요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-24">
            {plans.map((plan) => (
              <div
                key={plan.planId}
                className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-3"
                onClick={() => navigate(`/plan/${plan.planId}`)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold leading-tight tracking-tight mb-4 items-center">
                    {plan.title} {getTransportDisplay(plan.transportType)}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-[#F78937]">
                    {getTripDuration(plan.startDate, plan.endDate)}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span>
                    {dayjs(plan.startDate).format('YYYY.MM.DD')} ~{' '}
                    {dayjs(plan.endDate).format('YYYY.MM.DD')}
                  </span>
                </div>
              </div>
            ))}

            <div ref={loader} style={{ height: 50 }} />
            {isFetchingNextPage && (
              <p className="text-center p-4 text-[#F78937]">
                더 불러오는 중...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
