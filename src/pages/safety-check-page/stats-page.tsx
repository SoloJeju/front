import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlarmHeader from '../../components/common/Headers/AlarmHeader';
import { loadSafetyStats } from '../../utils/safetyCheckData';

const StatsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<{
    completionRate: number;
    streak: number;
    monthlyData: { [key: string]: { [key: string]: number } };
  }>({
    completionRate: 0,
    streak: 0,
    monthlyData: {},
  });

  useEffect(() => {
    const savedStats = loadSafetyStats();
    setStats(savedStats);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const renderCalendar = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

    const calendar = [];
    const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const monthData = stats.monthlyData[currentMonthKey] || {};

    // 요일 헤더
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const headerRow = (
      <div key="header" className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-gray-500 font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>
    );
    calendar.push(headerRow);

    // 날짜들
    let dayCount = 1;
    const weeks = Math.ceil((firstDayOfMonth + daysInMonth) / 7);

    for (let week = 0; week < weeks; week++) {
      const weekDays = [];

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (
          (week === 0 && dayOfWeek < firstDayOfMonth) ||
          dayCount > daysInMonth
        ) {
          weekDays.push(
            <div
              key={`empty-${week}-${dayOfWeek}`}
              className="h-6 sm:h-8"
            ></div>
          );
        } else {
          const dateKey = `${String(dayCount).padStart(2, '0')}`;
          const completionRate = monthData[dateKey] || 0;
          const isToday = dayCount === now.getDate();

          let bgColor = 'bg-gray-100 text-gray-400';
          if (isToday) {
            bgColor =
              'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-md';
          } else if (completionRate > 0) {
            if (completionRate >= 80) {
              bgColor =
                'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm';
            } else if (completionRate >= 60) {
              bgColor =
                'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm';
            } else if (completionRate >= 40) {
              bgColor =
                'bg-gradient-to-r from-green-300 to-emerald-400 text-white';
            } else {
              bgColor =
                'bg-gradient-to-r from-green-200 to-emerald-300 text-gray-700';
            }
          }

          weekDays.push(
            <div
              key={dateKey}
              className={`h-6 sm:h-8 flex items-center justify-center text-xs rounded-lg transition-all duration-200 ${bgColor}`}
            >
              {dayCount}
            </div>
          );
          dayCount++;
        }
      }

      calendar.push(
        <div key={`week-${week}`} className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {weekDays}
        </div>
      );
    }

    return calendar;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 font-[Pretendard]">
      <AlarmHeader title="안전 점검 통계" showBackButton={true} />

      <div className="pt-16 px-4 pb-20">
        {/* 완료율 카드 */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">📊</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                오늘의 안전 점검 완료율
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 break-words">
                안전한 여행을 위한 노력이에요!
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent mb-2">
              {stats.completionRate}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 월별 캘린더 */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">📅</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                이번 달 기록
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 break-words">
                매일의 안전 점검 기록을 확인해보세요
              </p>
            </div>
          </div>
          <div className="space-y-1">{renderCalendar()}</div>
          <div className="mt-6 grid grid-cols-1 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded flex-shrink-0"></div>
              <span className="break-words">점검 완료 (80% 이상)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded flex-shrink-0"></div>
              <span className="break-words">점검 완료 (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-300 to-emerald-400 rounded flex-shrink-0"></div>
              <span className="break-words">점검 완료 (40-59%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded flex-shrink-0"></div>
              <span className="break-words">오늘</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded flex-shrink-0"></div>
              <span className="break-words">미완료</span>
            </div>
          </div>
        </div>

        {/* 팁 카드 */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">💡</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-orange-900 break-words">
                안전 팁
              </h2>
              <p className="text-xs sm:text-sm text-orange-700 break-words">
                더 안전한 여행을 위한 조언
              </p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-orange-800 space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-orange-600 font-bold flex-shrink-0 mt-0.5">
                •
              </span>
              <p className="break-words">
                매일 안전 점검을 통해 여행 중 안전을 확보하세요
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-600 font-bold flex-shrink-0 mt-0.5">
                •
              </span>
              <p className="break-words">
                연속 기록을 유지하면 더욱 안전한 여행이 됩니다
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-600 font-bold flex-shrink-0 mt-0.5">
                •
              </span>
              <p className="break-words">
                긴급 상황 시 미리 저장해둔 연락처를 활용하세요
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-600 font-bold flex-shrink-0 mt-0.5">
                •
              </span>
              <p className="break-words">
                현지 문화와 관습을 미리 알아보고 준비하세요
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/safety-check')}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span>🛡️</span>
            <span className="whitespace-nowrap">오늘의 안전 점검하기</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            <span className="whitespace-nowrap">홈으로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
