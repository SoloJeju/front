import type { CommonResponse } from './common';

// 오늘의 추천 장소 Top3
export type TodayRecommendedSpots = {
  contentId: number;
  title: string;
  firstImage: string;
  difficulty: string;
};

export type ResponseTodayRecommendedSpotsDto = CommonResponse<
  TodayRecommendedSpots[]
>;

// 최신 혼행 후기
export type LatestReviews = {
  reviewId: number;
  contentId: number;
  spotName: string;
  spotImage: string;
  content: string | null;
};

export type ResponseLatestReviewsDto = CommonResponse<LatestReviews[]>;

// 지금 열려있는 동행방
export type RecommendedChatRooms = {
  roomId: number;
  title: string;
  description: string;
  spotContentId: number;
  spotName: string;
  spotImage: string;
  currentParticipants: number;
  maxParticipants: number;
  scheduledDate: Date;
  hostNickname: string;
  genderRestriction: string | null;
};

export type ResponseRecommendedChatRoomsDto = CommonResponse<
  RecommendedChatRooms[]
>;

// export type ResponseHomeListDto = CommonResponse<{
//   todayRecommendedSpots: TodayRecommendedSpots[];
//   latestReviews: LatestReviews[];
//   recommendedChatRooms: RecommendedChatRooms[];
// }>;

// 마이페이지 동행방 목록
export type MyChatRoom = {
  chatRoomId: number;
  title: string;
  description: string;
  joinDate: string;
  currentMembers: number;
  maxMembers: number;
  isCompleted: boolean;
  hasUnreadMessages: boolean;
  unreadCount?: number; // 읽지 않은 메시지 개수 (선택적)
  genderRestriction: string;
  touristSpotImage: string;
  spotName: string;
};

export type MyChatRoomPageable = {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type MyChatRoomSort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type MyChatRoomResult = {
  content: MyChatRoom[];
  pageable: MyChatRoomPageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: MyChatRoomSort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type ResponseMyChatRoomsDto = CommonResponse<MyChatRoomResult>;
