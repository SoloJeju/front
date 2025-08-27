import axios from 'axios';
import type { CreateRoomPayload, CreateRoomApiResponse } from '../types/room';

export const createRoom = async ( payload: CreateRoomPayload ): Promise<CreateRoomApiResponse> => {
  const { data } = await axios.post( `${import.meta.env.VITE_API_URL}/api/chatrooms/create`, payload );
  return data;
};
