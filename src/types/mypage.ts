import type { CommonResponse } from './common';
import type { Post } from './post';
import type { MyInfo } from './user';

// 내 프로필 수정
export type UpdateProfileRequest = {
  nickName?: string;
  imageName?: string;
  imageUrl?: string;
  bio?: string;
};
export type UpdateProfileResponse = CommonResponse<MyInfo>;

// 회원탈퇴
export type DeleteProfileResponse = CommonResponse<string>;

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

// 내 스크랩 목록
/* 스크랩 아이템 — 서버 필드 직접 스크랩해보고 해야 하는데 스크랩이 안되는데요? */
export type ScrapItem = {
  postId: number;
  title: string;
  thumbnailUrl?: string | null;
  createdAt?: string;
  // 필요시 서버 응답 보고 필드 추가
};

export type MyScrapsOffset = {
  content: ScrapItem[];
  totalElements: number;
  totalPages: number;
};

export type MyScrapsCursor = {
  content: ScrapItem[];
  nextCursor: string | null;
  hasNext: boolean;
  size: number;
};

export type ResponseMyScrapsOffsetDto = CommonResponse<MyScrapsOffset>;
export type ResponseMyScrapsCursorDto = CommonResponse<MyScrapsCursor>;

export type ResponseMyScrapsDto =
  | ResponseMyScrapsOffsetDto
  | ResponseMyScrapsCursorDto;

// 내가 쓴 게시글 목록
/* 오프셋 기반 응답 데이터 */
export type MyPostsOffset = {
  content: Post[];
  totalElements: number;
  totalPages: number;
};

/* 커서 기반 응답 데이터 */
export type MyPostsCursor = {
  content: Post[];
  nextCursor: string | null;
  hasNext: boolean;
  size: number;
};

/* 오프셋 기반 응답 DTO */
export type ResponseMyPostsOffsetDto = CommonResponse<MyPostsOffset>;

/* 커서 기반 응답 DTO */
export type ResponseMyPostsCursorDto = CommonResponse<MyPostsCursor>;

/* 최종 응답 DTO (오프셋 | 커서 통합) */
export type ResponseMyPostsDto =
  | ResponseMyPostsOffsetDto
  | ResponseMyPostsCursorDto;

// 내가 댓글 단 게시글 목록
/* 오프셋 기반 응답 데이터의 형태 */
export type MyCommentedPostsOffset = {
  content: Post[]; // Post 타입을 재사용합니다.
  totalElements: number;
  totalPages: number;
};

/* 커서 기반 응답 데이터의 형태 */
export type MyCommentedPostsCursor = {
  content: Post[]; // Post 타입을 재사용합니다.
  nextCursor: string | null;
  hasNext: boolean;
  size: number;
};

/* 내가 댓글 단 게시글 목록 API의 오프셋 기반 응답 DTO */
export type ResponseMyCommentedPostsOffsetDto =
  CommonResponse<MyCommentedPostsOffset>;
/* 내가 댓글 단 게시글 목록 API의 커서 기반 응답 DTO */
export type ResponseMyCommentedPostsCursorDto =
  CommonResponse<MyCommentedPostsCursor>;

/* 내가 댓글 단 게시글 목록 API의 최종 응답 DTO (통합) */
export type ResponseMyCommentedPostsDto =
  | ResponseMyCommentedPostsOffsetDto
  | ResponseMyCommentedPostsCursorDto;
