import PlaceCard from "./PlaceCard";
import type { Place } from "../../types/place";


type PlaceCardListProps = {
  places: Place[];
  isEditMode: boolean;
  selectedItems: (string | number)[];
  onSelectToggle: (id: string | number) => void;
};

const PlaceCardList = ({
  places,
  isEditMode,
  selectedItems,
  onSelectToggle,
}: PlaceCardListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          {...place}
          isEditMode={isEditMode}
          isSelected={selectedItems.includes(place.id)}
          onSelectToggle={() => onSelectToggle(place.id)}
        />
      ))}
    </div>
  );
};

export default PlaceCardList;