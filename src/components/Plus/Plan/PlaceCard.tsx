import React from 'react';
import ClockIcon from '../../../assets/clock.svg?react';
import MoreIcon from '../../../assets/more.svg?react';

interface Place {
  name: string;
  memo: string;
  time: string;
}

interface PlaceCardProps {
  place: Place;
  index: number;
  dayNumber: number;
  menuId: string;
  openMenuId: string | null;
   menuRef: React.RefObject<HTMLDivElement | null>;
  onMoreClick: () => void;
  onModify: (dayNum: number, placeName: string) => void;
  onDelete: (dayNum: number, placeName: string) => void;
}

const PlaceCard = ({
  place,
  index,
  dayNumber,
  menuId,
  openMenuId,
  menuRef,
  onMoreClick,
  onModify,
  onDelete,
}: PlaceCardProps) => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex flex-col items-center mr-4">
        <div className="w-9 h-9 flex items-center justify-center bg-[#F78937] text-white font-bold rounded-full z-10">
          {index + 1}
        </div>
      </div>
      <div className="w-full mt-1 border border-[#F78937] rounded-xl p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-base mb-1">{place.name}</p>
            <p className="text-sm text-[#F78937] mb-3">{place.memo}</p>
          </div>
          <div className="relative">
            <button type="button" onClick={onMoreClick}>
              <MoreIcon />
            </button>
            {openMenuId === menuId && (
              <div ref={menuRef} className="absolute top-full right-0 mt-2 z-20 w-max bg-white rounded-lg shadow-lg border border-gray-100">
                <button onClick={() => onModify(dayNumber, place.name)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">
                  수정하기
                </button>
                <button onClick={() => onDelete(dayNumber, place.name)} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 rounded-b-lg">
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon />
          <span className="text-sm text-gray-700">{place.time}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;