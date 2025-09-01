import axios from 'axios';
import type { CreateRoomPayload, CreateRoomApiResponse } from '../types/room';

export const createRoom = async (payload: CreateRoomPayload): Promise<CreateRoomApiResponse> => {
  const token = localStorage.getItem('accessToken'); // 로그인 시 저장했던 토큰
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/chatrooms/create`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
