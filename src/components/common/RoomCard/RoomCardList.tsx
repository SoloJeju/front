import RoomCard from './RoomCard';
import ExampleImage from '../../../assets/exampleImage.png';

const mockRooms = [
  {
    isEnd: true,
    title: '같이 가람돌솥밥 드실 분',
    location: '가람돌솥밥',
    date: '2025.07.01 16:30',
    pre: 2,
    all: 4,
    imageUrl:ExampleImage,
  },
  {
    isEnd: false,
    title: '같이 가람돌솥밥 드실 분',
    location: '가람돌솥밥',
    date: '2025.07.01 16:30',
    pre: 4,
    all: 4,
  },
  {
    isEnd: true,
    title: '같이 가람돌솥밥 드실 분',
    location: '가람돌솥밥',
    date: '2025.07.01 16:30',
    pre: 1,
    all: 3,
  },
];

const RoomCardList = () => {
  return (
    <div className="flex flex-col gap-2">
      {mockRooms.map((room, idx) => (
        <RoomCard key={idx} {...room} />
      ))}
    </div>
  );
};

export default RoomCardList;
