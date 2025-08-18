import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import BackHeader from '../../components/common/Headers/BackHeader';
import DayTabs from '../../components/Plus/Plan/DayTabs'; 
import PlaceCard from '../../components/Plus/Plan/PlaceCard'; 

const mockData = {
  title: "제주도좋다",
  dateRange: "2025.01.01 ~ 2025.01.03",
  days: [
    {
      dayNumber: 1,
      date: "01.01 (월)",
      places: [
        { name: "김포공항", memo: "늦지말기!!", time: "09:00 - 11:00" },
        { name: "분위기 좋은 카페", memo: "카페 인증샷 꼭 찍기!!", time: "09:00 - 11:00" },
        { name: "가람돌솥밥", memo: "점심은 든든하게", time: "09:00 - 11:00" },
      ]
    },
    {
      dayNumber: 2,
      date: "01.02 (화)",
      places: [
        { name: "성산일출봉", memo: "아침 일찍 출발하기", time: "07:00 - 09:00" },
        { name: "우도", memo: "자전거 대여해서 한바퀴", time: "10:00 - 15:00" },
      ]
    },
  ]
};

const PlanDetailPage = () => {
  const { planId } = useParams();
  const [activeTab, setActiveTab] = useState('전체');
  const [title, setTitle] = useState(mockData.title);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("현재 보고 있는 플랜 ID:", planId);
  }, [planId]);

  const tabs = ['전체', ...mockData.days.map(day => `${day.dayNumber}일차`)];
  const filteredDays = mockData.days.filter(day => {
    if (activeTab === '전체') return true;
    return `${day.dayNumber}일차` === activeTab;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const handleModify = (dayNum: number, placeName: string) => {
    console.log(`${dayNum}일차 '${placeName}' 수정`);
    setOpenMenuId(null);
  };

  const handleDelete = (dayNum: number, placeName: string) => {
    console.log(`${dayNum}일차 '${placeName}' 삭제`);
    setOpenMenuId(null);
  };

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen font-['Pretendard']">
      <div className="w-full max-w-[480px] bg-white pb-24">
        <BackHeader title="일정 보기"
          // rightContent={
          //   <button className="bg-[#FEF5EA] text-[#F78937] text-sm font-medium px-4 py-2 rounded-lg">
          //     장소 추가
          //   </button>}
        />
        <main className="px-4">
          <div className="mt-4 mb-4">
            <input
              className="text-xl font-semibold text-gray-700 border-none placeholder-gray-300 focus:outline-none w-full"
              value={title}
              placeholder='제목'
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="mt-2 text-base font-medium text-gray-600">{mockData.dateRange}</p>
          </div>
          
          <DayTabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

          <div>
            {filteredDays.map(day => (
              <div key={day.dayNumber}>
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-semibold mr-2">{day.dayNumber}일차</h3>
                  <span className="text-gray-500">{day.date}</span>
                </div>
                <div className="relative">
                  <div className="absolute left-[18px] top-5 h-[calc(100%-40px)] w-px border-l-2 border-dashed border-gray-300"></div>
                  {day.places.map((place, index) => {
                    const menuId = `${day.dayNumber}-${index}`;
                    return (
                      <PlaceCard
                        key={index}
                        place={place}
                        index={index}
                        dayNumber={day.dayNumber}
                        menuId={menuId}
                        openMenuId={openMenuId}
                        menuRef={menuRef}
                        onMoreClick={() => setOpenMenuId(openMenuId === menuId ? null : menuId)}
                        onModify={handleModify}
                        onDelete={handleDelete}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <div className="max-w-[480px] mx-auto p-4 bg-white">
            <button className="w-full bg-[#F78937] text-white py-4 rounded-xl text-base font-semibold">
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;