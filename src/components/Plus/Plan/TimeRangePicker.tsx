import { useState, useEffect } from "react";
import ScrollPickerColumn from "../ScrollPickerColumn";
import dayjs from 'dayjs';

interface ScrollableTimeRangePickerProps {
  initialStartTime: string;
  initialEndTime: string;
  onSelect: (times: { startTime: string; endTime: string }) => void;
  onClose: () => void;
}

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const ampmOptions = ["오전", "오후"];

const parseTime = (timeStr: string) => {
  const date = dayjs(`2000-01-01T${timeStr}`);
  let hour = date.hour();
  const minute = date.minute();
  const ampm = hour >= 12 ? "오후" : "오전";
  
  if (hour === 0) { 
    hour = 12;
  } else if (hour > 12) { 
    hour -= 12;
  }

  return { ampm, hour, minute };
};

const ScrollableTimeRangePicker = ({ initialStartTime, initialEndTime, onSelect, onClose }: ScrollableTimeRangePickerProps) => {
  const [step, setStep] = useState<'start' | 'end'>('start');
  const [confirmedStartTime, setConfirmedStartTime] = useState("00:00");
  const [selectedAmPm, setSelectedAmPm] = useState("오전");
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  useEffect(() => {
    const timeToParse = step === 'start' ? initialStartTime : initialEndTime;
    const { ampm, hour, minute } = parseTime(dayjs(timeToParse).format('HH:mm'));
    setSelectedAmPm(ampm);
    setSelectedHour(hour);
    setSelectedMinute(minute);
  }, [step, initialStartTime, initialEndTime]);

  const handleConfirm = () => {
    let hours24 = selectedHour;
    if (selectedAmPm === "오후" && hours24 < 12) hours24 += 12;
    if (selectedAmPm === "오전" && hours24 === 12) hours24 = 0; 
    const formattedTime = `${String(hours24).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`;

    if (step === 'start') {
      setConfirmedStartTime(formattedTime);
      setStep('end');
    } else {
      if (formattedTime <= confirmedStartTime) {
        alert("종료 시간은 도착 시간보다 늦어야 합니다.");
        return;
      }
      onSelect({ startTime: confirmedStartTime, endTime: formattedTime });
    }
  };

  const getStyle = (distance: number) => {
    if (distance === 0) return "text-[#F78938] font-bold text-xl scale-110";
    if (distance === 1) return "text-gray-600 text-lg opacity-80";
    if (distance === 2) return "text-gray-400 text-base opacity-60";
    return "text-gray-300 text-sm opacity-40";
  };
  
  const title = step === 'start' ? '도착 시간 선택' : '종료 시간 선택';
  const buttonText = step === 'start' ? '다음' : '확인';

  return (
    <div className="bg-[#fffffd] p-4 rounded-t-[20px] shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.10)] w-full max-w-[480px] font-['Pretendard'] flex flex-col px-8 pt-8 pb-4 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">{title}</h3>
      <div className="flex gap-16 justify-center items-center h-40 relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-gray-200/30 rounded-lg pointer-events-none"></div>
        <ScrollPickerColumn values={ampmOptions} selectedValue={selectedAmPm} onSelect={setSelectedAmPm} getStyle={getStyle} />
        <ScrollPickerColumn values={hours} selectedValue={selectedHour} onSelect={setSelectedHour} getStyle={getStyle} isInfinite={true} />
        <ScrollPickerColumn values={minutes} selectedValue={selectedMinute} onSelect={setSelectedMinute} getStyle={getStyle} formatValue={(m) => String(m).padStart(2, "0")} isInfinite={true} />
      </div>
      <div className="flex justify-end gap-3 pt-4 mt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">
          취소
        </button>
        <button onClick={handleConfirm} className="px-4 py-2 text-sm font-bold text-white bg-[#F78938] rounded-lg">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ScrollableTimeRangePicker;