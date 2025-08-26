export type Place = {
  id: string | number; 
  imageUrl?: string;
  title: string;
  location: string;
  tel: string;
  comment: string;
};

export type PlaceCardProps = Place & {
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelectToggle?: () => void;
};