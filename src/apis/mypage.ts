import { authAxios } from './axios';
import type { ResponseMyChatRoomsDto } from '../types/home';
import type { ResponseMyInfoDto } from '../types/user';

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

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await authAxios.get(`/api/mypage/profile`);

  return data;
};
