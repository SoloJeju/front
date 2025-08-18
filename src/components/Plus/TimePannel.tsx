import { useState } from "react";
import ScrollPickerColumn from "./ScrollPickerColumn"; 

interface TimePickerProps {
  onSelect: (time: string) => void;
  onClose?: () => void;
}

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const ampm = ["오전", "오후"];

const TimePicker: React.FC<TimePickerProps> = ({ onSelect, onClose = () => {} }) => {
  const [selectedAmPm, setSelectedAmPm] = useState("오전");
  const [selectedHour, setSelectedHour] = useState(1);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const handleConfirm = () => {
    const formattedTime = `${selectedAmPm} ${String(selectedHour).padStart(
      2,
      "0"
    )}:${String(selectedMinute).padStart(2, "0")}`;
    onSelect(formattedTime);
  };

  const getStyle = (distance: number) => {
    if (distance === 0) {
      return "text-[#F78938] font-bold text-xl scale-110";
    } else if (distance === 1) {
      return "text-gray-600 text-lg opacity-80";
    } else if (distance === 2) {
      return "text-gray-400 text-base opacity-60";
    }
    return "text-gray-300 text-sm opacity-40";
  };

  return (
    <div className="bg-[#fffffd] p-4 rounded-t-[20px] shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.10)] w-full max-w-[480px] font-['Pretendard'] flex flex-col px-8 pt-8 pb-4">
      <div className="flex gap-16 justify-center items-center h-40 relative">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-gray-200/30 rounded-lg pointer-events-none"></div>
        <ScrollPickerColumn
          values={ampm}
          selectedValue={selectedAmPm}
          onSelect={setSelectedAmPm}
          getStyle={getStyle}
        />
        <ScrollPickerColumn
          values={hours}
          selectedValue={selectedHour}
          onSelect={setSelectedHour}
          getStyle={getStyle}
          isInfinite={true}
        />
        <ScrollPickerColumn
          values={minutes}
          selectedValue={selectedMinute}
          onSelect={setSelectedMinute}
          getStyle={getStyle}
          formatValue={(m) => String(m).padStart(2, "0")}
          isInfinite={true}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
        >
          취소
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 text-sm font-bold text-white bg-[#F78938] rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default TimePicker;