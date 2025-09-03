import type {
  ResponseMyNotiListDto,
  ResponseUnreadNotiDto,
} from '../types/alarm';
import { authAxios } from './axios';

// fcm 토큰 업데이트
export const registerFcmToken = async (token: string) => {
  await authAxios.post(`/api/notifications/fcm-token`, {
    fcmToken: token,
  });
};

// 내 알림 조회
export const getMyNotiList = async ({
  cursor,
  page,
  size = 10,
}: {
  cursor?: string;
  page?: number;
  size?: number;
}): Promise<ResponseMyNotiListDto> => {
  const { data } = await authAxios.get(`/api/notifications`, {
    params: { cursor, page, size },
  });

  return data;
};

// 미확인 알림 여부
export const getUnreadNoti = async (): Promise<ResponseUnreadNotiDto> => {
  const { data } = await authAxios.get(`/api/notifications/unread`);

  return data;
};

// 단일 알림 확인
export const putReadNoti = async (notificationId: number) => {
  await authAxios.put(`/api/notifications/${notificationId}/read`);
};
