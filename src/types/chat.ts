// 채팅 메시지 타입
export type ChatMessageType = 'ENTER' | 'TALK' | 'EXIT';

// API 응답의 채팅 메시지 (isMine 포함)
export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  roomId: number;
  senderId: number;
  senderName: string;
  senderProfileImage: string | null;
  content: string;
  image: string | null;
  sendAt: string;
  isMine: boolean;
}

// WebSocket으로 받는 실시간 메시지 (isMine 없음)
export interface WebSocketChatMessage {
  id: string;
  type: ChatMessageType;
  roomId: number;
  senderId: number | null;
  senderName: string;
  senderProfileImage: string | null;
  content: string;
  image: string | null;
  sendAt: string;
  isMine: boolean | null;
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

// 채팅방 상세조회 응답
export interface ChatRoomDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    chatRoomId: number;
    title: string;
    description: string;
    joinDate: string;
    currentMembers: number;
    maxMembers: number | null;
    isCompleted: boolean;
    hasUnreadMessages: boolean | null;
    genderRestriction: string;
    touristSpotImage: string;
    spotName: string;
  }
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
  profileImage: string | null;
  joinedAt: string;
  active: boolean;
  mine: boolean;
   owner: boolean;  
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
