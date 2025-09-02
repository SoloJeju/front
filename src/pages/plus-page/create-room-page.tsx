import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { createRoom } from '../../apis/room';
import type { CreateRoomPayload } from '../../types/room';
import Header from '../../components/common/Headers/BackHeader';
import Calendar from '../../components/Plus/CalendarPannel';
import TimePicker from '../../components/Plus/TimePannel';
import MinusIcon from '../../assets/minusIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import CalendarIcon from '../../assets/calendar.svg?react';
import MapIcon from '../../assets/map.svg?react';
import ClockIcon from '../../assets/clockStroke.svg?react';
dayjs.locale('ko');

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentId, setContentId] = useState<number | null>(2755053);
  const [spotName, setSpotName] = useState('');
  const [maxMembers, setMaxMembers] = useState(2);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'MIXED' | 'MALE' | 'FEMALE'>('MIXED');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  useEffect(() => {
    if (location.state?.selectedPlace) {
      setContentId(location.state.selectedPlace.id);
      setSpotName(location.state.selectedPlace.name);
    }
  }, [location.state]);

  const genderOptions = [
    { value: 'MIXED', label: '상관없음' },
    { value: 'MALE', label: '남성' },
    { value: 'FEMALE', label: '여성' },
  ] as const;

  const increaseCount = () => setMaxMembers((prev) => prev + 1);
  const decreaseCount = () => setMaxMembers((prev) => (prev > 2 ? prev - 1 : 2));

  const handleDateSelect = (start: string) => {
    setSelectedDate(start);
    setIsCalendarOpen(false);
  };

  const handleTimeSelect = (time: string) => {
  if (!time) return;

  const [ampm, hm] = time.split(' ');
  const [h, m] = hm.split(':').map(Number);

  let hours = h;    
  const minutes = m;   

  if (ampm === '오후' && hours < 12) hours += 12;
  if (ampm === '오전' && hours === 12) hours = 0;

  const convertedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  setSelectedTime(convertedTime);
  setIsTimeOpen(false);
};


  const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY. MM. DD (ddd)') : '';
  const handleSubmit = async () => {
    if (!title || !contentId || !selectedDate || !selectedTime) {
      alert('제목, 장소, 날짜, 시간은 필수 항목입니다.');
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const joinDate = dayjs(selectedDate)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .toISOString();

    const payload: CreateRoomPayload = {
      title,
      description,
      contentId,
      joinDate,
      maxMembers,
      genderRestriction: selectedGender,
    };

    try {
      const response = await createRoom(payload);
      if (response.isSuccess) {
        alert('동행방이 성공적으로 개설되었습니다!');
        navigate(`/room/${response.result.chatRoomId}`);
      } else {
        alert(response.message || '개설에 실패했습니다.');
      }
    } catch (error) {
      console.error('동행방 생성 실패:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };


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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">장소</label>
            <div
              className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2"
              onClick={() => navigate('/search', { state: { from: location.pathname } })}
            >
              <input
                type="text"
                placeholder="장소를 선택해주세요"
                value={spotName}
                className="w-full focus:outline-none font-medium bg-transparent cursor-pointer"
                readOnly
              />
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
             <div
              className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2 cursor-pointer"
              onClick={() => setIsTimeOpen(true)}
            >
              <input
                type="text"
                placeholder="동행 시간을 선택해주세요"
                className="w-full focus:outline-none font-medium bg-transparent cursor-pointer"
                value={selectedTime || ""}
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
              <span className="text-lg font-semibold">{maxMembers}</span>
              <button onClick={increaseCount} className="text-xl text-[#F78938] cursor-pointer"><PlusIcon /></button>
            </div>
          </div>

          <div>
            <div className="flex flex-row items-center justify-between pb-1">
              <label className="text-black text-base font-medium leading-none">성별</label>
              <span className="text-xs text-[#B4B4B4]">선택</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedGender(option.value)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors
                    ${
                      selectedGender === option.value
                        ? 'bg-[#F78937] text-white'
                        : 'bg-white text-gray-500 border border-gray-300'
                    }`}
                >
                  {option.label}
                </button>
              ))}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none mb-14 font-medium"
            />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="max-w-[480px] mx-auto px-4 py-3">
              <button
                onClick={handleSubmit}
                className="w-full bg-[#F78938] text-white py-4 rounded-[10px] text-base font-semibold leading-snug">
                개설하기
              </button>
          </div>
        </div>
      </div>
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300 ease-out bg-black/20"
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
      {isTimeOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300 ease-out bg-black/20"
          onClick={() => setIsTimeOpen(false)}>
          <div
            className="w-full max-w-[480px] bg-white rounded-t-2xl transform transition-transform duration-300 ease-out translate-y-0 animate-slide-up"
            onClick={(e) => e.stopPropagation()}>
            <TimePicker onSelect={handleTimeSelect} onClose={() => setIsTimeOpen(false)}/>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateRoomPage;