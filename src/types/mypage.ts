import type { CommonResponse } from './common';
import type { Post } from './post';
import type { MyInfo } from './user';

/** 오프셋 페이징 공통 타입 */
export type OffsetPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
};

/** 커서 페이징 공통 타입 */
export type CursorPage<T> = {
  content: T[];
  nextCursor: string | null;
  hasNext: boolean;
  size: number;
};

/** 커서 페이지 판별용 타입가드 */
export const isCursorPage = <T>(
  page: OffsetPage<T> | CursorPage<T>
): page is CursorPage<T> => 'hasNext' in page;

/* ----------------------------
 * 프로필
 * ---------------------------- */
export type UpdateProfileRequest = {
  nickName?: string;
  imageName?: string;
  imageUrl?: string;
  bio?: string;
};
export type UpdateProfileResponse = CommonResponse<MyInfo>;

/** 회원탈퇴 응답 */
export type DeleteProfileResponse = CommonResponse<string>;

/* ----------------------------
 * 내 계획 목록 (오프셋 전용)
 * ---------------------------- */
export type PlanItem = {
  planId: number;
  title: string;
  transportType: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};
/* ----------------------------
 * 스크랩 목록 (오프셋 | 커서 통합)
 * ---------------------------- */
export type ScrapItem = {
  postId: number;
  title: string;
  thumbnailUrl?: string | null;
  createdAt?: string;
};
export type ResponseMyScrapsDto = CommonResponse<
  OffsetPage<ScrapItem> | CursorPage<ScrapItem>
>;

/* ----------------------------
 * 내가 쓴 게시글 (오프셋 | 커서 통합)
 * ---------------------------- */
export type MyPostsPage = OffsetPage<Post> | CursorPage<Post>;
export type ResponseMyPostsDto = CommonResponse<MyPostsPage>;

/* ----------------------------
 * 내가 댓글 단 게시글 (오프셋 | 커서 통합)
 * ---------------------------- */
export type MyCommentedPostsPage = OffsetPage<Post> | CursorPage<Post>;
export type ResponseMyCommentedPostsDto = CommonResponse<MyCommentedPostsPage>;


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