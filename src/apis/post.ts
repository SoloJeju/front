import type {
  RequestPostCreateDto,
  RequestPostPatchDto,
  ResponseCommentCreateDto,
  ResponseCommentDeleteDto,
  ResponseCommentListDto,
  ResponsePostCreateDto,
  ResponsePostDeleteDto,
  ResponsePostDetailDto,
  ResponsePostListDto,
  ResponsePostPatchDto,
  ResponsePostScrapDto,
} from '../types/post';
import { authAxios } from './axios';

// 게시글 목록 조회
export const getPostList = async ({
  category,
  cursor,
  size = 10,
}: {
  category?: string;
  cursor?: string;
  size?: number;
}): Promise<ResponsePostListDto> => {
  const { data } = await authAxios.get(`/api/community/posts`, {
    params: { category, cursor, size },
  });

  return data;
};

// 게시글 상세 조회
export const getPostDetail = async (
  postId: number
): Promise<ResponsePostDetailDto> => {
  const { data } = await authAxios.get(`/api/community/posts/${postId}`);

  return data;
};

// 게시글 스크랩
export const scrapPost = async (
  postId: number
): Promise<ResponsePostScrapDto> => {
  const { data } = await authAxios.put(`/api/community/posts/${postId}/scrap`);

  return data;
};

// 게시글 작성
export const createPost = async (
  body: RequestPostCreateDto
): Promise<ResponsePostCreateDto> => {
  const { data } = await authAxios.post(`/api/community/posts`, body, {});

  return data;
};

// 게시글 수정
export const patchPost = async ({
  postId,
  body,
}: {
  postId: number;
  body: RequestPostPatchDto;
}): Promise<ResponsePostPatchDto> => {
  const { data } = await authAxios.patch(
    `/api/community/posts/${postId}`,
    body,
    {}
  );

  return data;
};

// 게시글 삭제
export const deletePost = async (
  postId: number
): Promise<ResponsePostDeleteDto> => {
  const { data } = await authAxios.delete(`/api/community/posts/${postId}`, {});

  return data;
};

// 댓글 조회
export const getCommentList = async ({
  postId,
  cursor,
  size = 10,
}: {
  postId: number;
  cursor?: string;
  size?: number;
}): Promise<ResponseCommentListDto> => {
  const { data } = await authAxios.get(
    `/api/community/posts/${postId}/comments`,
    {
      params: { cursor, size },
    }
  );

  return data;
};

// 댓글 작성
export const createComment = async ({
  postId,
  content,
}: {
  postId: number;
  content: string;
}): Promise<ResponseCommentCreateDto> => {
  const { data } = await authAxios.post(
    `/api/community/posts/${postId}/comments`,
    {
      content,
    },
    {}
  );

  return data;
};

// 댓글 삭제
export const deleteComment = async (
  commentId: number
): Promise<ResponseCommentDeleteDto> => {
  const { data } = await authAxios.delete(
    `/api/community/comments/${commentId}`
  );

  return data;
};
