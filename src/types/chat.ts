// 채팅 메시지 타입
export type ChatMessageType = 'ENTER' | 'TALK' | 'EXIT';

// 채팅 메시지
export interface ChatMessage {
  id: number;
  type: ChatMessageType;
  content?: string;
  senderId: number;
  senderName: string;
  roomId: number;
  sendAt: string;
}

// WebSocket 메시지
export interface WebSocketMessage {
  type: ChatMessageType;
  roomId: number;
  content?: string;
}

// 채팅방 생성 요청
export interface CreateChatRoomRequest {
  title: string;
  description: string;
  spotContentId: number;
  maxParticipants: number;
  scheduledDate: string;
  genderRestriction?: string;
}

// 채팅방 응답
export interface ChatRoom {
  roomId: number;
  title: string;
  description: string;
  spotContentId: number;
  spotName: string;
  spotImage: string;
  currentParticipants: number;
  maxParticipants: number;
  scheduledDate: string;
  hostNickname: string;
  genderRestriction?: string;
  createdAt: string;
}

// 채팅방 생성 응답
export interface ChatRoomResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ChatRoom;
}

// 채팅방 목록 응답
export interface ChatRoomListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    chatRooms: ChatRoom[];
    hasNext: boolean;
  };
}

// 채팅방 참가 응답
export interface JoinChatRoomResponse {
  roomId: number;
  message: string;
}

// 채팅방 참가 응답 래퍼
export interface JoinChatRoomResponseWrapper {
  isSuccess: boolean;
  code: string;
  message: string;
  result: JoinChatRoomResponse;
}

// 채팅방 사용자
export interface ChatRoomUser {
  userId: number;
  username: string;
  isActive: boolean;
}

// 채팅방 사용자 목록 응답
export interface ChatRoomUsersResponse {
  users: ChatRoomUser[];
  totalMembers: number;
}

// 채팅방 사용자 목록 응답 래퍼
export interface ChatRoomUsersResponseWrapper {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ChatRoomUsersResponse;
}

// 채팅 메시지 응답
export interface ChatMessageResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    messages: ChatMessage[];
    hasNext: boolean;
  };
}

// 내 채팅방
export interface MyChatRoom {
  roomId: number;
  title: string;
  spotName: string;
  currentParticipants: number;
  maxParticipants: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

// 내 채팅방 목록 응답
export interface MyChatRoomListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyChatRoom[];
}

// 내 채팅방 응답
export interface MyChatRoomResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyChatRoom;
}

// 간단한 응답
export interface SimpleResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}
