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
