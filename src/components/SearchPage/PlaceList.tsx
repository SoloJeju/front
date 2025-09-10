import PlaceCard from './PlaceCard';
import type { PlaceCardListProps } from '../../types/tourist';

const PlaceCardList = ({ spots, onCardClick }: PlaceCardListProps) => {
  return (
    <div className="flex flex-col">
      {spots.map((spot) => (
        <PlaceCard
          key={spot.contentid}
          contentid={spot.contentid}
          contenttypeid={spot.contenttypeid}
          onClick={onCardClick}
          imageUrl={spot.firstimage}
          title={spot.title}
          location={spot.addr1}
          tel={spot.tel}
          comment={spot.reviewTags}
          companionRoomCount={spot.companionRoomCount}
          difficulty={spot.difficulty}
        />
      ))}
    </div>
  );
};

export default PlaceCardList;