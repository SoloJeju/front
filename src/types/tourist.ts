import type { CommonCursorResponse, CommonResponse } from './common';

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
  reviewTags?: string | null;
  tel?: string;
};

export type PlaceCardProps = {
  contentid: string;
  contenttypeid: string;
  imageUrl?: string | null;
  title: string;
  location: string;
  companionRoomCount:number;
  openCompanionRoomCount?:number;
  difficulty?: string;
  onClick: (id: string, typeId: string) => void;
  tel?: string;
  comment?: string | null;
};

export type PlaceCardListProps = {
  spots: TouristSpot[];
  onCardClick: (id: string, typeId: string) => void;
};

// 관광지 상세 정보
export type BasicSpotDetail = {
  contentid: string;
  contenttypeid: string;
  title: string;
  overview: string;
  tel: string;
  homepage: string;
  addr2: string;
  addr1: string;
  firstimage: string;
  firstimage2: string;
};

export type IntroSoptDetail = {
  treatmenu: string;
  infocenterfood: string;
  firstmenu: string;
  contentid: string;
  kidsfacility: string;
  opentimefood: string;
  restdatefood: string;
  parkingfood: string;
  contenttypeid: string;
  lcnsno: string;
};

export type ResponseSpotDetailDto = CommonResponse<{
  basic: BasicSpotDetail;
  intro: IntroSoptDetail;
  info: [];
  reviewTags: string[];
  difficulty: string;
  hasCompanionRoom: boolean;
}>;

// 관광지 동행방 리스트
export type SpotChatRoom = {
  roomId: number;
  title: string;
  description: string;
  isCompleted: boolean;
  spotName: string;
  spotImage: string;
  currentParticipants: number;
  maxParticipants: number;
  scheduledDate: string;
  genderRestriction: string;
  hasUnreadMessages: boolean;
};

export type ResponseSpotChatRoomDto = CommonResponse<SpotChatRoom[]>;

// 관광지 리뷰 리스트
export type SpotAgg = {
  spotId: number;
  totalReviews: number;
  easyPct: number;
  mediumPct: number;
  hardPct: number;
  averageRating: number;
  topTags: {
    tagCode: number;
    label: string;
    count: number;
    pct: number;
  }[];
};

export type SpotReview = {
  reviewId: number;
  userId: number;
  userNickname: string;
  userProfileImageUrl: string;
  thumbnailUrl: string;
  imageUrls: string[];
  text: string;
  difficulty: string;
  rating: number;
  createdAt: Date;
};

export type ResponseSpotReviewDto = CommonCursorResponse<{
  spotAgg: SpotAgg;
  reviews: SpotReview[];
}>;

// 관광지 사진 리스트
export type SpotImages = {
  imageUrl: string;
  imageName: string;
  imageType: string;
  reviewId: number;
};

export type ResponseSpotImagesDto = CommonResponse<{
  images: SpotImages[];
  hasNext: boolean;
  nextCursor: string;
  totalCount: number;
}>;
