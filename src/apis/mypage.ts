import axios from 'axios';
import type { ResponseMyChatRoomsDto } from '../types/home';

export const getMyChatRooms = async (
  cursor?: string,
  page?: number,
  size?: number
): Promise<ResponseMyChatRoomsDto> => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const params = new URLSearchParams();
  
  if (cursor) params.append('cursor', cursor);
  if (page !== undefined) params.append('page', page.toString());
  if (size !== undefined) params.append('size', size.toString());

  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/mypage/chatrooms?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};
