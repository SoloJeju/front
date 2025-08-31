import { useParams, useNavigate } from 'react-router-dom';
import BackHeader from '../../components/common/Headers/BackHeader';
import ChatInput from '../../components/ChatRoomPage/ChatInput';
import { useEffect, useRef, useState } from 'react';
import ChatMessages from '../../components/ChatRoomPage/ChatMessages';
import ChatModal from '../../components/ChatRoomPage/ChatModal';
import chatApiService from '../../services/chat';
import websocketService from '../../services/websocket';
import type { ChatMessage, ChatRoomUsersResponse } from '../../types/chat';

const mockData = [
  {
    senderName: '홍길동',
    message: '',
    time: '2025-07-09T09:00',
    type: 'ENTER',
  },
  {
    senderName: '박길동',
    message: '안녕하세요 홍길동님',
    time: '2025-07-08T09:27',
    type: 'CHAT',
  },
  {
    senderName: '홍길동',
    message: '안녕하세용 방가방가 ~~~',
    time: '2025-07-08T09:27',
    type: 'CHAT',
  },
  {
    senderName: '박길동',
    message: '저도 돌솥밥 좋아해요 얌~~~',
    time: '2025-07-08T09:27',
    type: 'CHAT',
  },
  {
    senderName: '박길동',
    message: '안녕하세요 홍길동님!!! 밥은 먹고 다니냐 맛있는거 먹어라',
    time: '2025-07-08T09:27',
    type: 'CHAT',
  },
  {
    senderName: '박길동',
    message:
      '혹시 제가 11시 이후에 도착하는데 괜찮을까요? 제발 저 돌솥밥 먹으러가고싶어요 제발요 저 두고가지마세요',
    time: '2025-07-09T09:27',
    type: 'CHAT',
  },
  {
    senderName: '홍길동',
    message: '예.. 얼른 오세요 배고프니까...',
    time: '2025-07-09T09:27',
    type: 'CHAT',
  },
];

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  console.log(roomId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalBg = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<ChatRoomUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('연결 중...');
  const [hasNext, setHasNext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    if (roomId) {
      loadMessages();
      loadUsers();
      // WebSocket 연결은 한 번만 실행
      if (!isConnected) {
        connectWebSocket();
      }
    }

    return () => {
      websocketService.disconnect();
    };
  }, [roomId]); // roomId만 의존성으로 설정

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 스크롤 이벤트 핸들러
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop === 0 && hasNext && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('인증 토큰이 없습니다.');
      return;
    }

    console.log('WebSocket 연결 시도, roomId:', roomId);
    setConnectionStatus('연결 중...');

    // 기존 콜백 제거 (중복 방지)
    websocketService.removeMessageCallback(handleWebSocketMessage);
    websocketService.removeConnectCallback(handleWebSocketConnect);
    websocketService.removeDisconnectCallback(handleWebSocketDisconnect);
    websocketService.removeErrorCallback(handleWebSocketError);

    websocketService.connect(Number(roomId), token);

    // 콜백 등록
    websocketService.onConnect(handleWebSocketConnect);
    websocketService.onMessage(handleWebSocketMessage);
    websocketService.onDisconnect(handleWebSocketDisconnect);
    websocketService.onError(handleWebSocketError);
  };

  // WebSocket 콜백 함수들을 별도로 정의
  const handleWebSocketConnect = () => {
    setIsConnected(true);
    setConnectionStatus('연결됨');
    console.log('WebSocket 연결됨');
    
    // 입장 메시지 전송하지 않음 (중복 방지)
    // websocketService.sendMessage({
    //   type: 'ENTER',
    //   roomId: Number(roomId)
    // });
  };

  const handleWebSocketMessage = (data: any) => {
    console.log('새 메시지 수신:', data);
    
    // 내가 보낸 메시지는 무시 (낙관적 업데이트로 이미 표시됨)
    if (data.senderName === userInfo.name) {
      console.log('내가 보낸 메시지 무시:', data.content);
      return;
    }
    
    // 메시지 중복 방지 (같은 ID의 메시지가 이미 있는지 확인)
    if (data.type === 'TALK' || data.type === 'ENTER' || data.type === 'EXIT') {
      setMessages(prev => {
        // prev가 배열인지 확인
        const currentMessages = Array.isArray(prev) ? prev : [];
        // 이미 같은 ID의 메시지가 있는지 확인
        const isDuplicate = currentMessages.some(msg => msg.id === data.id);
        if (isDuplicate) {
          console.log('중복 메시지 무시:', data.id);
          return currentMessages;
        }
        
        // 새로운 메시지 추가
        const newMessage: ChatMessage = {
          id: data.id,
          type: data.type,
          content: data.content,
          senderId: data.senderId || 0,
          senderName: data.senderName,
          roomId: data.roomId,
          sendAt: data.sendAt
        };
        
        return [...currentMessages, newMessage];
      });
    }
  };

  const handleWebSocketDisconnect = () => {
    setIsConnected(false);
    setConnectionStatus('연결 종료됨');
    console.log('WebSocket 연결 종료');
  };

  const handleWebSocketError = (error: Event) => {
    console.error('WebSocket 오류:', error);
    setConnectionStatus('연결 오류');
    setError('채팅 연결에 문제가 발생했습니다. 백엔드 WebSocket 서버가 실행 중인지 확인해주세요.');
  };

  const loadMessages = async () => {
    try {
      console.log('메시지 로드 시작, roomId:', roomId);
      
      const response = await chatApiService.getChatRoomMessages(Number(roomId));
      
      if (response.isSuccess) {
        console.log('메시지 로드 성공:', response.result);
        // API 응답 구조에 맞게 messages 배열 추출
        if (response.result && response.result.messages && Array.isArray(response.result.messages)) {
          // API 응답을 ChatMessage 타입에 맞게 변환
          const formattedMessages: ChatMessage[] = response.result.messages.map((msg: any) => ({
            id: msg.id,
            type: msg.type,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.senderName,
            roomId: msg.roomId,
            sendAt: msg.sendAt
          }));
          
          setMessages(formattedMessages);
          setHasNext(response.result.hasNext);
          console.log('메시지 개수:', formattedMessages.length, 'hasNext:', response.result.hasNext);
        } else {
          console.warn('메시지 응답 구조가 올바르지 않습니다:', response.result);
          setMessages([]);
          setHasNext(false);
        }
      } else {
        setError(response.message || '메시지를 불러오는데 실패했습니다.');
        setMessages([]);
      }
    } catch (err: any) {
      console.error('메시지 로드 오류:', err);
      setError(err.response?.data?.message || '메시지를 불러오는 중 오류가 발생했습니다.');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('사용자 목록 로드 시작, roomId:', roomId);
      
      const response = await chatApiService.getChatRoomUsers(Number(roomId));
      
      if (response.isSuccess) {
        console.log('사용자 목록 로드 성공:', response.result);
        setUsers(response.result);
      }
    } catch (err: any) {
      console.error('사용자 목록 로드 오류:', err);
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasNext || messages.length === 0) return;

    try {
      setIsLoadingMore(true);
      console.log('이전 메시지 로드 시작, roomId:', roomId);
      
      // 가장 오래된 메시지의 시간을 기준으로 이전 메시지 조회
      const oldestMessage = messages[0];
      const lastMessageTime = oldestMessage.sendAt;
      
      const response = await chatApiService.getChatRoomMessages(Number(roomId), lastMessageTime);
      
      if (response.isSuccess) {
        console.log('이전 메시지 로드 성공:', response.result);
        if (response.result && response.result.messages && Array.isArray(response.result.messages)) {
          // API 응답을 ChatMessage 타입에 맞게 변환
          const formattedMessages: ChatMessage[] = response.result.messages.map((msg: any) => ({
            id: msg.id,
            type: msg.type,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.senderName,
            roomId: msg.roomId,
            sendAt: msg.sendAt
          }));
          
          setMessages(prev => [...formattedMessages, ...prev]);
          setHasNext(response.result.hasNext);
          console.log('이전 메시지 개수:', formattedMessages.length, 'hasNext:', response.result.hasNext);
        }
      }
    } catch (err: any) {
      console.error('이전 메시지 로드 오류:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    console.log('메시지 전송:', newMessage);

    // 즉시 화면에 메시지 표시 (낙관적 업데이트)
    const tempMessage: ChatMessage = {
      id: Date.now(), // 임시 ID는 숫자로 설정
      type: 'TALK',
      content: newMessage,
      senderId: userInfo.id || 0,
      senderName: userInfo.name || '',
      roomId: Number(roomId),
      sendAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMessage]);

    // 백엔드 DTO 구조에 맞춰 메시지 전송
    websocketService.sendMessage({
      type: 'TALK',
      roomId: Number(roomId),
      content: newMessage
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const leaveRoom = async () => {
    try {
      console.log('채팅방 나가기 시도, roomId:', roomId);
      
      // 나가기 메시지 전송 (백엔드 DTO 구조에 맞춤)
      websocketService.sendMessage({
        type: 'EXIT',
        roomId: Number(roomId)
      });

      // API 호출로 채팅방 나가기
      const response = await chatApiService.leaveChatRoom(Number(roomId));
      
      if (response.isSuccess) {
        console.log('채팅방 나가기 성공');
      } else {
        console.error('채팅방 나가기 실패:', response.message);
      }
      
      // WebSocket 연결 종료
      websocketService.disconnect();
      
      // 채팅방 목록으로 이동
      navigate('/chatrooms');
    } catch (err: any) {
      console.error('채팅방 나가기 오류:', err);
      setError(err.response?.data?.message || '채팅방을 나가는 중 오류가 발생했습니다.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMyMessage = (message: ChatMessage) => {
    return message.senderName === userInfo.name;
  };

  const isSystemMessage = (message: ChatMessage) => {
    return message.type === 'ENTER' || message.type === 'EXIT';
  };

  useEffect(() => {
    const handleClickModalBg = (e: MouseEvent) => {
      if (
        isModalOpen &&
        modalBg.current &&
        !modalBg.current.contains(e.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickModalBg);
    return () => document.removeEventListener('mousedown', handleClickModalBg);
  }, [isModalOpen]);

  const handleSubmit = () => {
    sendMessage();
  };

  return (
    <div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <BackHeader
            title="동행방 개설"
            isChatRoom={true}
            onClick={() => setIsModalOpen(true)}
          />
          <div className="connection-status flex items-center gap-2 mr-4">
            <span className={`status-indicator w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
            </span>
            <span className="text-sm text-gray-600">{connectionStatus}</span>
          </div>
        </div>
        {error && (
          <div className="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            <p>{error}</p>
            <div className="error-help mt-2">
              <p className="font-semibold">문제 해결 방법:</p>
              <ul className="list-disc list-inside mt-1">
                <li>백엔드 서버가 실행 중인지 확인 (포트 8080)</li>
                <li>WebSocket 서버가 활성화되어 있는지 확인</li>
                <li>네트워크 연결 상태 확인</li>
              </ul>
              <button onClick={connectWebSocket} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                다시 연결 시도
              </button>
            </div>
          </div>
        )}

        <div className="pb-10">
          {isLoading ? (
            <div className="loading text-center py-8">
              <p>채팅방을 불러오는 중...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="no-messages text-center py-8">
              <p>아직 메시지가 없습니다.</p>
              {!isConnected && (
                <p className="connection-warning text-orange-600 mt-2">
                  WebSocket 연결이 필요합니다.
                </p>
              )}
            </div>
          ) : (
            <div className="messages-container" onScroll={handleScroll}>
              {isLoadingMore && (
                <div className="loading-more text-center py-4">
                  <p>이전 메시지를 불러오는 중...</p>
                </div>
              )}
                             {messages.map((message, index) => (
                 <div key={message.id}>
                   {isSystemMessage(message) ? (
                     <div className="system-message-content text-center py-2">
                       <span className="system-text text-sm text-gray-600">
                         {message.type === 'ENTER' ? `${message.senderName}님이 입장하셨습니다.` : 
                          message.type === 'EXIT' ? `${message.senderName}님이 나가셨습니다.` : ''}
                       </span>
                     </div>
                   ) : (
                     <div className={`flex items-end gap-1 pb-4 ${isMyMessage(message) ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                       {!isMyMessage(message) && (
                         <img
                           src="/src/assets/basicProfile.png"
                           alt={`${message.senderName}님의 프로필`}
                           className="w-8 h-8 shrink-0"
                         />
                       )}
                       
                       <div className={`flex flex-col gap-1 ${isMyMessage(message) ? 'items-end' : 'items-start'}`}>
                         {!isMyMessage(message) && (
                           <span className="font-[pretendard] font-normal text-[10px] text-[#262626]">
                             {message.senderName}
                           </span>
                         )}
                         <div className={`flex items-end gap-1 ${isMyMessage(message) ? 'flex-row-reverse' : 'flex-row'}`}>
                           <p
                             className={`max-w-68 px-4 py-2.5 rounded-xl font-[pretendard] font-normal text-sm break-words ${
                               isMyMessage(message)
                                 ? 'bg-[#F78938] text-white rounded-br-md' 
                                 : 'text-black bg-[#F5F5F5] rounded-bl-md'
                             }`}
                           >
                             {message.content}
                           </p>
                           <time className="font-[pretendard] font-normal text-[10px] text-[#B4B4B4] shrink-0">
                             {formatTime(message.sendAt)}
                           </time>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <ChatInput
          message={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSubmit}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
        />
      </div>

      {isModalOpen && (
        <div className="absolute top-0 right-7 w-2/3 h-full">
          <ChatModal ref={modalBg} roomId={roomId} onLeaveRoom={leaveRoom} />
        </div>
      )}
    </div>
  );
}
