  import WithIcon from '../../../assets/with.svg?react';
  import Map from '../../../assets/mapPin.svg?react';
  import Clock from '../../../assets/clock.svg?react';

  type RoomCardProps = {
    isEnd: boolean; // true: 모집완료, false: 모집중
    title: string;
    location: string;
    date: string;
    pre: number;
    all: number;
    imageUrl?: string; 
  };

  const RoomCard = ({ isEnd, title, location, date, pre, all, imageUrl }: RoomCardProps) => {
    return (
      <div className="flex w-full h-32 rounded-xl shadow-[0px_0px_2px_0px_rgba(247,137,56,1.00)] border border-[#F78938] overflow-hidden">
        <div className="flex flex-col justify-between p-4 w-2/3">
          <div className="flex flex-col gap-1">
            <div className={`text-xs font-medium font-['Pretendard'] leading-3 ${isEnd ? 'text-[#666666]' : 'text-[#F78938]'}`}>
              {isEnd ? '모집완료' : '모집중'}
            </div>
            <div className="text-black text-base font-semibold font-['Pretendard'] leading-tight tracking-tight">{title}</div>
          </div>
          <div className="flex flex-col gap-1 text-[#666666] text-xs font-normal font-['Pretendard']">
            <div className="inline-flex items-center gap-1">
              <Map />
              {location}
            </div>
            <div className="inline-flex items-center gap-1">
              <Clock />
              {date}
            </div>
          </div>
        </div>

        <div className="relative w-1/3 flex items-end justify-end p-2">
          <div className={`absolute top-4 right-4 z-10 flex items-center gap-1 rounded ${!imageUrl ? 'text-[#F78938]' : 'text-white'}`}>
            <WithIcon className="w-3.5 h-3.5" />
            <div className="text-xs font-medium font-['Pretendard']">
              {pre}명/{all}명
            </div>
          </div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#FFFFFD]" />
          )}
          
        </div>
      </div>
    );
  };

  export default RoomCard;
