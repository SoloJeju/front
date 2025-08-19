import { useState } from "react";
import dayjs from "dayjs";
import Back from '/src/assets/beforeArrow.svg?react';

interface CalendarProps {
  onSelect: (start: string, end: string | null) => void;
  mode?: "range" | "single";
}

const Calendar = ({ onSelect, mode = "range" }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDateClick = (date: string) => {
    if (mode === "single") {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(null);
      } else if (dayjs(date).isBefore(startDate)) {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleConfirm = () => {
    if (mode === "single") {
      if (startDate) onSelect(startDate, null);
    } else {
      if (startDate && endDate) onSelect(startDate, endDate);
    }
  };

  const generateCalendar = () => {
    const startOfMonth = currentMonth.startOf("month").startOf("week");
    const endOfMonth = currentMonth.endOf("month").endOf("week");
    const days = [];
    let date = startOfMonth;
    while (date.isBefore(endOfMonth) || date.isSame(endOfMonth)) {
      days.push(date);
      date = date.add(1, "day");
    }
    return days;
  };

  const isInRange = (date: dayjs.Dayjs) => {
    if (mode === "single" || !startDate || !endDate) return false;
    return dayjs(date).isAfter(dayjs(startDate)) && dayjs(date).isBefore(dayjs(endDate));
  };

  const isSelected = (date: dayjs.Dayjs) => {
    return (
      (startDate && dayjs(date).isSame(startDate)) ||
      (endDate && dayjs(date).isSame(endDate))
    );
  };

  const calendarDays = generateCalendar();

  return (
    <div className="bg-[#fffffd] p-4 rounded-t-[20px] shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.10)] w-full max-w-[480px] font-['Pretendard']">
      <div className="flex justify-between items-center mb-6 pt-4">
        <button onClick={() => setCurrentMonth(prev => prev.subtract(1, "month"))}><Back/></button>
        <span className="font-semibold text-lg">{currentMonth.format("YYYY.MM")}</span>
        <button onClick={() => setCurrentMonth(prev => prev.add(1, "month"))}> <Back className="rotate-180" /></button>
      </div>

      <div className="grid grid-cols-7 w-full text-center text-xs text-[#B4B4B4] font-normal mb-1 leading-3">
        {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d,i)=>(
          <div key={i} className="flex justify-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 w-full gap-y-1 text-center text-sm">
        {calendarDays.map((day, i) => {
          const formatted = day.format("YYYY-MM-DD");
          const isCurrentMonth = day.month() === currentMonth.month();
          const selected = isSelected(day);
          const inRange = isInRange(day);

          return (
            <div key={i} className="relative flex justify-center items-center h-9">
              {mode === "range" && startDate && endDate && inRange && (
                <div className="absolute inset-0 bg-[#fcd6b0] z-0" />
              )}
              {mode === "range" && startDate && endDate && day.isSame(startDate, "day") && (
                <div className="absolute inset-y-0 left-1/2 w-1/2 bg-[#fcd6b0] z-0" />
              )}
              {mode === "range" && startDate && endDate && day.isSame(endDate, "day") && (
                <div className="absolute inset-y-0 right-1/2 w-1/2 bg-[#fcd6b0] z-0" />
              )}
              <div className={`relative z-10 w-9 h-9 flex items-center justify-center text-sm font-medium leading-none
                ${!isCurrentMonth ? "text-gray-300" : ""}
                ${selected ? "bg-[#F78938] text-white font-bold rounded-full" : ""}`}
                onClick={() => handleDateClick(formatted)}>
               {day.date()}</div>
            </div>);
        })}
      </div>

      <div className="flex justify-end gap-3 pt-4 mt-2">
        <button onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">초기화</button>
        <button onClick={handleConfirm}
          disabled={mode === "range" ? !startDate || !endDate : !startDate}
          className="px-4 py-2 text-sm font-bold text-white bg-[#F78938] rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed">확인</button>
      </div>
    </div>
  );
};

export default Calendar;
