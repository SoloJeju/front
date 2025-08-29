import axios from 'axios';
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

// 임시 acessToken
const accessToken = '';

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
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/community/posts`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { category, cursor, size },
    }
  );

  return data;
};

// 게시글 상세 조회
export const getPostDetail = async (
  postId: number
): Promise<ResponsePostDetailDto> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
};

// 게시글 스크랩
export const scrapPost = async (
  postId: number
): Promise<ResponsePostScrapDto> => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}/scrap`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
};

// 게시글 작성
export const createPost = async (
  body: RequestPostCreateDto
): Promise<ResponsePostCreateDto> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/community/posts`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

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
  const { data } = await axios.patch(
    `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
};

// 게시글 삭제
export const deletePost = async (
  postId: number
): Promise<ResponsePostDeleteDto> => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

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
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}/comments`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}/comments`,
    {
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
};

// 댓글 삭제
export const deleteComment = async (
  commentId: number
): Promise<ResponseCommentDeleteDto> => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/community/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
};
