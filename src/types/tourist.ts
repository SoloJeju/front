import type { CommonResponse } from './common';

export type GetTouristSpotsParams = {
  page?: number;
  size?: number;
  sort?: 'A' | 'B' | 'C';
  contentTypeId?: 12 | 14 | 15 | 25 | 28 | 32 | 38 | 39;
  areaCode?: number;
  sigunguCode?: number;
  difficulty?: 'NONE' | 'EASY' | 'NORMAL' | 'HARD';
};

export type TouristSpot = {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  firstimage: string | null;
  mapx: string;
  mapy: string;
  hasCompanionRoom: boolean;
  companionRoomCount: number;
  difficulty: string;
  reviewTags: string | null;
  averageRating: number | null;
  tel?: string;
};

export type ResponseTouristListDto = CommonResponse<{
  list: TouristSpot[];
  spots: SearchTouristSpot[];
}>;

export type SearchTouristSpot = {
  contentId: number;
  contentTypeId: number;
  title: string;
  addr1: string | null;
  firstimage: string | null;
  difficulty: string;
  openCompanionRoomCount?: number;
  hasCompanionRoom: boolean;
  reviewTags?: string | null;
  tel?: string;
};

export type PlaceCardProps = {
  contentid: string;
  contenttypeid: string;
  imageUrl?: string | null;
  title: string;
  location: string;
  hasCompanionRoom?: boolean;
  difficulty?: string;
  onClick: (id: string) => void;
  tel?: string;
  comment?: string | null;
};

export type PlaceCardListProps = {
  spots: TouristSpot[];
  onCardClick: (id: string) => void;
};