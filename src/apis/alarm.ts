import type {
  ResponseGroupedNotiDto,
  ResponseMyNotiListDto,
  ResponseReadGroupedNotiDto,
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

// 내 알림 그룹 조회
export const getMyGroupedNotiList = async ({
  cursor,
  size = 10,
}: {
  cursor: string | undefined;
  size?: number;
}): Promise<ResponseGroupedNotiDto> => {
  const { data } = await authAxios.get(`/api/notifications/grouped`, {
    params: { cursor, size },
  });

  return data;
};

// 그룹 알림 읽음 처리
export const putReadGroupedNoti = async ({
  type,
  resourceType,
  resourceId,
}: {
  type: string;
  resourceType: string;
  resourceId: number;
}): Promise<ResponseReadGroupedNotiDto> => {
  const { data } = await authAxios.put(`/api/notifications/group-read`, null, {
    params: { type, resourceType, resourceId },
  });

  return data;
};
