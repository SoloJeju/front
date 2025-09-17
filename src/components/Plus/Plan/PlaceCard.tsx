import ClockIcon from '../../../assets/clock.svg?react';
import { useNavigate } from 'react-router-dom';

interface Place {
  name: string;
  memo: string;
  time: string;
  contentId?: number;
  contenttypeId?: number;
}

interface PlaceCardProps {
  place: Place;
  index: number;
  isEditing: boolean;
  onClick: () => void;
}

const PlaceCard = ({ place, index, isEditing, onClick }: PlaceCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={`flex items-start mb-4 ${isEditing ? 'cursor-pointer' : ''}`}
      onClick={isEditing ? onClick : () => navigate(`/search-detail/${place.contentId}`, { state: { contentTypeId: place.contenttypeId } })} >
      <div className="flex flex-col items-center mr-4">
        <div className="w-9 h-9 flex items-center justify-center bg-[#F78937] text-white font-bold rounded-full z-10">
          {index + 1}
        </div>
      </div>
      <div
        className={`w-full mt-1 border border-[#F78937] rounded-xl p-4 transition-colors ${
          isEditing ? 'hover:bg-orange-50' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-base mb-1">{place.name}</p>
            <p className="text-sm text-gray-500 mb-3">{place.memo || '메모가 없습니다.'}</p>
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