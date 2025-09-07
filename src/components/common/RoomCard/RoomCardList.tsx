import RoomCard from './RoomCard';
import type { SpotChatRoom } from '../../../types/tourist';

// const mockRooms = [
//   {
//     id: 1,
//     isEnd: true,
//     title: '같이 가람돌솥밥 드실 분',
//     location: '가람돌솥밥',
//     date: '2025.07.01 16:30',
//     pre: 2,
//     all: 4,
//     imageUrl: ExampleImage,
//   },
//   {
//     id: 2,
//     isEnd: false,
//     title: '같이 가람돌솥밥 드실 분',
//     location: '가람돌솥밥',
//     date: '2025.07.01 16:30',
//     pre: 4,
//     all: 4,
//   },
//   {
//     id: 3,
//     isEnd: true,
//     title: '같이 가람돌솥밥 드실 분',
//     location: '가람돌솥밥',
//     date: '2025.07.01 16:30',
//     pre: 1,
//     all: 3,
//   },
// ];

interface RoomCardList {
  chatRooms: SpotChatRoom[];
}

const RoomCardList = ({ chatRooms }: RoomCardList) => {
  return (
    <div className="flex flex-col gap-2">
      {chatRooms.map((room, idx) => (
        <RoomCard
          key={idx}
          id={room.roomId}
          isEnd={room.isCompleted}
          title={room.title}
          location={room.spotName}
          date={room.scheduledDate}
          pre={room.currentParticipants}
          all={room.maxParticipants}
          imageUrl={room.spotImage}
          gender={room.genderRestriction}
          hasUnreadMessages={room.hasUnreadMessages}
        />
      ))}
    </div>
  );
};

export default RoomCardList;
