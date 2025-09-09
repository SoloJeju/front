import type { CommonResponse } from "./common";

// 프로필 수정 요청 
export type UpdateProfileRequest = {
  nickName?: string;
  imageName?: string;
  imageUrl?: string;
  bio?: string;         
};

// 응답
export type UpdateProfilePayload = {
  id: number;
  nickName: string;
  avatarUrl: string; // 서버가 어케 내려줘요?
  bio: string | null;
};

export type UpdateProfileResponse = CommonResponse<UpdateProfilePayload>;

export type PlanItem = {
  planId: number;
  title: string;
  transportType: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type ResponseMyPlansDto = CommonResponse<{
  content: PlanItem[];
  totalElements: number;
  totalPages: number;
}>;

export type ReviewItem = {
  id: number;
  touristSpotId: number;
  touristSpotName: string;
  touristSpotImage: string;
  touristSpotAverageRating: number;
  reviewText: string;
  difficulty: string;
  visitDate: string;
  receipt: boolean;
  rating: number;
  thumbnailUrl: string | null;
  thumbnailName: string | null;
  tags: string[];
  images: string[];
  userId: number;
  userNickname: string;
  userProfileImage: string | null;
  createdAt: string;
};

export type ResponseMyReviewsDto = CommonResponse<{
  content: ReviewItem[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}>;