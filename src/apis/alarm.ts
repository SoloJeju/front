import axios from 'axios';
import type {
  ResponseMyNotiListDto,
  ResponseUnreadNotiDto,
} from '../types/alarm';

// 임시 acessToken
const accessToken = '';

// fcm 토큰 업데이트
export const registerFcmToken = async (token: string) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/api/notifications/fcm-token`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      fcmToken: token,
    }
  );
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
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/notifications`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { cursor, page, size },
    }
  );

  return data;
};

// 미확인 알림 여부
export const getUnreadNoti = async (): Promise<ResponseUnreadNotiDto> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/notifications/unread`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
};

// 단일 알림 확인
export const putReadNoti = async (notificationId: number) => {
  await axios.put(
    `${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
