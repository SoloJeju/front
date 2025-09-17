import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Calendar from '../../components/Plus/CalendarPannel';
import CalendarIcon from '../../assets/calendar.svg?react';
import PlusCircleIcon from '../../assets/EASY.svg?react';
import CloseIcon from '../../assets/closeIcon.svg?react';
import { createPlan, createAIPlan } from '../../apis/plan';
import { usePlanStore, type DayPlan } from '../../stores/plan-store';
import Modal from '../../components/common/Modal';
import CartIcon from '../../assets/cartAdd.svg?react';
import SearchIcon from '../../assets/searchIcon.svg?react';
import LoadingImg from '../../assets/loading.gif';

dayjs.locale('ko');

const PlanPage = () => {
  const navigate = useNavigate();
  const {
    selectedPlaces,
    title,
    dateRange,
    selectedTransport,
    planType,
    dayPlans,
    removePlace,
    setTitle,
    setDateRange,
    setSelectedTransport,
    setPlanType,
    setDayPlans,
    removeSpotFromDay,
    resetPlan,
  } = usePlanStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAddPlaceModal = (dayIndex: number) => {
    setCurrentDayIndex(dayIndex);
    setIsAddPlaceModalOpen(true);
  };

  const transports = [
    { display: '🚶‍♂️ 도보', value: 'WALK' },
    { display: '🚗 자차', value: 'CAR' },
    { display: '🚌 버스', value: 'BUS' },
    { display: '🚕 택시', value: 'TAXI' },
    { display: '🚆 기차', value: 'TRAIN' },
    { display: '🚲 자전거', value: 'BICYCLE' },
  ] as const;
  
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const start = dayjs(dateRange.start);
      const end = dayjs(dateRange.end);
      const diff = end.diff(start, 'day') + 1;
      
      const newDayPlans = Array.from({ length: diff }, (_, i) => {
        const existingDay = dayPlans.find(p => p.dayIndex === i + 1);
        return {
          dayIndex: i + 1,
          date: start.add(i, 'day').format('YYYY-MM-DD'),
          spots: existingDay?.spots || [],
        };
      });
      setDayPlans(newDayPlans);
    } else {
      setDayPlans([]);
    }
  }, [dateRange.start, dateRange.end, setDayPlans]);
  
  useEffect(() => {
    if (selectedPlaces.length === 0 || dayPlans.length === 0) return;

    const existingSpotIds = new Set(
      dayPlans.flatMap(day => day.spots.map(spot => spot.contentId))
    );

    const newPlacesToAdd = selectedPlaces.filter(
      place => !existingSpotIds.has(place.contentId)
    );

    if (newPlacesToAdd.length === 0) return;

    const placesByDay = newPlacesToAdd.reduce((acc, place) => {
      if (place.dayIndex) {
        if (!acc[place.dayIndex]) {
          acc[place.dayIndex] = [];
        }
        acc[place.dayIndex].push({ contentId: place.contentId, spotName: place.spotName });
      }
      return acc;
    }, {} as Record<number, { contentId: number; spotName: string }[]>);

    setDayPlans((currentDayPlans: DayPlan[]) =>
      currentDayPlans.map(dayPlan => {
        if (placesByDay[dayPlan.dayIndex]) {
          return {
            ...dayPlan,
            spots: [...dayPlan.spots, ...placesByDay[dayPlan.dayIndex]],
          };
        }
        return dayPlan;
      })
    );
  }, [selectedPlaces, setDayPlans]);

  const handleRemovePlace = (dayIndex: number, contentId: number) => {
    removeSpotFromDay(dayIndex, contentId);
    removePlace(contentId);
  };

  const handleDateSelect = (start: string, end: string | null) => {
    if (end) {
      setDateRange({ start, end });
    }
    setIsCalendarOpen(false);
  };

  const handleCreatePlan = async () => {
    if (!title || !dateRange.start || !dateRange.end || !selectedTransport || !planType) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    
  setIsLoading(true);
  try {
    if (planType === 'manual') {
      const formattedDays = dayPlans.map(dayPlan => ({
        dayIndex: dayPlan.dayIndex,
        spots: dayPlan.spots.map((spot) => ({
          arrivalDate: `${dayPlan.date}T09:00:00`, 
          duringDate: `${dayPlan.date}T10:00:00`,
          contentId: spot.contentId,
          memo: "",
          title: spot.spotName
        }))
      }));

        const res = await createPlan({
          title,
          transportType: selectedTransport,
          startDate: `${dateRange.start}T00:00:00`,
          endDate: `${dateRange.end}T23:59:59`,
          days: formattedDays
        });
        navigate(`/plan/${res.result.planId}`);
        resetPlan();
    } else {
      const allContentIds = dayPlans.flatMap(day => day.spots.map(spot => spot.contentId));
      const res = await createAIPlan({
        title: title,
        transportType: selectedTransport,
        startDate: `${dateRange.start}T00:00:00`,
        endDate: `${dateRange.end}T23:59:59`,
        contentIds: allContentIds
      });
      navigate('/plan/ai-plan', { state: { aiPlanData: res.result}});
      resetPlan(); 
    }
  } catch (error) {
     console.error("AI Plan creation failed:", error);
  } finally {
    setIsLoading(false);
  }
};

  const formattedDateRange = dateRange.start && dateRange.end
    ? `${dayjs(dateRange.start).format('YYYY. MM. DD (ddd)')} ~ ${dayjs(dateRange.end).format('YYYY. MM. DD (ddd)')}`
    : '';

  return (
    <div className="flex justify-center bg-[#FFFFFD] min-h-screen font-['Pretendard']">
      {isLoading && (
        <div className="flex-col fixed inset-0 bg-black/50 z-[100] flex justify-center items-center">
          <img src={LoadingImg} alt="Loading" className="w-48" />
          <div className="text-white text-xl font-['Pretendard']">AI가 열심히 계획을 짜고 있어요...🍊</div>
        </div>
      )}
      <div className="w-full max-w-[480px] pb-24">
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-black text-base font-medium leading-none">여행 제목</label>
            <input
              type="text"
              placeholder="여행의 제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm mt-2 focus:outline-none focus:border-[#F78937]"
            />
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
                placeholder="여행 날짜를 선택해주세요"
                className="w-full focus:outline-none font-medium bg-transparent cursor-pointer"
                value={formattedDateRange}
                readOnly
              />
              <CalendarIcon />
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">
              교통수단 선택
            </label>
            <div className="flex gap-4 mt-2 overflow-x-auto px-1 no-scrollbar">
              {transports.map((transport) => (
                <button
                  key={transport.value}
                  type="button"
                  onClick={() => setSelectedTransport(transport.value)}
                  className={`px-6 py-3 rounded-xl outline outline-1 outline-offset-[-1px] flex-shrink-0 inline-flex justify-center items-center text-sm font-regular ${selectedTransport === transport.value ? 'bg-[#F78937] text-white outline-[#F78937]' : 'bg-white text-gray-600 outline-gray-300'}`}>
                  {transport.display}
                </button>
              ))}
            </div>
          </div>

          {dayPlans.length > 0 && (
            <div>
              <label className="text-black text-base font-medium leading-none">관광지 선택</label>
              <div className="flex flex-col gap-4 mt-2">
                {dayPlans.map((day) => (
                  <div key={day.dayIndex} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">{day.dayIndex}일차 ({dayjs(day.date).format('MM.DD ddd')})</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {day.spots.map((spot) => (
                        <div key={spot.contentId} className="flex items-center justify-between bg-orange-100 border border-[#F78937] rounded-full py-1 px-3 animate-fade-in">
                          <p className="font-medium text-sm text-gray-800 mr-2">{spot.spotName}</p>
                          <button onClick={() => handleRemovePlace(day.dayIndex, spot.contentId)}>
                            <CloseIcon className="w-4 h-4 text-gray-600 hover:text-black"/>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenAddPlaceModal(day.dayIndex)}
                      className="w-full flex items-center justify-center gap-2 text-[#F78937] border-2 border-dashed border-orange-300 rounded-lg py-2 hover:bg-orange-50 transition-colors"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      장소 추가
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-black text-base font-medium leading-none">
              계획방식 선택
            </label>
            <div className="flex flex-col gap-2 mt-2">
              <button
                type="button"
                className={`text-left h-12.5 px-4 py-2 rounded-xl text-sm border ${planType === 'ai' ? 'text-[#F78937] border-[#F78937] border-[1.5px] font-medium' : 'bg-[#FFFFFD] text-[#5D5D5D] border-[#D9D9D9]'}`}
                onClick={() => setPlanType('ai')}>
                ✨ AI가 추천하는 계획으로 시작할게요
              </button>
              <button
                type="button"
                className={`text-left h-12.5 px-4 py-2 rounded-xl text-sm border ${planType === 'manual' ? 'text-[#F78937] border-[#F78937] border-[1.5px] font-medium' : 'bg-[#FFFFFD] text-[#5D5D5D] border-[#D9D9D9]'}`}
                onClick={() => setPlanType('manual')}>
                ✏️ 제가 직접 계획할게요
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-[480px] mx-auto px-4 py-3 bg-white">
            <button className="w-full bg-[#F78938] text-white py-4 rounded-[10px] text-base font-semibold leading-snug disabled:bg-gray-300" 
              onClick={handleCreatePlan}
              disabled={!title || !dateRange.start || !selectedTransport || !planType}>
              계획 만들기
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
            <Calendar onSelect={handleDateSelect} />
          </div>
        </div>
      )}

      {isAddPlaceModalOpen && (
        <Modal
          title={`${currentDayIndex}일차에 장소 추가`}
          onClose={() => setIsAddPlaceModalOpen(false)}
        >
          <div className="flex flex-row gap-3">
            <button
              onClick={() => {
                navigate('/search-box', { state: { from: '/plan', dayIndex: currentDayIndex } });
                setIsAddPlaceModalOpen(false);
              }}
              className="flex-1 min-w-0 px-4 py-3 bg-[#F78938] text-white rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <SearchIcon className="10.5 h-10.5" />
              <span className="text-sm font-medium text-center truncate">새로운 장소 검색</span>
            </button>
            <button
              onClick={() => {
                navigate('/cart', { state: { from: 'plan', dayIndex: currentDayIndex } });
                setIsAddPlaceModalOpen(false);
              }}
              className="flex-1 min-w-0 px-4 py-3 bg-orange-100 text-[#F78938] rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <CartIcon/>
              <span className="text-sm font-medium text-center truncate">내가 담은 장소 추가</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PlanPage;