import { useParams, useNavigate } from 'react-router-dom';
import BackHeader from '../../components/common/Headers/BackHeader';
import ChatInput from '../../components/ChatRoomPage/ChatInput';
import { useEffect, useRef, useState } from 'react';
import ChatModal from '../../components/ChatRoomPage/ChatModal';
import chatApiService from '../../services/chat';
import websocketService from '../../services/websocket';
import type { ChatMessage, WebSocketChatMessage } from '../../types/chat';



export default function ChatRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalBg = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');


  useEffect(() => {
    if (roomId) {
      loadMessages();
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

    // 이미 연결된 상태라면 중복 연결 방지
    if (isConnected) {
      return;
    }
    


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


    
    // 입장 메시지 전송하지 않음 (중복 방지)
    // websocketService.sendMessage({
    //   type: 'ENTER',
    //   roomId: Number(roomId)
    // });
  };

  const handleWebSocketMessage = (data: WebSocketChatMessage) => {


    // 내가 보낸 메시지인지 senderId 기준으로 확인
    const userId = localStorage.getItem('userId');
    if (userId && data.senderId && Number(userId) === data.senderId) {
      // console.log('내가 보낸 메시지 무시 (senderId:', data.senderId, 'content:', data.content, ')');
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
          return currentMessages;
        }
        
        // WebSocket 메시지를 ChatMessage로 변환 (isMine 계산)
        const newMessage: ChatMessage = {
          id: data.id,
          type: data.type,
          content: data.content,
          senderId: data.senderId || 0,
          senderName: data.senderName,
          roomId: data.roomId,
          sendAt: data.sendAt,
          senderProfileImage: data.senderProfileImage,
          image: data.image,
          isMine: false // 수신된 메시지는 항상 false (내가 보낸 메시지는 이미 스킵됨)
        };
        
        // 처리된 메시지 ID에 추가

      
        return [...currentMessages, newMessage];
      });
    }
  };

  const handleWebSocketDisconnect = () => {
    setIsConnected(false);

   
  };

  const handleWebSocketError = (error: Event) => {
    console.error('WebSocket 오류:', error);

    setError('채팅 연결에 문제가 발생했습니다. 백엔드 WebSocket 서버가 실행 중인지 확인해주세요.');
  };

  const loadMessages = async () => {
    try {

      
      const response = await chatApiService.getChatRoomMessages(Number(roomId));
      
      if (response.isSuccess) {
       
        // API 응답 구조에 맞게 messages 배열 추출
        if (response.result && response.result.messages && Array.isArray(response.result.messages)) {
          // API 응답을 ChatMessage 타입에 맞게 변환 (API에는 이미 isMine이 포함됨)
          const formattedMessages: ChatMessage[] = response.result.messages.map((msg: any) => ({
            id: String(msg.id),
            type: msg.type,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.senderName,
            roomId: msg.roomId,
            sendAt: msg.sendAt,
            senderProfileImage: msg.senderProfileImage,
            image: msg.image,
            isMine: msg.isMine
          }));
          
          setMessages(formattedMessages);
          setHasNext(response.result.hasNext);
         
        } else {
          
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



  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasNext || messages.length === 0) return;

    try {
      setIsLoadingMore(true);

      
      // 가장 오래된 메시지의 시간을 기준으로 이전 메시지 조회
      const oldestMessage = messages[0];
      const lastMessageTime = oldestMessage.sendAt;
      
      const response = await chatApiService.getChatRoomMessages(Number(roomId), lastMessageTime);
      
      if (response.isSuccess) {
    
        if (response.result && response.result.messages && Array.isArray(response.result.messages)) {
          // API 응답을 ChatMessage 타입에 맞게 변환 (API에는 이미 isMine이 포함됨)
          const formattedMessages: ChatMessage[] = response.result.messages.map((msg: any) => ({
            id: String(msg.id),
            type: msg.type,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.senderName,
            roomId: msg.roomId,
            sendAt: msg.sendAt,
            senderProfileImage: msg.senderProfileImage,
            image: msg.image,
            isMine: msg.isMine
          }));
          
          setMessages(prev => [...formattedMessages, ...prev]);
          setHasNext(response.result.hasNext);
        
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

  
    // 고유한 임시 ID 생성 (타임스탬프 + 랜덤 숫자)
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 즉시 화면에 메시지 표시 (낙관적 업데이트)
    const tempMessage: ChatMessage = {
      id: tempId,
      type: 'TALK',
      content: newMessage,
      senderId: userInfo.id || 0,
      senderName: userInfo.name || '',
      roomId: Number(roomId),
      sendAt: new Date().toISOString(),
      senderProfileImage: userInfo.profileImage || null,
      image: null,
      isMine: true
    };

    setMessages(prev => [...prev, tempMessage]);
    
    // 임시 ID를 대기 중인 메시지 ID 목록에 추가
    

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
      
      
      // 나가기 메시지 전송 (백엔드 DTO 구조에 맞춤)
      websocketService.sendMessage({
        type: 'EXIT',
        roomId: Number(roomId)
      });

      // API 호출로 채팅방 나가기
      const response = await chatApiService.leaveChatRoom(Number(roomId));
      
      if (response.isSuccess) {
      
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
    return message.isMine;
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
    <div className="min-h-screen bg-white">
      {/* 고정된 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50">
        <BackHeader
          title="동행방 개설"
          isChatRoom={true}
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* 메시지 영역 - 헤더 높이만큼 상단 여백 */}
      <div className="pt-16 px-4 pb-20">
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

        <div>
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
                             {messages.map((message) => (
                 <div key={message.id}>
                   {isSystemMessage(message) ? (
                     <div className="system-message-content text-center py-2">
                       <span className="system-text text-sm text-gray-600">
                         {message.type === 'ENTER' ? `${message.senderName}님이 입장하셨습니다.` : 
                          message.type === 'EXIT' ? `${message.senderName}님이 나가셨습니다.` : ''}
                       </span>
                     </div>
                   ) : (
                     <div className={`flex items-end gap-1 pb-4 w-full ${isMyMessage(message) ? 'flex-row-reverse ml-auto' : 'justify-start'}`}>
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
      </div>

      {/* 고정된 입력 영역 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <ChatInput
          message={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSubmit}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
        />
      </div>

      {isModalOpen && (
        <div className="fixed top-0 right-0 w-2/3 h-full z-50">
          <ChatModal ref={modalBg} roomId={roomId} onLeaveRoom={leaveRoom} />
        </div>
      )}
    </div>
  );
}
