import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { Message } from '@stomp/stompjs';
import type { WebSocketMessage } from '../types/chat';

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
  private messageCallbacks: ((data: any) => void)[] = [];
  private connectCallbacks: (() => void)[] = [];
  private disconnectCallbacks: (() => void)[] = [];
  private errorCallbacks: ((error: Event) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  connect(roomId: number, token: string) {
    // 이전 연결이 있다면 정리
    if (this.stompClient) {
      this.disconnect();
    }

    // 같은 방에 이미 연결되어 있다면 재연결하지 않음
    if (this.currentRoomId === roomId && this.connectionStatus) {
      console.log('이미 같은 방에 연결되어 있습니다:', roomId);
      return;
    }

    this.currentRoomId = roomId;
    this.currentToken = token;

    console.log('STOMP WebSocket 연결 시도, roomId:', roomId);

    try {
      // STOMP 클라이언트 생성
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/ws`),
        connectHeaders: {
          'Authorization': `Bearer ${token}`,
          'roomId': roomId.toString(),
          'Content-Type': 'application/json'
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });

      // 연결 성공 시 콜백
      this.stompClient.onConnect = (frame) => {
        console.log('=== STOMP 연결 성공 ===');
        console.log('연결 프레임:', frame);
        console.log('연결된 서버:', frame.headers.server);
        console.log('STOMP 버전:', frame.headers.version);
        console.log('사용자 정보:', frame.headers.user);
        console.log('세션 ID:', frame.headers['simp-session-id']);
        console.log('전달된 인증 헤더:', { 'Authorization': `Bearer ${token}`, 'roomId': roomId.toString() });
        this.connectionStatus = true;
        this.reconnectAttempts = 0;
        
        // 연결 후 잠시 대기 후 구독 (서버 준비 시간 확보)
        setTimeout(() => {
          console.log('연결 후 1초 대기 완료, 채팅방 구독 시작');
          this.subscribeToRoom(roomId);
        }, 1000);
        
        // 연결 콜백 실행
        this.connectCallbacks.forEach(cb => cb());
      };

      // 연결 해제 시 콜백
      this.stompClient.onDisconnect = (frame) => {
        console.log('STOMP 연결 해제됨:', frame);
        this.connectionStatus = false;
        this.disconnectCallbacks.forEach(cb => cb());
      };

      // 에러 발생 시 콜백
      this.stompClient.onStompError = (frame) => {
        console.error('STOMP 에러:', frame);
        this.errorCallbacks.forEach(cb => cb(new Event('stomp-error')));
      };

      // STOMP 연결 시작
      this.stompClient.activate();

    } catch (error) {
      console.error('STOMP 연결 생성 오류:', error);
      this.errorCallbacks.forEach(cb => cb(error as Event));
    }
  }

  private subscribeToRoom(roomId: number) {
    if (this.stompClient && this.connectionStatus) {
      // 백엔드와 일치하는 토픽 경로로 구독
      // 백엔드: /topic/{roomId} (예: /topic/1)
      const topicPath = `/topic/${roomId}`;
      
      console.log(`채팅방 ${roomId} 구독 시도 - 토픽: ${topicPath}`);
      console.log('STOMP 클라이언트 상태:', this.stompClient.connected);
      console.log('연결 상태:', this.connectionStatus);
      console.log('현재 토큰:', this.currentToken);
      
      try {
        // 구독 시에도 인증 헤더 포함
        const subscription = this.stompClient.subscribe(topicPath, (message: Message) => {
          console.log('=== 메시지 수신 시작 ===');
          console.log('메시지 객체:', message);
          console.log('메시지 헤더:', message.headers);
          console.log('메시지 본문:', message.body);
          
          try {
            const data = JSON.parse(message.body);
            console.log('파싱된 메시지 데이터:', data);
            console.log('=== 메시지 수신 완료 ===');
            
            // 구독테스트 메시지 필터링
            if (data.content && (
              data.content.includes('구독 테스트') || 
              data.content.includes('test') ||
              data.content.includes('테스트')
            )) {
              console.log('테스트 메시지 무시:', data.content);
              return;
            }
            
            this.messageCallbacks.forEach(cb => cb(data));
          } catch (error) {
            console.error('채팅방 메시지 파싱 오류:', error);
            console.error('원본 메시지:', message.body);
          }
        }, {
          // 구독 시 인증 헤더 추가
          'Authorization': `Bearer ${this.currentToken}`,
          'roomId': roomId.toString()
        });

        console.log(`채팅방 ${roomId} 구독 완료 - 토픽: ${topicPath}`);
        console.log('구독 객체:', subscription);
        console.log('구독 시 전달된 헤더:', { 'Authorization': `Bearer ${this.currentToken}`, 'roomId': roomId.toString() });
        
        // 구독 상태 확인 (테스트 메시지 전송 제거)
        console.log('구독 완료 - 테스트 메시지 전송 없음');
        
      } catch (error) {
        console.error('구독 생성 중 오류:', error);
        // 구독 실패 시 3초 후 재시도
        setTimeout(() => {
          console.log('구독 재시도...');
          this.subscribeToRoom(roomId);
        }, 3000);
      }
    } else {
      console.error('구독 실패 - STOMP 클라이언트 또는 연결 상태 문제');
      console.log('stompClient:', this.stompClient);
      console.log('connectionStatus:', this.connectionStatus);
      
      // 연결 상태가 아니면 3초 후 재시도
      if (!this.connectionStatus) {
        setTimeout(() => {
          console.log('연결 상태 확인 후 구독 재시도...');
          this.subscribeToRoom(roomId);
        }, 3000);
      }
    }
  }

  disconnect() {
    if (this.stompClient) {
      console.log('STOMP 연결 종료');
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.connectionStatus = false;
    this.currentRoomId = null;
    this.currentToken = null;
    this.reconnectAttempts = 0;
  }

  sendMessage(message: WebSocketMessage) {
    if (this.stompClient && this.connectionStatus) {
      console.log('STOMP 메시지 전송:', message);
      
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
      console.error('STOMP가 연결되지 않았습니다. 현재 상태:', this.connectionStatus);
    }
  }

  onMessage(callback: (data: any) => void) {
    this.messageCallbacks.push(callback);
  }

  onConnect(callback: () => void) {
    this.connectCallbacks.push(callback);
  }

  onDisconnect(callback: () => void) {
    this.disconnectCallbacks.push(callback);
  }

  onError(callback: (error: Event) => void) {
    this.errorCallbacks.push(callback);
  }

  removeMessageCallback(callback: (data: any) => void) {
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
