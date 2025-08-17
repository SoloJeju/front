import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');
import Header from '../../components/common/Headers/BackHeader';
import Calendar from '../../components/Plus/CalendarPannel';
import MinusIcon from '../../assets/minusIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import CalendarIcon from '../../assets/calendar.svg?react';
import MapIcon from '../../assets/map.svg?react';
import ClockIcon from '../../assets/clockStroke.svg?react';

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const increaseCount = () => setCount(prev => prev + 1);
  const decreaseCount = () => setCount(prev => (prev > 1 ? prev - 1 : 1));
  const handleDateSelect = (start: string, end: string | null) => {
    setSelectedDate(start); 
    setIsCalendarOpen(false); 
  };

  const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY. MM. DD (ddd)') : '';

  return (
    <div className="flex justify-center bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] pb-10">
        <Header title="동행방 개설" />
        
        <div className="flex flex-col gap-6 pt-3 font-['Pretendard']">
          <div>
            <label className="text-black text-base font-medium leading-none">제목</label>
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              className="w-full mt-2 border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">장소</label>
            <div className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2" onClick={() => navigate('/search')}>
              <input type="text" placeholder="장소를 선택해주세요" className="w-full focus:outline-none font-medium" readOnly />
              <MapIcon/>
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">날짜</label>
            <div className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2 cursor-pointer"
            onClick={() => setIsCalendarOpen(true)}>
              <input
                type="text"
                placeholder="동행 날짜를 선택해주세요"
                className="w-full focus:outline-none font-medium bg-transparent cursor-pointer"
                value={formattedDate}
                readOnly
              />
              <CalendarIcon/>
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">시간</label>
            <div className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2" >
              <input
                type="text"
                placeholder="동행 시간을 선택해주세요"
                className="w-full focus:outline-none font-medium"
                readOnly
              />
              <ClockIcon/>
            </div>
          </div>

          <div>
            <div className="flex flex-row items-center justify-between pb-1">
              <label className="text-black text-base font-medium leading-none">인원 수</label>
              <span className="text-xs text-[#B4B4B4]">본인 포함</span>
            </div>
            <div className="flex items-center justify-between w-full border border-[#D9D9D9] rounded-xl px-4 py-3 mt-2">
              <button onClick={decreaseCount} className="text-xl text-[#F78938] cursor-pointer"><MinusIcon/></button>
              <span className="text-lg font-semibold">{count}</span>
              <button onClick={increaseCount} className="text-xl text-[#F78938] cursor-pointer"><PlusIcon /></button>
            </div>
          </div>

          <div>
            <div className="flex flex-row items-center justify-between pb-1">
              <label className="text-black text-base font-medium leading-none">내용</label>
              <span className="text-xs text-[#B4B4B4]">선택</span>
            </div>
            <textarea
              placeholder="간단한 설명을 적어주세요!"
              rows={5}
              className="w-full mt-2 border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none mb-14 font-medium"
            />
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="max-w-[480px] mx-auto px-4 py-3">
              <button className="w-full bg-[#F78938] text-white py-4 rounded-[10px] text-base font-semibold leading-snug">
                개설하기
              </button>
            </div>
          </div>
        </div>
      </div>
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300 ease-out"
          onClick={() => setIsCalendarOpen(false)}>
          <div
            className="w-full max-w-[480px] bg-white rounded-t-2xl transform transition-transform duration-300 ease-out translate-y-0 animate-slide-up"
            onClick={(e) => e.stopPropagation()}>
            <Calendar 
              onSelect={handleDateSelect} 
              mode="single"/>
          </div>
        </div>
      )}
      

    </div>
  );
};

export default CreateRoomPage;