import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Headers/BackHeader';
import CalendarIcon from '../../assets/calendar.svg?react';
import MapIcon from '../../assets/map.svg?react';

const PlanPage = () => {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [noPlaceSelected, setNoPlaceSelected] = useState(false);
  const [planType, setPlanType] = useState<'ai' | 'manual' | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);

  const transports = ['🚶‍♂️ 도보', '🚗 자차', '🚌 버스', '🚕 택시','🚆 기차', '🚲 자전거'];

  return (
    <div className="flex justify-center bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] pb-10">
        <Header title="계획 짜기" />
        <div className="flex flex-col gap-6 pt-3 font-['Pretendard']">
          <div>
            <label className="text-black text-base font-medium leading-none">날짜</label>
            <div
              className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2"
              onClick={() => setIsCalendarOpen(true)}>
              <input
                type="text"
                placeholder="여행 날짜를 선택해주세요"
                className="w-full focus:outline-none font-medium"
                readOnly/>
              <CalendarIcon />
            </div>
          </div>
          <div>
            <label className="text-black text-base font-medium leading-none">교통수단 선택</label>
            <div className="flex gap-4 mt-2 overflow-x-auto px-1 no-scrollbar">
              {transports.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedTransport(item)}
                  className={`px-7.5 py-4 rounded-xl outline outline-1 outline-offset-[-1px] 
                    flex-shrink-0 inline-flex justify-center items-center gap-2.5 text-[14px] font-regular font-['Pretendard'] leading-none
                    ${ selectedTransport === item ? 'bg-[#F78937] text-white outline-[#F78937]'
                        : 'bg-white text-gray-600 outline-gray-300'}`}>{item}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-black text-base font-medium leading-none">관광지 선택</label>
            <div className="flex flex-col gap-2 mt-2">
              <div
                className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between"
                onClick={() => navigate('/search')}>
                <input
                  type="text"
                  placeholder="장소를 선택해주세요"
                  className="w-full focus:outline-none font-medium"
                  readOnly/>
                <MapIcon />
              </div>
              {/* 선택한 관광지 목록 추가 */}
              <button
                type="button"
                className={`text-left h-12.5 px-4 py-2 rounded-xl text-sm border 
                    ${ noPlaceSelected ? 'text-[#F78937] border-[#F78937] border-[1.5px] font-medium'
                    : 'bg-[#FFFFFD] text-[#5D5D5D] border-[#D9D9D9]'}`}
                onClick={() => setNoPlaceSelected(prev => !prev)}>관광지 선택없이 계획짜기</button>
            </div>
          </div>
          <div>
            <label className="text-black text-base font-medium leading-none">계획방식 선택</label>
            <div className="flex flex-col gap-2 mt-2">
              <button
                type="button"
                className={`text-left h-12.5 px-4 py-2 rounded-xl text-sm border 
                    ${ planType === 'ai' ? 'text-[#F78937] border-[#F78937] border-[1.5px] font-medium'
                    : 'bg-[#FFFFFD] text-[#5D5D5D] border-[#D9D9D9]'}`}
                onClick={() => setPlanType('ai')}>
                ✨ AI가 추천하는 계획으로 시작할게요
              </button>
              <button
                type="button"
                className={`text-left h-12.5 px-4 py-2 rounded-xl text-sm border 
                    ${planType === 'manual' ? 'text-[#F78937] border-[#F78937] border-[1.5px] font-medium'
                    : 'bg-[#FFFFFD] text-[#5D5D5D] border-[#D9D9D9]'}`}
                onClick={() => setPlanType('manual')}>✏️ 제가 직접 계획할게요</button>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="max-w-[480px] mx-auto px-4 py-3">
              <button className="w-full bg-[#F78938] text-white py-4 rounded-[10px] text-base font-semibold leading-snug">
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
