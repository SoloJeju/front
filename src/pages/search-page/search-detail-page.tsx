import { useState } from 'react';
import BackIcon from '../../assets/beforeArrow.svg?react';
import QuestionIcon from '../../assets/question.svg?react';
// import EASY from '../../../assets/L_EASY.svg?react';
import MapIcon from '../../assets/mapPin.svg?react';
import ClockIcon from '../../assets/clock.svg?react';
import WebIcon from '../../assets/web.svg?react';
import TelIcon from '../../assets/tel.svg?react';
import InfoIcon from '../../assets/info.svg?react';
import ExampleImage from '../../assets/exampleImage.png';
import RoomCardList from '../../components/common/RoomCard/RoomCardList';
import { useLocation } from 'react-router-dom';

export default function PlacePhotoScreen() {
  const location = useLocation();
  const selectTab = location.state?.selectTab;
  const [activeTab, setActiveTab] = useState(selectTab ? selectTab : '홈');

  const tabs = [
    { label: '홈' },
    { label: '사진' },
    { label: '리뷰' },
    { label: '동행방' },
  ];

  return (
    <div>
      {/* Top Bar */}
      <div className="flex px-4 py-3 justify-between items-center border-b border-neutral-200">
        <button className="p-1 -ml-1">
          <BackIcon className="w-6 h-6" />
        </button>
        <div className="text-[#262626] font-[Pretendard] text-[18px] font-semibold leading-[26px] tracking-[-0.45px]">
          가람돌솥밥
        </div>
        <div className="w-7" /> {/* 오른쪽 spacer */}
      </div>

      {/* Header Image */}
      <div className="relative w-full h-[240px] flex-shrink-0">
        <img
          src={ExampleImage}
          alt="place-hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <button className="absolute top-3 right-3 p-1 bg-black/40 rounded-full">
          <QuestionIcon className="w-6 h-6 text-white" />
        </button>

        {/* 타이틀 & 주소 */}
        <div className="absolute left-0 right-0 bottom-3 drop-shadow-sm flex flex-col gap-2 px-6 py-6">
          {/* 타이틀 + 음식점 */}
          <div className="flex items-center gap-2">
            <h1 className="text-white font-Pretendard text-[20px] font-semibold leading-[22px]">
              가람돌솥밥 돌솥이야 뭐하니 밥먹는
            </h1>
            <span className="text-[#F5F5F5] text-[12px] font-medium leading-[14px] tracking-[-0.24px]">
              음식점
            </span>
          </div>
          {/* 주소 */}
          <p className="text-white font-Pretendard text-[14px] font-medium leading-[16px] tracking-[-0.28px]">
            제주특별자치도 서귀포시 중문관광로 332
          </p>
        </div>
      </div>

      {/* Tabs */}
      <nav className="px-2">
        <div className="flex justify-around">
          {tabs.map((t) => (
            <div
              key={t.label}
              className="flex justify-center items-center w-[98.25px] h-[48px] cursor-pointer relative"
              onClick={() => setActiveTab(t.label)}
            >
              <span
                className={
                  activeTab === t.label
                    ? 'text-neutral-900 font-Pretendard text-[14px] font-medium leading-[16px] tracking-[-0.28px]'
                    : 'text-[#666] font-Pretendard text-[14px] font-medium leading-[16px] tracking-[-0.28px]'
                }
              >
                {t.label}
              </span>
              {activeTab === t.label && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-full bg-[#F78938] rounded-full" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === '홈' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4" />
              <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                제주특별자치도 서귀포시 중문관광로 332
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                  화요일~금요일 09:00~19:00
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex-shrink-0" />
                <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                  토요일~월요일 09:00~21:00
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WebIcon className="w-4 h-4" />
              <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                https://instagram.com/whisky_sehwa
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TelIcon className="w-4 h-4" />
              <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                064-738-1200
              </p>
            </div>
            <div className="flex items-center gap-2">
              <InfoIcon className="w-4 h-4" />
              <p className="text-[14px] font-normal leading-[16px] tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
                주차 가능
              </p>
            </div>
          </div>
        )}

        {activeTab === '사진' && (
          <div className="columns-2 gap-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const heights = ['h-40', 'h-48', 'h-60'];
              const heightClass =
                heights[Math.floor(Math.random() * heights.length)];

              return (
                <div
                  key={i}
                  className={`mb-2 rounded-lg overflow-hidden ${heightClass}`}
                >
                  <img
                    src={ExampleImage}
                    alt={`photo-${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        )}

        {activeTab === '리뷰' && (
          <div className="flex flex-col items-start w-[345px] h-[108px] flex-shrink-0">
            <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
              <span className="text-[#F78938]">가람돌솥밥</span> 다녀오셨다면,
            </h2>
            <h2 className="mt-[4px] font-[Pretendard] text-[18px] font-semibold leading-[20px] tracking-[-0.36px]">
              짧은 리뷰로 여행의 기억을 남겨보세요!
            </h2>
            <button className="mt-[16px] w-full h-[48px] flex justify-center items-center rounded-[10px] bg-[#F78938] text-white font-semibold">
              리뷰 쓰기
            </button>
          </div>
        )}

        {activeTab === '동행방' && (
          <div className="mt-1">
            <p className="mb-[12px] text-blasck font-[Pretendard] text-[18px] not-italic font-semibold leading-[20px] tracking-[-0.36px]">
              지금 열려있는 동행방
            </p>
            <RoomCardList />
          </div>
        )}
      </div>
    </div>
  );
}
