import axios from 'axios';
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

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'; // 백엔드 서버 주소

class ChatApiService {
  private api: ReturnType<typeof axios.create>;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 - 토큰 자동 추가
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API 요청:', config.method?.toUpperCase(), config.url, config.data);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터 - 토큰 만료 시 자동 갱신
    this.api.interceptors.response.use(
      (response) => {
        console.log('API 응답:', response.status, response.data);
        return response;
      },
      async (error) => {
        console.error('API 오류:', error.response?.status, error.response?.data);
        const originalRequest = error.config;

        // 401 Unauthorized 에러 처리
        if (error.response?.status === 401) {
          // 이미 재시도한 요청이면 바로 로그아웃
          if (originalRequest._retry) {
            console.log('토큰 갱신 실패, 자동 로그아웃 실행');
            this.handleTokenError();
            return Promise.reject(error);
          }

          // 토큰 갱신 요청 자체가 401이면 바로 로그아웃 (무한 루프 방지)
          if (originalRequest.url === '/api/auth/reissue') {
            console.log('토큰 갱신 API 자체가 401, 즉시 로그아웃 실행');
            this.handleTokenError();
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              console.log('토큰 갱신 시도...');
              // 토큰 갱신 API 호출 (실제 구현 필요)
              // const response = await this.refreshToken({ refreshToken });
              
              // 임시로 로그아웃 처리
              console.log('토큰 갱신 구현 필요, 임시로 로그아웃 실행');
              this.handleTokenError();
              return Promise.reject(error);
            } else {
              console.log('리프레시 토큰 없음, 자동 로그아웃 실행');
              this.handleTokenError();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error('토큰 갱신 중 오류:', refreshError);
            console.log('토큰 갱신 오류로 자동 로그아웃 실행');
            this.handleTokenError();
            return Promise.reject(error);
          }
        }

        // 403 Forbidden 에러 처리 (권한 없음)
        if (error.response?.status === 403) {
          console.log('권한 없음, 자동 로그아웃 실행');
          this.handleTokenError();
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  // 토큰 오류 시 공통 처리
  private handleTokenError() {
    console.log('토큰 오류로 인한 자동 로그아웃 실행');
    
    // 로컬 스토리지 클리어
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    
    // 현재 페이지가 로그인/회원가입 페이지가 아닌 경우에만 리다이렉트
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
      console.log('로그인 페이지로 리다이렉트');
      // 강제로 로그인 페이지로 이동
      window.location.replace('/login');
    }
  }

  // 내 채팅방 목록 조회
  async getMyChatRooms(): Promise<MyChatRoomListResponse> {
    console.log('내 채팅방 목록 조회 요청');
    const response = await this.api.get('/api/mypage/chatrooms');
    return response.data;
  }

  // 채팅방 생성
  async createChatRoom(request: CreateChatRoomRequest): Promise<ChatRoomResponse> {
    console.log('채팅방 생성 요청 데이터:', request);
    const response = await this.api.post('/api/chatrooms/create', request);
    return response.data;
  }

  // 채팅방 참가
  async joinChatRoom(roomId: number): Promise<JoinChatRoomResponseWrapper> {
    console.log('채팅방 참가 요청, roomId:', roomId);
    const response = await this.api.post(`/api/chatrooms/${roomId}/join`);
    return response.data;
  }

  // 채팅방 나가기
  async leaveChatRoom(roomId: number): Promise<SimpleResponse> {
    console.log('채팅방 나가기 요청, roomId:', roomId);
    const response = await this.api.delete(`/api/chatrooms/${roomId}/leave`);
    return response.data;
  }

  // 채팅방 사용자 목록 조회
  async getChatRoomUsers(roomId: number): Promise<ChatRoomUsersResponseWrapper> {
    console.log('채팅방 사용자 목록 조회, roomId:', roomId);
    const response = await this.api.get(`/api/chatrooms/${roomId}/users`);
    return response.data;
  }

  // 관광지별 채팅방 목록 조회
  async getChatRoomsByTouristSpot(contentId: number): Promise<ChatRoomListResponse> {
    console.log('관광지별 채팅방 목록 조회, contentId:', contentId);
    const response = await this.api.get(`/api/chatrooms/tourist-spot/${contentId}`);
    return response.data;
  }

  // 채팅방 메시지 조회
  async getChatRoomMessages(
    roomId: number, 
    lastMessageTime?: string, 
    size: number = 20
  ): Promise<ChatMessageResponse> {
    console.log('채팅방 메시지 조회, roomId:', roomId, 'size:', size, 'lastMessageTime:', lastMessageTime);
    let url = `/api/chatrooms/${roomId}/messages?size=${size}`;
    if (lastMessageTime) {
      url += `&lastMessageTime=${lastMessageTime}`;
    }
    const response = await this.api.get(url);
    return response.data;
  }

  // 채팅방 메시지 읽음 처리
  async markMessagesAsRead(roomId: number): Promise<SimpleResponse> {
    console.log('채팅방 메시지 읽음 처리 요청, roomId:', roomId);
    const response = await this.api.post(`/api/chatrooms/${roomId}/read`);
    return response.data;
  }
}

export default new ChatApiService();
