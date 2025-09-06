import type { PlaceCardProps } from '../../types/cart';
import { useNavigate } from 'react-router-dom';
import WithIcon from '../../assets/with.svg?react';

const PlaceCard = ({
  cartId,
  firstImage,
  name,
  address,
  isEditMode,
  isSelected,
  onSelectToggle,
}: PlaceCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isEditMode) {
      onSelectToggle?.();
    } else {
      navigate(`/search-detail/${cartId}`);
    }
  };
  return (
    <div
      onClick={handleCardClick}
      className={`flex w-full h-[92px] items-center relative z-0 cursor-pointer font-[Pretendard] ${
        isEditMode && isSelected ? 'bg-orange-50' : 'bg-[#FFFFFD]'
      }`}
      style={{ borderBottom: '1px solid #F78938' }}
    >
      <div className="relative w-[108px] h-[80px] shrink-0 -translate-y-1">
        {firstImage ? (
          <img
            src={firstImage}
            alt="thumbnail"
            className="absolute inset-0 w-full h-full object-cover rounded-[12px]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-[12px]" />
        )}
      </div>

      <div className="flex flex-col flex-1 justify-center pl-3 gap-2 -translate-y-1">
        <div className="flex items-center gap-2 text-black font-medium text-[16px] leading-[18px] font-[Pretendard]">
          {name}
          <WithIcon className="w-4 h-4 text-[#F78938]" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[12px] leading-[14px] font-normal text-black">
            {address ?? ''}
          </div>
        </div>
      </div>
      {isEditMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelectToggle}
          onClick={(e) => e.stopPropagation()}
          className="ml-3 w-4 h-4 accent-[#F78938]"
        />
      )}
    </div>
  );
};

export default PlaceCard;
