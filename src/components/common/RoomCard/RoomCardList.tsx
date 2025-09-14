import RoomCard from './RoomCard';
import type { SpotChatRoom } from '../../../types/tourist';

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
