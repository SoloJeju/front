import PlaceCard from "./PlaceCard";
import type { CartItem } from "../../types/cart";

type PlaceCardListProps = {
  places: CartItem[];
  isEditMode: boolean;
  selectedItems: number[];
  onSelectToggle: (id: number) => void;
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
          key={place.contentid}
          {...place}
          isEditMode={isEditMode}
          isSelected={selectedItems.includes(place.contentid)}
          onSelectToggle={() => onSelectToggle(place.contentid)}
        />
      ))}
    </div>
  );
};

export default PlaceCardList;