// import Food from '../../../assets/foodtype.svg?react';
//import EASY from '../../../assets/L_EASY.svg?react';
// import NORMAL from '../../../assets/L_NORMAL.svg?react';
// import HARD from '../../../assets/L_HARD.svg?react';
// import Food from '../../../assets/foodtype.svg?react';
// import EASY from '../../../assets/L_EASY.svg?react';
// import NORMAL from '../../../assets/L_NORMAL.svg?react';
// import HARD from '../../../assets/L_HARD.svg?react';
import WithIcon from '../../assets/with.svg?react';

type PlaceCardProps = {
  imageUrl?: string;
  title: string;
  location: string;
  tel: string;
  comment: string;
};

const PlaceCard = ({ imageUrl, title, location, tel, comment }: PlaceCardProps) => {
  return (
    <div
      className="flex w-full h-[92px] bg-[var(--white-2,#FFFFFD)] items-center px-6 relative z-0"
      style={{ borderBottom: '1px solid var(--PrimaryColor-2,#FFCEAA)' }}>
      <div className="relative w-[108px] h-[80px] shrink-0 -translate-y-1">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="thumbnail"
            className="absolute inset-0 w-full h-full object-cover rounded-[12px]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[var(--white-2,#FFFFFD)] rounded-[12px]" />
        )}
      </div>

      <div className="flex flex-col flex-1 justify-center pl-3 gap-2 -translate-y-1">
        <div className="flex items-center gap-2 text-black font-medium text-[16px] leading-[18px] font-[Pretendard]">
          {title}
          <WithIcon className="w-4 h-4 text-[#F78938]" />
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