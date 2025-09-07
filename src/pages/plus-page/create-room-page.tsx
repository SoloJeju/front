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
import { useCreateRoomStore } from '../../stores/createroom-store';

dayjs.locale('ko');

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, setFormData, resetForm } = useCreateRoomStore();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  useEffect(() => {
    if (location.state?.selectedPlace) {
      const place = location.state.selectedPlace;
      setFormData({ contentId: Number(place.id), spotName: place.name });
    }
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state, setFormData]);

  const genderOptions = [
    { value: 'MIXED', label: '상관없음' },
    { value: 'MALE', label: '남성' },
    { value: 'FEMALE', label: '여성' },
  ] as const;

  const increaseCount = () =>
    setFormData({ maxMembers: formData.maxMembers + 1 });
  const decreaseCount = () =>
    setFormData({
      maxMembers: formData.maxMembers > 2 ? formData.maxMembers - 1 : 2,
    });

  const handleDateSelect = (start: string) => {
    setFormData({ selectedDate: start });
    setIsCalendarOpen(false);
  };

  const handleTimeSelect = (time24: string) => {
    setFormData({ selectedTime: time24 });
    setIsTimeOpen(false);
  };

  const formattedDate = formData.selectedDate
    ? dayjs(formData.selectedDate).format('YYYY. MM. DD (ddd)')
    : '';

  const displayTime = () => {
    if (!formData.selectedTime) return '';
    const [h, m] = formData.selectedTime.split(':').map(Number);
    const ampm = h >= 12 ? '오후' : '오전';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${ampm} ${hour12}:${m.toString().padStart(2, '0')}`;
  };

  const handleNavigateToSearch = () => {
    navigate('/search-box', {
      state: {
        from: location.pathname,
        formData,
      },
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.contentId ||
      !formData.selectedDate ||
      !formData.selectedTime
    ) {
      alert('제목, 장소, 날짜, 시간은 필수 항목입니다.');
      return;
    }

    const [hours, minutes] = formData.selectedTime.split(':').map(Number);
    const joinDate = dayjs(formData.selectedDate)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .format('YYYY-MM-DDTHH:mm:ss');

    const payload: CreateRoomPayload = {
      title: formData.title,
      description: formData.description,
      contentId: formData.contentId,
      joinDate,
      maxMembers: formData.maxMembers,
      genderRestriction: formData.selectedGender,
    };

    try {
      const response = await createRoom(payload);
      if (response.isSuccess) {
        alert('동행방이 성공적으로 개설되었습니다!');
        resetForm();
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
            <label className="text-black text-base font-medium leading-none">
              제목
            </label>
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              className="w-full mt-2 border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">
              장소
            </label>
            <div
              className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2 cursor-pointer"
              onClick={handleNavigateToSearch}
            >
              <input
                type="text"
                placeholder="장소를 선택해주세요"
                value={formData.spotName}
                className="w-full focus:outline-none font-medium bg-transparent cursor-pointer"
                readOnly
              />
              <MapIcon />
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">
              날짜
            </label>
            <div
              className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2 cursor-pointer"
              onClick={() => setIsCalendarOpen(true)}
            >
              <input
                type="text"
                placeholder="동행 날짜를 선택해주세요"
                className="w-full focus:outline-none font-medium bg-transparent cursor-pointer"
                value={formattedDate}
                readOnly
              />
              <CalendarIcon />
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">
              시간
            </label>
            <div
              className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2 cursor-pointer"
              onClick={() => setIsTimeOpen(true)}
            >
              <input
                type="text"
                placeholder="동행 시간을 선택해주세요"
                className="w-full focus:outline-none font-medium bg-transparent cursor-pointer"
                value={displayTime()}
                readOnly
              />
              <ClockIcon />
            </div>
          </div>

          <div>
            <div className="flex flex-row items-center justify-between pb-1">
              <label className="text-black text-base font-medium leading-none">
                인원 수
              </label>
              <span className="text-xs text-[#B4B4B4]">본인 포함</span>
            </div>
            <div className="flex items-center justify-between w-full border border-[#D9D9D9] rounded-xl px-4 py-3 mt-2">
              <button
                onClick={decreaseCount}
                className="text-xl text-[#F78938] cursor-pointer"
              >
                <MinusIcon />
              </button>
              <span className="text-lg font-semibold">
                {formData.maxMembers}
              </span>
              <button
                onClick={increaseCount}
                className="text-xl text-[#F78938] cursor-pointer"
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-row items-center justify-between pb-1">
              <label className="text-black text-base font-medium leading-none">
                성별
              </label>
              <span className="text-xs text-[#B4B4B4]">선택</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ selectedGender: option.value })}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors
                    ${
                      formData.selectedGender === option.value
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
              <label className="text-black text-base font-medium leading-none">
                내용
              </label>
              <span className="text-xs text-[#B4B4B4]">선택</span>
            </div>
            <textarea
              placeholder="간단한 설명을 적어주세요!"
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ description: e.target.value })}
              className="w-full mt-2 border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none mb-14 font-medium"
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-[480px] mx-auto px-4 py-3">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#F78938] text-white py-4 rounded-[10px] text-base font-semibold leading-snug"
            >
              개설하기
            </button>
          </div>
        </div>
      </div>

      {isCalendarOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300 ease-out bg-black/20"
          onClick={() => setIsCalendarOpen(false)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-2xl transform transition-transform duration-300 ease-out translate-y-0 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar onSelect={handleDateSelect} mode="single" />
          </div>
        </div>
      )}

      {isTimeOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300 ease-out bg-black/20"
          onClick={() => setIsTimeOpen(false)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-2xl transform transition-transform duration-300 ease-out translate-y-0 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <TimePicker
              onSelect={handleTimeSelect}
              onClose={() => setIsTimeOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoomPage;
