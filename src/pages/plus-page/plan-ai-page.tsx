import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import BackHeader from '../../components/common/Headers/BackHeader';
import DayTabs from '../../components/Plus/Plan/DayTabs';
import PlaceCard from '../../components/Plus/Plan/PlaceCard';
import EditPlanModal from '../../components/Plus/Plan/EditPlanModal';
import TimePicker from '../../components/Plus/Plan/TimeRangePicker';
import MemoEditorModal from '../../components/Plus/Plan/MemoModal';
import PlusCircleIcon from '../../assets/EASY.svg?react';
import { createPlan } from '../../apis/plan';


dayjs.locale('ko');

type AISpot = {
  arrivalDate: string;
  duringDate: string;
  contentId: number | null;
  title: string;
  memo: string;
};

type AIDay = {
  dayIndex: number;
  spots: AISpot[];
};

type AIPlanData = {
  title: string;
  transportType: 'WALK' | 'CAR' | 'BUS' | 'TAXI' | 'TRAIN' | 'BICYCLE';
  startDate: string;
  endDate: string;
  days: AIDay[];
};

const AIReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<AIPlanData | null>(null);
  const [activeTab, setActiveTab] = useState('전체');
  const [isSaving, setIsSaving] = useState(false);
  const [editingSpot, setEditingSpot] = useState<{ dayIndex: number; spot: AISpot; spotIndex: number } | null>(null);
  const [modal, setModal] = useState<'time' | 'memo' | null>(null);

  useEffect(() => {
    if (location.state?.aiPlanData) {
      setPlan(location.state.aiPlanData);
    } else {
      alert('잘못된 접근입니다.');
      navigate(-1);
    }
  }, [location.state, navigate]);

  const handleAddPlace = (dayIndex: number) => {
    navigate('/search-box', { 
      state: { 
        from: '/plan/ai-review', 
        dayIndex: dayIndex,
        mode: 'add',
        aiPlanData: plan 
      } 
    });
  };

  const handleReplacePlace = (dayIndex: number, spotIndex: number) => {
    navigate('/search-box', {
      state: {
        from: '/plan/ai-review',
        dayIndex: dayIndex,
        spotIndex: spotIndex,
        mode: 'replace',
        aiPlanData: plan
      }
    });
  };

  const handleDeleteSpot = (dayIndex: number, spotIndex: number) => {
    if (!plan) return;
    
    setPlan(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        days: prev.days.map(day => 
          day.dayIndex === dayIndex
            ? { ...day, spots: day.spots.filter((_, idx) => idx !== spotIndex) }
            : day
        )
      };
    });
    setEditingSpot(null);
  };

  const handleTimeUpdate = ({ startTime, endTime }: { startTime: string; endTime: string }) => {
    if (!editingSpot || !plan) return;
    const { dayIndex, spotIndex } = editingSpot;
    const datePart = dayjs(plan.startDate).add(dayIndex, 'day').format('YYYY-MM-DD');
    setPlan(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        days: prev.days.map(day =>
          day.dayIndex === dayIndex
            ? {
                ...day,
                spots: day.spots.map((spot, idx) =>
                  idx === spotIndex
                    ? {
                        ...spot,
                        arrivalDate: `${datePart}T${startTime}:00`,
                        duringDate: `${datePart}T${endTime}:00`,
                      }
                    : spot
                )
              }
            : day
        )
      };
    });
    setModal(null);
    setEditingSpot(null);
  };

  const handleMemoUpdate = (memo: string) => {
    if (!editingSpot || !plan) return;
    const { dayIndex, spotIndex } = editingSpot;
    setPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        days: prev.days.map(day =>
          day.dayIndex === dayIndex
            ? {
                ...day,
                spots: day.spots.map((spot, idx) =>
                  idx === spotIndex ? { ...spot, memo } : spot
                )
              }
            : day
        )
      };
    });
    
    setModal(null);
    setEditingSpot(null);
  };

  const handleSavePlan = async () => {
    if (!plan) return;
    setIsSaving(true);
    const formattedDays = plan.days.map(day => ({
      dayIndex: day.dayIndex + 1,
      spots: day.spots.map(spot => ({
        arrivalDate: spot.arrivalDate,
        duringDate: spot.duringDate,
        contentId: spot.contentId,
        title: spot.title,
        memo: spot.memo,
      })),
    }));

    try {
      const res = await createPlan({
        title: plan.title,
        transportType: plan.transportType,
        startDate: plan.startDate,
        endDate: plan.endDate,
        days: formattedDays,
      });
      alert('계획이 저장되었습니다.');
      navigate(`/plan/${res.result.planId}`, { replace: true });
    } catch (error) {
      console.error('Failed to save AI plan:', error);
      alert('계획 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const newSpot = location.state?.selectedSpot;
    const dayIndex = location.state?.dayIndex;
    const spotIndex = location.state?.spotIndex;
    const mode = location.state?.mode;

    if (newSpot && dayIndex !== undefined && mode) {
      navigate(location.pathname, { replace: true, state: { aiPlanData: plan } });
      if (mode === 'add') {
        const newAISpot: AISpot = {
          arrivalDate: `${dayjs(plan?.startDate).add(dayIndex, 'day').format('YYYY-MM-DD')}T09:00:00`,
          duringDate: `${dayjs(plan?.startDate).add(dayIndex, 'day').format('YYYY-MM-DD')}T10:00:00`,
          contentId: Number(newSpot.contentid),
          title: newSpot.title,
          memo: '',
        };

        setPlan(prev => {
          if (!prev) return null;
          return {
            ...prev,
            days: prev.days.map(day =>
              day.dayIndex === dayIndex
                ? { ...day, spots: [...day.spots, newAISpot] }
                : day
            )
          };
        });
      } else if (mode === 'replace' && spotIndex !== undefined) {
        const updatedSpot: AISpot = {
          arrivalDate: `${dayjs(plan?.startDate).add(dayIndex, 'day').format('YYYY-MM-DD')}T09:00:00`,
          duringDate: `${dayjs(plan?.startDate).add(dayIndex, 'day').format('YYYY-MM-DD')}T10:00:00`,
          contentId: Number(newSpot.contentid),
          title: newSpot.title,
          memo: '',
        };

        setPlan(prev => {
          if (!prev) return null;
          return {
            ...prev,
            days: prev.days.map(day =>
              day.dayIndex === dayIndex
                ? {
                    ...day,
                    spots: day.spots.map((spot, idx) =>
                      idx === spotIndex ? updatedSpot : spot
                    )
                  }
                : day
            )
          };
        });
      }
    }
  }, [location.state?.selectedSpot, location.state?.mode]);

  if (!plan) {
    return <div>계획을 불러오는 중...</div>;
  }

  const totalDays = dayjs(plan.endDate).diff(dayjs(plan.startDate), 'day') + 1;
  const tabs = ['전체', ...Array.from({ length: totalDays }, (_, i) => `${i + 1}일차`)];

  const getDayByIndex = (index: number) => 
    plan.days.find(d => d.dayIndex === index) || { dayIndex: index, spots: [] };

  const filteredDays = activeTab === '전체'
    ? plan.days
    : [getDayByIndex(Number(activeTab.replace('일차', '')) - 1)];

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen font-['Pretendard']">
      <div className="w-full max-w-[480px] bg-white pb-24">
        <BackHeader title="AI 추천 계획 보기" />
        <main className="px-4">
          <div className="mt-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{plan.title}</h2>
            <div className="mt-2 text-base font-medium text-gray-600">
              {dayjs(plan.startDate).format('YYYY.MM.DD (ddd)')} ~ {dayjs(plan.endDate).format('YYYY.MM.DD (ddd)')}
            </div>
          </div>
          
          <DayTabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

          <div>
            {filteredDays.map((day) => (
              <div key={day.dayIndex}>
                <div className="flex items-center my-4">
                  <h3 className="text-xl font-semibold mr-2">{day.dayIndex + 1}일차</h3>
                </div>
                {day.spots.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-[18px] top-5 h-[calc(100%-40px)] w-px border-l-2 border-dashed border-gray-300"></div>
                    {day.spots.map((spot, index) => (
                      <PlaceCard
                        key={`${spot.contentId}-${index}`}
                        place={{
                          name: spot.title,
                          memo: spot.memo,
                          time: `${dayjs(spot.arrivalDate).format('HH:mm')} - ${dayjs(spot.duringDate).format('HH:mm')}`,
                        }}
                        index={index}
                        isEditing={true}
                        onClick={() => setEditingSpot({ dayIndex: day.dayIndex, spot, spotIndex: index })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 ml-4 mb-4">일정이 없습니다.</div>
                )}

                <div className="flex justify-center items-center mt-2">
                  <div className="w-9 h-9 flex items-center justify-center mr-4">
                    <div className="w-4 h-4 bg-gray-300 rounded-full z-10"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddPlace(day.dayIndex)}
                    className="w-full flex items-center justify-center gap-2 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg py-3 hover:bg-gray-100 hover:text-orange-500 hover:border-orange-300 transition-colors"
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    장소 추가
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="max-w-[480px] mx-auto p-4 bg-white flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-1/3 bg-gray-200 text-gray-700 py-4 rounded-xl text-base font-semibold"
            >
              취소
            </button>
            <button
              onClick={handleSavePlan}
              disabled={isSaving}
              className="w-2/3 bg-[#F78937] text-white py-4 rounded-xl text-base font-semibold disabled:bg-gray-400"
            >
              {isSaving ? '저장 중...' : '이 계획으로 저장하기'}
            </button>
          </div>
        </div>
      </div>

      {editingSpot && (
        <EditPlanModal
          onClose={() => setEditingSpot(null)}
          onDelete={() => {
            if (window.confirm('이 장소를 삭제하시겠습니까?')) {
              handleDeleteSpot(editingSpot.dayIndex, editingSpot.spotIndex);
            }
          }}
          onEditPlace={() => handleReplacePlace(editingSpot.dayIndex, editingSpot.spotIndex)}
          onEditTime={() => setModal('time')}
          onEditMemo={() => setModal('memo')}
        />
      )}
      {modal && editingSpot && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-end bg-black/30 animate-fade-in"
          onClick={() => setModal(null)}
        >
          <div className="w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
            {modal === 'time' && (
              <TimePicker
                initialStartTime={editingSpot.spot.arrivalDate}
                initialEndTime={editingSpot.spot.duringDate}
                onSelect={handleTimeUpdate}
                onClose={() => setModal(null)}
              />
            )}
            {modal === 'memo' && (
              <MemoEditorModal 
                initialMemo={editingSpot.spot.memo} 
                onSave={handleMemoUpdate} 
                onClose={() => setModal(null)} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReviewPage;