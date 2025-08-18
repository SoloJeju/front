import { useNavigate, useParams } from 'react-router-dom';
import Back from '/src/assets/beforeArrow.svg';
import ExImage from '/src/assets/exampleImage.png';
import Clock from '/src/assets/clock.svg';
import Location from '/src/assets/location.svg';
import People from '/src/assets/people.svg';

const mockData = [
  {
    id: 1,
    image: '/src/assets/exampleImage.png',
    title: '같이 가람돌솥밥 드실 분',
    location: '가람돌솥밥',
    time: '2025.07.01 16:30',
    currentPeople: 1,
    limitPeople: 4,
    content:
      '저랑 2025년 4월 31일 오후 1시에 서귀포시에서 가람돌솥밥까지 같이택시타실 분 구합니다. 인원은 많을 수록 n빵할거에요!',
  },
];

export default function RoomPage() {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };

  const handleJoinRoom = () => {
    navigate(`/chat-room/${roomId}`);
  };

  return (
    <div className="h-full p-5 bg-[#F78938]">
      <button type="button" onClick={handleNavigate}>
        <img src={Back} alt="뒤로가기" />
      </button>

      {mockData.map((data) => (
        <div
          key={data.id}
          className="flex flex-col justify-center items-center px-5 py-6 mt-9 bg-[#FFFFFD] rounded-[20px]"
        >
          <div className="w-full pb-4 border-b-2 border-[#FFCEAA]">
            <img
              src={data.image ? data.image : ExImage}
              alt=""
              className="w-full h-61 object-cover"
            />
            <h1 className="mt-5 mb-4 font-[pretendard] font-semibold text-2xl text-black">
              {data.title}
            </h1>
            <p className="flex gap-1 items-center">
              <img src={Location} alt="동행 위치" className="w-4.5 h-4.5" />
              <span className="font-[pretendard] font-normal text-[#666666]">
                {data.location}
              </span>
            </p>
            <p className="flex gap-1 items-center">
              <img src={Clock} alt="동행 시간" className="w-4.5 h-4.5" />
              <span className="font-[pretendard] font-normal text-[#666666]">
                {data.time}
              </span>
            </p>
            <p className="flex gap-1 items-center">
              <img src={People} alt="동행 인원수" className="w-4.5 h-4.5" />
              <span
                aria-label={`최대 ${data.limitPeople}명 현재 인원 ${data.currentPeople}명`}
                className="font-[pretendard] font-medium text-base text-[#F78938]"
              >
                {data.currentPeople}명/{data.limitPeople}명
              </span>
            </p>
          </div>

          <p className="py-5 break-keep border-b-2 border-[#FFCEAA] font-[pretendard] font-normal text-sm text-[#262626]">
            {data.content}
          </p>

          <button
            type="button"
            className="pt-4 font-[pretendard] font-semibold text-base text-[#F78938] cursor-pointer disabled:cursor-not-allowed"
            disabled={data.currentPeople === data.limitPeople}
            onClick={handleJoinRoom}
          >
            동행방 입장하기
          </button>
        </div>
      ))}
    </div>
  );
}
