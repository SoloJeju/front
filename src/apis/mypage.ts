import { authAxios } from './axios';
import type { ResponseMyChatRoomsDto } from '../types/home';
import type {
  ResponseMyPlansDto,
  UpdateProfileRequest,
  UpdateProfileResponse,
  DeleteProfileResponse,
  ResponseMyScrapsDto,
  ResponseMyPostsDto,
  ResponseMyCommentedPostsDto,
  ResponseMyReviewsDto,
} from '../types/mypage';
import type {
  ResponseMyInfoDto,
  GetOtherUserProfileResponse,
} from '../types/user';

export const getMyChatRooms = async (
  cursor?: string,
  page?: number,
  size?: number
): Promise<ResponseMyChatRoomsDto> => {
  const params = new URLSearchParams();

  if (cursor) params.append('cursor', cursor);
  if (page !== undefined) params.append('page', page.toString());
  if (size !== undefined) params.append('size', size.toString());

  const { data } = await authAxios.get(
    `/api/mypage/chatrooms?${params.toString()}`
  );

  return data;
};

export const getUnreadMessages = async (): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: boolean;
}> => {
  const { data } = await authAxios.get(`/api/mypage/unread-messages`);

  return data;
};

// 내 프로필 조회
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await authAxios.get(`/api/mypage/profile`);

  return data;
};

// 내 프로필 수정
export const updateMyProfile = async (body: UpdateProfileRequest) => {
  const { data } = await authAxios.put<UpdateProfileResponse>(
    '/api/mypage/profile',
    body
  );
  return data;
};

// 회원 탈퇴
export const deleteProfile = async (): Promise<DeleteProfileResponse> => {
  const { data } = await authAxios.delete('/api/mypage/profile');
  return data;
};

export const getMyPlans = async (
  cursor?: string,
  page?: number,
  size?: number
): Promise<ResponseMyPlansDto> => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);
  if (page !== undefined) params.append('page', page.toString());
  if (size !== undefined) params.append('size', size.toString());

  const { data } = await authAxios.get(
    `/api/mypage/plans?${params.toString()}`
  );
  return data;
};

// 내 스크랩 목록
export const getMyScraps = async (
  cursor?: string,
  page?: number,
  size?: number
): Promise<ResponseMyScrapsDto> => {
  const params = new URLSearchParams();

  if (cursor != null) params.append('cursor', cursor);
  if (page != null) params.append('page', String(page));
  if (size != null) params.append('size', String(size));

  const qs = params.toString();
  const { data } = await authAxios.get<ResponseMyScrapsDto>(
    `/api/mypage/scraps${qs ? `?${qs}` : ''}`
  );
  return data;
};

// 다른 사용자 프로필 조회
export const getOtherUserProfile = async (
  userId: number
): Promise<GetOtherUserProfileResponse> => {
  const { data } = await authAxios.get<GetOtherUserProfileResponse>(
    `/api/mypage/profile/${userId}`
  );
  return data;
};

// 내가 쓴 게시글 목록
export const getMyPosts = async (
  cursor?: string,
  page?: number,
  size?: number
): Promise<ResponseMyPostsDto> => {
  const params = new URLSearchParams();
  if (cursor != null) params.append('cursor', cursor);
  if (page != null) params.append('page', String(page));
  if (size != null) params.append('size', String(size));

  const qs = params.toString();
  const { data } = await authAxios.get<ResponseMyPostsDto>(
    `/api/mypage/posts${qs ? `?${qs}` : ''}`
  );
  return data;
};

// 내가 댓글 단 게시글 목록
export const getMyCommentedPosts = async (
  cursor?: string,
  page?: number,
  size?: number
): Promise<ResponseMyCommentedPostsDto> => {
  const params = new URLSearchParams();
  if (cursor !== undefined) params.append('cursor', cursor);
  if (page !== undefined) params.append('page', String(page));
  if (size !== undefined) params.append('size', String(size));

  const { data } = await authAxios.get(
    `/api/mypage/commented-posts?${params.toString()}`
  );
  return data;
};

export const getMyReviews = async (
  cursor?: string,
  page?: number,
  size?: number
): Promise<ResponseMyReviewsDto> => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);
  if (page !== undefined) params.append('page', page.toString());
  if (size !== undefined) params.append('size', size.toString());

  const { data } = await authAxios.get(`/api/mypage/reviews?${params.toString()}`);
  return data;
};