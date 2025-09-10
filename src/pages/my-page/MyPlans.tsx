import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate } from 'react-router-dom';
import PostNone from '/src/assets/post-none.svg';
import { getMyPlans } from '../../apis/mypage';
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

const getTransportDisplay = (type: string) => {
  return transports.find((t) => t.value === type)?.display || '';
};

const getTripDuration = (start: string, end: string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const nights = endDate.diff(startDate, 'day');
  const days = nights + 1;
  if (nights === 0) return '당일치기';
  return `${nights}박 ${days}일`;
};

export default function MyPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getMyPlans(undefined, 0, 10);
        if (res.isSuccess) {
          setPlans(res.result.content);
        } else {
          alert(res.message);
        }
      } catch (err) {
        console.error(err);
        alert('여행 계획을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <div className="text-center pt-40">로딩 중...</div>;
return (
    <div className="font-[Pretendard] bg-[#FFFFFD] min-h-screen flex justify-center">
      <div className="w-full max-w-[480px]">
        {plans.length === 0 ? (
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
          <div className="p-4 flex flex-col gap-4">
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
                  <span className='font-semibold text-[#F78937]'>
                    {getTripDuration(plan.startDate, plan.endDate)}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span>
                    {dayjs(plan.startDate).format('YYYY.MM.DD')} ~ {dayjs(plan.endDate).format('YYYY.MM.DD')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
