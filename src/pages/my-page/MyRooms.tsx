import BackHeader from '../../components/common/Headers/BackHeader';
import RoomCard from '../../components/common/RoomCard/RoomCard';
import ExampleImage from '../../assets/exampleImage.png';
import PostNone from '/src/assets/post-none.svg';

const mockRooms = [
  {
    id: 1,
    isEnd: true,
    title: '같이 가람돌솥밥 드실 분',
    location: '가람돌솥밥',
    date: '2025.07.01 16:30',
    pre: 2,
    all: 4,
    imageUrl: ExampleImage,
  },
  {
    id: 2,
    isEnd: false,
    title: '같이 가람돌솥밥 드실 분',
    location: '가람돌솥밥',
    date: '2025.07.01 16:30',
    pre: 4,
    all: 4,
  },
  {
    id: 3,
    isEnd: true,
    title: '같이 가람돌솥밥 드실 분',
    location: '가람돌솥밥',
    date: '2025.07.01 16:30',
    pre: 1,
    all: 3,
  },
];

export default function MyRooms() {
  return (
    <div className="font-Pretendard bg-[#FFFFFD] min-h-screen flex justify-center">
      <div className="w-full max-w-[480px]">
        {/* 헤더 */}
        <BackHeader title="동행방 리스트" />

        {/* 콘텐츠 */}
        <div className="p-4">
          {mockRooms.length === 0 ? (
            <div className="pt-40 text-center text-gray-500 flex flex-col items-center">
              <img
                src={PostNone}
                alt="동행방 없음"
                className="w-[170px] h-[102px] mb-4"
              />
              <p className="text-lg">참여중인 동행방이 없어요.</p>
              <p className="mt-2 text-sm">새로운 동행방을 찾아보세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {mockRooms.map((room) => (
                <RoomCard key={room.id} {...room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
