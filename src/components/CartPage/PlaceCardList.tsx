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
          key={place.cartId}
          {...place}
          isEditMode={isEditMode}
          isSelected={selectedItems.includes(place.cartId)}
          onSelectToggle={() => onSelectToggle(place.cartId)}
        />
      ))}
    </div>
  );
};

export default PlaceCardList;