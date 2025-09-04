import { authAxios } from './axios';
import type { CreateRoomPayload, CreateRoomApiResponse, LeaveRoomApiResponse } from '../types/room';

export const createRoom = async (payload: CreateRoomPayload): Promise<CreateRoomApiResponse> => {
  const { data } = await authAxios.post('/api/chatrooms/create', payload);
  return data;
};

// 채팅방 나가기 API
export const leaveRoom = async (roomId: number): Promise<LeaveRoomApiResponse> => {
  const token = localStorage.getItem('accessToken');
  const { data } = await authAxios.delete(
    `${import.meta.env.VITE_API_URL}/api/chatrooms/${roomId}/leave`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
