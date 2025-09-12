import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import BackHeader from '../../components/common/Headers/BackHeader';
import DayTabs from '../../components/Plus/Plan/DayTabs';
import PlaceCard from '../../components/Plus/Plan/PlaceCard';
import EditPlanModal from '../../components/Plus/Plan/EditPlanModal';
import Calendar from '../../components/Plus/CalendarPannel';
import TimePicker from '../../components/Plus/Plan/TimeRangePicker';
import MemoEditorModal from '../../components/Plus/Plan/MemoModal';
import PlusCircleIcon from '../../assets/EASY.svg?react';

import { getPlanDetail, updatePlan, deletePlan } from '../../apis/plan';
import { usePlanStore } from '../../stores/plan-store';
import type { PlanDetailResponse } from '../../types/plan';
import type { TouristSpot } from '../../types/tourist';
import Modal from '../../components/common/Modal';

dayjs.locale('ko');

type DayDetail = PlanDetailResponse['result']['days'][0];
type SpotDetail = DayDetail['spots'][0];
type ModalButton = {
  text: string;
  onClick: () => void;
  variant?: 'gray' | 'orange';
};

const PlanDetailPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    plan,
    setPlan,
    setTitle,
    updateDateRange,
    updateSpot,
    addSpotToDay,
    updateSpotTime,
    updateSpotMemo,
    deleteSpot,
    resetPlan,
  } = usePlanStore();

  useEffect(() => {
    if (plan) {
      console.log('Plan updated in component:', plan.days.map(d => ({ dayIndex: d.dayIndex, spotCount: d.spots.length })));
    }
  }, [plan]);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('전체');
  const [editingSpot, setEditingSpot] = useState<{ dayIndex: number; spot: SpotDetail } | null>(null);
  const [modal, setModal] = useState<'calendar' | 'time' | 'memo' | null>(null);
  const [isPlanDeleteModalOpen, setIsPlanDeleteModalOpen] = useState(false);


  useEffect(() => {
    if (planId) getPlanDetail(Number(planId)).then((res) => setPlan(res.result));
    return () => resetPlan();
  }, [planId, setPlan, resetPlan]);

  useEffect(() => {
    const spotFromSearch = location.state?.selectedSpotForReplacement as TouristSpot | undefined;
    const locationIdToReplace = location.state?.locationIdToReplace as number | undefined;
    const targetDayIndex = location.state?.dayIndex as number | undefined;
    const mode = location.state?.mode as 'add' | 'replace' | undefined;

    if (!spotFromSearch || targetDayIndex === undefined || !mode || !isEditing || !plan) {
      return;
    }

    console.log('Processing spot from search:', { spotFromSearch, targetDayIndex, mode, locationIdToReplace });

    navigate(location.pathname, { replace: true, state: {} });

    const targetDate = dayjs(plan.startDate).add(targetDayIndex - 1, 'day').format('YYYY-MM-DD');
    
    const newLocationId = Date.now() + Math.random();

    const newSpotData: SpotDetail = {
      locationId: newLocationId,
      contentId: Number(spotFromSearch.contentid),
      spotTitle: spotFromSearch.title,
      spotAddress: spotFromSearch.addr1,
      spotImageUrl: spotFromSearch.firstimage || '',
      memo: '',
      arrivalDate: `${targetDate}T09:00:00`,
      duringDate: `${targetDate}T10:00:00`,
    };

    console.log('New spot data:', newSpotData);

    setTimeout(() => {
      if (mode === 'replace' && editingSpot && locationIdToReplace === editingSpot.spot.locationId) {
        console.log('Replacing spot');
        updateSpot(editingSpot.dayIndex, editingSpot.spot.locationId, newSpotData);
        setEditingSpot(null);
      } else if (mode === 'add') {
        console.log('Adding new spot to day', targetDayIndex);
        addSpotToDay(targetDayIndex, newSpotData);
      }
    }, 0);
  }, [location.state?.selectedSpotForReplacement, location.state?.mode, location.state?.dayIndex, isEditing, plan?.planId]);

  const handleSave = async () => {
    if (!plan || !planId) return;
    const payload = {
      title: plan.title,
      transportType: plan.transportType,
      startDate: dayjs(plan.startDate).format('YYYY-MM-DD') + 'T00:00:00',
      endDate: dayjs(plan.endDate).format('YYYY-MM-DD') + 'T23:59:59',
      days: plan.days.map((day: DayDetail) => ({
        dayIndex: day.dayIndex,
        spots: day.spots.map((spot: SpotDetail) => ({
          arrivalDate: spot.arrivalDate,
          duringDate: spot.duringDate,
          contentId: spot.contentId,
          memo: spot.memo,
          title: spot.spotTitle,
        })),
      })),
    };
    try {
      await updatePlan(Number(planId), payload);
      setIsEditing(false);
      alert('저장되었습니다.');
    } catch (error) {
      console.error('Save failed:', error);
      alert('저장에 실패했습니다.');
    }
  };
  const handlePlanDelete = () => {
    setIsPlanDeleteModalOpen(true);
  };

  const executePlanDelete = async () => {
    if (!planId) return;
    try {
      await deletePlan(Number(planId));
      alert('일정이 삭제되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('일정 삭제에 실패했습니다.');
    } finally {
      setIsPlanDeleteModalOpen(false);
    }
  };

  const handleCancel = () => {
    if (planId) getPlanDetail(Number(planId)).then((res) => setPlan(res.result));
    setIsEditing(false);
  };

  const handleTimeRangeSelect = ({ startTime, endTime }: { startTime: string; endTime: string }) => {
    if (editingSpot) {
      const { dayIndex, spot } = editingSpot;
      const datePart = dayjs(spot.arrivalDate).format('YYYY-MM-DD');
      
      const newArrivalDateTime = `${datePart}T${startTime}:00`;
      const newDuringDateTime = `${datePart}T${endTime}:00`;

      updateSpotTime(dayIndex, spot.locationId, {
        arrivalDate: newArrivalDateTime,
        duringDate: newDuringDateTime,
      });
    }
    setModal(null);
  };

  const handleMemoSave = (memo: string) => {
    if (editingSpot) updateSpotMemo(editingSpot.dayIndex, editingSpot.spot.locationId, memo);
    setModal(null);
  };

  if (!plan) return <div>로딩 중...</div>;

  const totalDays = dayjs(plan.endDate).diff(dayjs(plan.startDate), 'day') + 1;
  const tabs = ['전체', ...Array.from({ length: totalDays }, (_, i) => `${i + 1}일차`)];

  const getDayByIndex = (dayIndex: number) =>
    plan.days.find((day) => day.dayIndex === dayIndex) || { dayIndex, spots: [] };

  const filteredDays =
    activeTab === '전체'
      ? Array.from({ length: totalDays }, (_, i) => getDayByIndex(i + 1))
      : [getDayByIndex(Number(activeTab.replace('일차', '')))];
  const planDeleteButtons: ModalButton[] = [
    { text: '취소', onClick: () => setIsPlanDeleteModalOpen(false), variant: 'gray' },
    { text: '삭제', onClick: executePlanDelete, variant: 'orange' },
  ];
  return (
    <div className="flex justify-center bg-gray-50 min-h-screen font-['Pretendard']">
      <div className="w-full max-w-[480px] bg-white pb-24">
        <BackHeader title="일정 보기" rightContent={<button onClick={handlePlanDelete} className="px-5 py-2 bg-orange-100/70 rounded-[20px] inline-flex justify-center items-center justify-start text-[#F78937] text-sm font-medium leading-none">삭제</button>} />
        <main className="pt-12 px-4">
          <div className="mt-4 mb-4">
            <input
              className={`text-2xl font-bold border-none w-full bg-transparent focus:outline-none p-1 -m-1 rounded-md ${
                isEditing ? 'text-gray-800 border-b-2 border-gray-200 focus:border-orange-500' : 'text-gray-700'
              }`}
              value={plan.title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly={!isEditing}
            />
            <div
              onClick={() => isEditing && setModal('calendar')}
              className={`w-full max-w-[480px] mt-2 text-base font-medium text-gray-600 p-1 -m-1 rounded-md ${
                isEditing ? 'cursor-pointer hover:bg-gray-100' : ''
              }`}
            >
              {dayjs(plan.startDate).format('YYYY.MM.DD (ddd)')} ~ {dayjs(plan.endDate).format('YYYY.MM.DD (ddd)')}
            </div>
          </div>
          <DayTabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

          <div>
            {filteredDays.map((day, idx) => (
              <div key={idx}>
                <div className="flex items-center my-4">
                  <h3 className="text-xl font-semibold mr-2">{day.dayIndex}일차</h3>
                </div>
                {day.spots.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-[18px] top-5 h-[calc(100%-40px)] w-px border-l-2 border-dashed border-gray-300"></div>
                    {day.spots.map((spot, index) => (
                      <PlaceCard
                        key={spot.locationId}
                        place={{
                          name: spot.spotTitle,
                          memo: spot.memo,
                          time: `${dayjs(spot.arrivalDate).format('HH:mm')} - ${dayjs(spot.duringDate).format(
                            'HH:mm',
                          )}`,
                        }}
                        index={index}
                        isEditing={isEditing}
                        onClick={() => isEditing && setEditingSpot({ dayIndex: day.dayIndex, spot })}
                      />
                    ))}
                  </div>
                ) : (
                  !isEditing && <div className="text-gray-400 ml-4 mb-4">일정이 없습니다.</div>
                )}

                {isEditing && (
                  <div className="flex justify-center items-center mt-2">
                    <div className="w-9 h-9 flex items-center justify-center mr-4">
                      <div className="w-4 h-4 bg-gray-300 rounded-full z-10"></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Add button clicked for day:', day.dayIndex);
                        navigate('/search-box', {
                          state: { from: `/plan/${planId}`, dayIndex: day.dayIndex, mode: 'add' },
                        });
                      }}
                      className="w-full flex items-center justify-center gap-2 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg py-3 hover:bg-gray-100 hover:text-orange-500 hover:border-orange-300 transition-colors"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      장소 추가
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="max-w-[480px] mx-auto p-4 bg-white flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="w-1/3 bg-gray-200 text-gray-700 py-4 rounded-xl text-base font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="w-2/3 bg-[#F78937] text-white py-4 rounded-xl text-base font-semibold"
                >
                  저장하기
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-[#F78937] text-white py-4 rounded-xl text-base font-semibold"
              >
                일정 수정하기
              </button>
            )}
          </div>
        </div>
      </div>

      {editingSpot && (
        <EditPlanModal
          onClose={() => setEditingSpot(null)}
          onDelete={() => {
            if (window.confirm('이 장소를 삭제하시겠습니까?')) {
              deleteSpot(editingSpot.dayIndex, editingSpot.spot.locationId);
              setEditingSpot(null);
            }
          }}
          onEditPlace={() => {
            if (planId) {
              navigate('/search-box', {
                state: {
                  from: `/plan/${planId}`,
                  dayIndex: editingSpot.dayIndex,
                  locationIdToReplace: editingSpot.spot.locationId,
                  mode: 'replace',
                },
              });
            }
          }}
          onEditTime={() => setModal('time')}
          onEditMemo={() => setModal('memo')}
        />
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-end bg-black/30 animate-fade-in"
          onClick={() => {
            setModal(null);
            setEditingSpot(null);
          }}
        >
          <div className="w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
            {modal === 'calendar' && plan && (
              <Calendar
                onSelect={(start, end) => {
                  if (start && end) {
                    updateDateRange({
                      startDate: dayjs(start).format('YYYY-MM-DD'),
                      endDate: dayjs(end).format('YYYY-MM-DD'),
                    });
                  }
                  setModal(null);
                }}
              />
            )}
            {modal === 'time' && editingSpot && <TimePicker
              initialStartTime={editingSpot.spot.arrivalDate}
              initialEndTime={editingSpot.spot.duringDate}
              onSelect={handleTimeRangeSelect}
              onClose={() => setModal(null)}
            />}
            {modal === 'memo' && editingSpot && (
              <MemoEditorModal initialMemo={editingSpot.spot.memo} onSave={handleMemoSave} onClose={() => setModal(null)} />
            )}
          </div>
        </div>
      )}
      {isPlanDeleteModalOpen && (
        <Modal
          title="정말 이 일정을 삭제하시겠습니까?"
          onClose={() => setIsPlanDeleteModalOpen(false)}
          buttons={planDeleteButtons}
        >
          <p className="text-gray-600">
            삭제된 일정은 복구할 수 없습니다.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default PlanDetailPage;