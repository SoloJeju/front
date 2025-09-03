import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { Message } from '@stomp/stompjs';
import type { WebSocketMessage, WebSocketChatMessage } from '../types/chat';

interface StompMessage {
  type: 'ENTER' | 'TALK' | 'EXIT';
  roomId: number;
  content?: string;
  token: string;
}

class WebSocketService {
  private stompClient: Client | null = null;
  private connectionStatus: boolean = false;
  private currentRoomId: number | null = null;
  private currentToken: string | null = null;
  private messageCallbacks: ((data: WebSocketChatMessage) => void)[] = [];
  private connectCallbacks: (() => void)[] = [];
  private disconnectCallbacks: (() => void)[] = [];
  private errorCallbacks: ((error: Event) => void)[] = [];

  connect(roomId: number, token: string) {
    // 이전 연결이 있다면 정리
    if (this.stompClient) {
      this.disconnect();
    }

    // 같은 방에 이미 연결되어 있다면 재연결하지 않음
    if (this.currentRoomId === roomId && this.connectionStatus) {
      return;
    }

    this.currentRoomId = roomId;
    this.currentToken = token;

    try {
      // STOMP 클라이언트 생성
      this.stompClient = new Client({
        brokerURL: `${import.meta.env.VITE_WS_URL}`,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
          roomId: roomId.toString(),
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });


      // 연결 성공 시 콜백
      this.stompClient.onConnect = () => {
        this.connectionStatus = true;
        
        // 연결 후 잠시 대기 후 구독 (서버 준비 시간 확보)
        setTimeout(() => {
          this.subscribeToRoom(roomId);
        }, 1000);
        
        // 연결 콜백 실행
        this.connectCallbacks.forEach(cb => cb());
      };

      // 연결 해제 시 콜백
      this.stompClient.onDisconnect = () => {
        this.connectionStatus = false;
        this.disconnectCallbacks.forEach(cb => cb());
      };

      // 에러 발생 시 콜백
      this.stompClient.onStompError = () => {
        this.errorCallbacks.forEach(cb => cb(new Event('stomp-error')));
      };

      // STOMP 연결 시작
      this.stompClient.activate();

    } catch (error) {
      this.errorCallbacks.forEach(cb => cb(error as Event));
    }
  }

  private subscribeToRoom(roomId: number) {
    if (this.stompClient && this.connectionStatus) {
      // 백엔드와 일치하는 토픽 경로로 구독
      // 백엔드: /topic/{roomId} (예: /topic/1)
      const topicPath = `/topic/${roomId}`;
      
      try {
        // 구독 시에도 인증 헤더 포함
        this.stompClient.subscribe(topicPath, (message: Message) => {
          try {
            const data = JSON.parse(message.body) as WebSocketChatMessage;
            
            // 구독테스트 메시지 필터링
            if (data.content && (
              data.content.includes('구독 테스트') || 
              data.content.includes('test') ||
              data.content.includes('테스트')
            )) {
              return;
            }
            
            this.messageCallbacks.forEach(cb => cb(data));
          } catch (parseError) {
            console.error('메시지 파싱 오류:', parseError);
          }
        }, {
          // 구독 시 인증 헤더 추가
          'Authorization': `Bearer ${this.currentToken}`,
          'roomId': roomId.toString()
        });
        
      } catch {
        // 구독 실패 시 3초 후 재시도
        setTimeout(() => {
          this.subscribeToRoom(roomId);
        }, 3000);
      }
    } else {
      // 연결 상태가 아니면 3초 후 재시도
      if (!this.connectionStatus) {
        setTimeout(() => {
          this.subscribeToRoom(roomId);
        }, 3000);
      }
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.connectionStatus = false;
    this.currentRoomId = null;
    this.currentToken = null;
  }

  sendMessage(message: WebSocketMessage) {
    if (this.stompClient && this.connectionStatus) {
      
      // 백엔드 DTO 구조에 맞춰 메시지 전송
      const stompMessage: StompMessage = {
        type: message.type,
        roomId: message.roomId,
        content: message.content,
        token: this.currentToken || ''
      };
      
      // STOMP를 통해 메시지 전송
      this.stompClient.publish({
        destination: `/app/chat/${message.roomId}`,
        headers: { 'Authorization': `Bearer ${this.currentToken}` },
        body: JSON.stringify(stompMessage)
      });
    } else {
      console.warn('WebSocket이 연결되지 않았습니다.');
    }
  }

  onMessage(callback: (data: WebSocketChatMessage) => void) {
    // 기존 콜백 제거 후 새로운 콜백만 등록
    this.messageCallbacks = [];
    this.messageCallbacks.push(callback);
  }

  onConnect(callback: () => void) {
    // 기존 콜백 제거 후 새로운 콜백만 등록
    this.connectCallbacks = [];
    this.connectCallbacks.push(callback);
  }

  onDisconnect(callback: () => void) {
    // 기존 콜백 제거 후 새로운 콜백만 등록
    this.disconnectCallbacks = [];
    this.disconnectCallbacks.push(callback);
  }

  onError(callback: (error: Event) => void) {
    // 기존 콜백 제거 후 새로운 콜백만 등록
    this.errorCallbacks = [];
    this.errorCallbacks.push(callback);
  }

  removeMessageCallback(callback: (data: WebSocketChatMessage) => void) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  removeConnectCallback(callback: () => void) {
    this.connectCallbacks = this.connectCallbacks.filter(cb => cb !== callback);
  }

  removeDisconnectCallback(callback: () => void) {
    this.disconnectCallbacks = this.disconnectCallbacks.filter(cb => cb !== callback);
  }

  removeErrorCallback(callback: (error: Event) => void) {
    this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
  }

  isConnected(): boolean {
    return this.connectionStatus;
  }

  getConnectionState(): string {
    if (!this.stompClient) return '연결되지 않음';
    return this.connectionStatus ? '연결됨' : '연결 중';
  }
}

export default new WebSocketService();
