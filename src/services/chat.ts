import { authAxios } from '../apis/axios';
import type { 
  CreateChatRoomRequest, 
  ChatRoomResponse,
  ChatRoomListResponse,
  ChatMessageResponse,
  ChatRoomUsersResponseWrapper,
  JoinChatRoomResponseWrapper,
  SimpleResponse,
  MyChatRoomListResponse
} from '../types/chat';

class ChatApiService {
  // 내 채팅방 목록 조회
  async getMyChatRooms(): Promise<MyChatRoomListResponse> {
    
    const response = await authAxios.get('/api/mypage/chatrooms');
    return response.data;
  }

  // 채팅방 생성
  async createChatRoom(request: CreateChatRoomRequest): Promise<ChatRoomResponse> {
   
    const response = await authAxios.post('/api/chatrooms/create', request);
    return response.data;
  }

  // 채팅방 참가
  async joinChatRoom(roomId: number): Promise<JoinChatRoomResponseWrapper> {
    
    const response = await authAxios.post(`/api/chatrooms/${roomId}/join`);
    return response.data;
  }

  // 채팅방 나가기
  async leaveChatRoom(roomId: number): Promise<SimpleResponse> {
    
    const response = await authAxios.delete(`/api/chatrooms/${roomId}/leave`);
    return response.data;
  }

  // 채팅방 사용자 목록 조회
  async getChatRoomUsers(roomId: number): Promise<ChatRoomUsersResponseWrapper> {
    
    const response = await authAxios.get(`/api/chatrooms/${roomId}/users`);
    return response.data;
  }

  // 관광지별 채팅방 목록 조회
  async getChatRoomsByTouristSpot(contentId: number): Promise<ChatRoomListResponse> {
   
    const response = await authAxios.get(`/api/chatrooms/tourist-spot/${contentId}`);
    return response.data;
  }

  // 채팅방 메시지 조회
  async getChatRoomMessages(
    roomId: number, 
    lastMessageTime?: string, 
    size: number = 20
  ): Promise<ChatMessageResponse> {
  
    let url = `/api/chatrooms/${roomId}/messages?size=${size}`;
    if (lastMessageTime) {
      url += `&lastMessageTime=${lastMessageTime}`;
    }
    const response = await authAxios.get(url);
    return response.data;
  }

  // 채팅방 메시지 읽음 처리
  async markMessagesAsRead(roomId: number): Promise<SimpleResponse> {
    const response = await authAxios.post(`/api/chatrooms/${roomId}/read`);
    return response.data;
  }
}

export default new ChatApiService();
