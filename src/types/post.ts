import type { CommonCursorResponse, CommonResponse } from './common';

// 게시글 카테고리
export type PostCategory =
  | 'COMPANION_PROPOSAL'
  | 'QUESTION'
  | 'SOLO_TIP'
  | 'SOLO_CHALLENGE';

// 게시글 목록 조회
export type Post = {
  postId: number;
  title: string;
  content: string;
  postCategory: PostCategory;
  authorNickname: string;
  authorId: number;
  authorProfileImage: string | null;
  commentCount: number;
  scrapCount: number;
  createdAt: Date;
  thumbnailUrl: string | null;
};

export type ResponsePostListDto = CommonCursorResponse<{
  content: Post[];
}>;

// 게시글 상세 조회
export type ResponsePostDetailDto = CommonResponse<{
  postId: number;
  title: string;
  content: string;
  postCategory: PostCategory;
  authorNickname: string;
  authorId: number;
  authorProfileImage: string;
  commentCount: number;
  scrapCount: number;
  isScraped: boolean;
  isMine: boolean;
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl: string;
  thumbnailName: string;
  images: {
    imageUrl: string;
    imageName: string;
  }[];
  chatRoomId: number;
  spotName: string;
  joinDate: Date;
  currentMembers: number;
  maxMembers: number;
  genderRestriction: string;
  recruitmentStatus: string;
}>;

// 게시글 스크랩
export type ResponsePostScrapDto = CommonResponse<string>;

// 게시글 작성
export type RequestPostCreateDto = {
  title: string;
  content: string;
  postCategory: PostCategory;
  imageUrls: string[];
  imageNames: string[];
};

export type ResponsePostCreateDto = CommonResponse<{
  postId: number;
  message: string;
}>;

// 게시글 수정
export type RequestPostPatchDto = {
  title: string;
  content: string;
  postCategory: PostCategory;
  newImageUrls: string[];
  newImageNames: string[];
  deleteImageNames: string[];
};

export type ResponsePostPatchDto = CommonResponse<{
  postId: number;
  message: string;
}>;

// 게시글 삭제
export type ResponsePostDeleteDto = CommonResponse<string>;

// 댓글 조회
export type Comment = {
  commentId: number;
  content: string;
  authorNickname: string;
  authorId: number;
  authorProfileImage: string;
  isMine: boolean;
  isDeleted: boolean;
  createdAt: Date;
};

export type ResponseCommentListDto = CommonCursorResponse<{
  content: Comment[];
}>;

// 댓글 작성
export type ResponseCommentCreateDto = CommonResponse<{
  commentId: number;
  message: string;
}>;

// 댓글 삭제
export type ResponseCommentDeleteDto = CommonResponse<string>;
