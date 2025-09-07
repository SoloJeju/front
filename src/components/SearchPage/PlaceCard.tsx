import WithIcon from '../../assets/with.svg?react';
import { CONTENT_TYPES } from '../../constants/contentTypes.ts';
import type { PlaceCardProps } from '../../types/tourist';

const PlaceCard = ({
  contentid,
  contenttypeid,
  imageUrl,
  title,
  location,
  hasCompanionRoom,
  tel,
  comment,
  difficulty,
  onClick,
}: PlaceCardProps) => {
  const contentTypeInfo = CONTENT_TYPES.find(
    (type) => type.id === parseInt(contenttypeid, 10)
  );
  const IconComponent = contentTypeInfo?.icon;

  return (
    <div
      className="flex w-full h-[92px] bg-[var(--white-2,#FFFFFD)] items-center px-4 font-[Pretendard] cursor-pointer"
      style={{ borderBottom: '1px solid #F78938' }}
      onClick={() => onClick(contentid, contenttypeid)}
    >
      <div className="relative w-[108px] h-[80px] shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover rounded-[12px]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-[12px]" />
        )}
      </div>

      <div className="flex flex-col flex-1 justify-center pl-3 gap-2">
        <div className="flex items-center gap-1">
          <h2 className="text-black font-medium text-[16px] leading-[18px]">
            {title}
          </h2>
          {IconComponent && <IconComponent className="w-4 h-4" />}
          {hasCompanionRoom && <WithIcon className="w-4 h-4 text-[#F78938]" />}
          {difficulty && (
            <span
              className={`px-1 py-0.5 font-bold text-[10px] rounded-sm ${
                difficulty === 'EASY'
                  ? 'text-[#006259] bg-[#C8F5DA]'
                  : difficulty === 'NORMAL'
                    ? 'text-[#FFC32A] bg-[#FFEE8C]'
                    : difficulty === 'HARD'
                      ? 'text-[#FF3E3E] bg-[#FFBBBB]'
                      : 'text-[#707070] bg-[#C2C6C4]'
              }`}
            >
              {difficulty}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[12px] leading-[14px] font-normal font-[Pretendard] text-black">
            {location}
          </div>
          <div className="text-[10px] leading-[12px] font-normal font-[Pretendard] text-[#5D5D5D]">
            {tel}
          </div>
          <div className="text-[12px] leading-[14px] font-normal font-[Pretendard] text-black">
            {comment}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
