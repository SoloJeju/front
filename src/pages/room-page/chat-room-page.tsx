import { useParams, useNavigate } from 'react-router-dom';
import BackHeader from '../../components/common/Headers/BackHeader';
import ChatInput from '../../components/ChatRoomPage/ChatInput';
import { useEffect, useRef, useState } from 'react';
import ChatModal from '../../components/ChatRoomPage/ChatModal';
import chatApiService from '../../services/chat';
import websocketService from '../../services/websocket';
import type { ChatMessage, WebSocketChatMessage } from '../../types/chat';
import { useQueryClient } from '@tanstack/react-query';
import useGetMyChatRooms from '../../hooks/mypage/useGetMyChatRooms';

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const {
    data: myChatRooms,
    isPending: isRoomDetailPending,
  } = useGetMyChatRooms();

  // 해당 채팅방 정보 찾기 (InfiniteQuery 구조에 맞게 수정)
  const room = myChatRooms?.pages?.[0]?.result?.content?.find(
    (room: any) => room.chatRoomId === Number(roomId)
  );

  useEffect(() => {
    if (roomId) {
      enterChatRoom();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [roomId]); // roomId만 의존성으로 설정

  // 채팅방 입장 시퀀스 (가이드 4.1에 따라 구현)
  const enterChatRoom = async () => {
    try {
      // 1-1. 기존 메시지 조회
      await loadMessages();
      
      // 1-2. WebSocket 구독 시작
      if (!isConnected) {
        connectWebSocket();
      }
      
      // 1-3. 읽음 처리 API 호출 (중요!)
      await markMessagesAsRead();
      
      // 1-4. 입장 메시지 전송 (WebSocket 연결 후)
      if (isConnected) {
        sendEnterMessage();
      }
    } catch (error) {
      console.error('채팅방 입장 중 오류:', error);
    }
  };

  // 읽음 처리 API 호출
  const markMessagesAsRead = async () => {
    try {
      const response = await chatApiService.markMessagesAsRead(Number(roomId));
      if (response.isSuccess) {
        console.log('메시지 읽음 처리 완료');
        // 미확인 메시지 상태와 동행방 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
        queryClient.invalidateQueries({ queryKey: ['myChatRooms'] });
      } else {
        console.error('메시지 읽음 처리 실패:', response.message);
      }
    } catch (error) {
      console.error('메시지 읽음 처리 API 오류:', error);
    }
  };

  // 메시지 스크롤시 읽음 처리 (가이드 4.2에 따라 구현)
  const handleMessageScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    
    // 스크롤이 하단에 가까워지면 읽음 처리
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    
    if (isNearBottom) {
      // 스크롤이 하단에 가까우면 읽음 처리 (가이드 4.2에 따라)
      markMessagesAsRead();
    }
    
    
    // 기존 무한 스크롤 로직
    if (target.scrollTop === 0 && hasNext && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  // 입장 메시지 전송
  const sendEnterMessage = () => {
    if (isConnected) {
      websocketService.sendMessage({
        type: 'ENTER',
        roomId: Number(roomId)
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 스크롤 이벤트 핸들러 (읽음 처리 포함)
  const handleScroll = handleMessageScroll;

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

    websocketService.connect(Number(roomId), token);
    
    // WebSocket 콜백 등록
    websocketService.onConnect(() => {
      console.log('WebSocket 연결 성공');
      setIsConnected(true);
      setError('');
    });
    
    websocketService.onMessage((data: WebSocketChatMessage) => {
      console.log('WebSocket 메시지 수신:', data);
      
    
      // 현재 사용자 정보 가져오기
      const currentUserId = localStorage.getItem('userId');
      
     
      // 내가 보낸 메시지는 WebSocket으로 받지 않음 (이미 UI에 추가했으므로)
      if (data.senderId === Number(currentUserId)) {
        console.log('내가 보낸 메시지 무시:', data.content);
        return;
      }
      
      if (data.type === 'TALK') {
        const newChatMessage: ChatMessage = {
          id: data.id,
          content: data.content,
          senderName: data.senderName,
          sendAt: data.sendAt,
          type: 'TALK',
          roomId: data.roomId,
          senderId: data.senderId || 0,
          senderProfileImage: data.senderProfileImage,
          image: data.image,
          isMine: false
        };
        
        setMessages(prev => [...prev, newChatMessage]);
      } else if (data.type === 'ENTER') {
        const enterMessage: ChatMessage = {
          id: data.id,
          content: '',
          senderName: data.senderName || '알 수 없는 사용자',
          sendAt: data.sendAt,
          type: 'ENTER',
          roomId: data.roomId,
          senderId: data.senderId || 0,
          senderProfileImage: data.senderProfileImage,
          image: data.image,
          isMine: false
        };
        
        setMessages(prev => [...prev, enterMessage]);
      } else if (data.type === 'EXIT') {
        const exitMessage: ChatMessage = {
          id: data.id,
          content: '',
          senderName: data.senderName || '알 수 없는 사용자',
          sendAt: data.sendAt,
          type: 'EXIT',
          roomId: data.roomId,
          senderId: data.senderId || 0,
          senderProfileImage: data.senderProfileImage,
          image: data.image,
          isMine: false
        };
        
        setMessages(prev => [...prev, exitMessage]);
      }
    });
    
    websocketService.onDisconnect(() => {
      console.log('WebSocket 연결 종료');
      setIsConnected(false);
      setError('WebSocket 연결이 종료되었습니다.');
    });
    
    websocketService.onError((error: Event) => {
      console.error('WebSocket 오류:', error);
      setIsConnected(false);
      setError('WebSocket 연결 중 오류가 발생했습니다.');
    });
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await chatApiService.getChatRoomMessages(Number(roomId));
      
      if (response.isSuccess) {
        setMessages(response.result.messages);
        setHasNext(response.result.hasNext);
        console.log('채팅 메시지 로드 성공:', response.result);
      } else {
        setError(response.message || '메시지를 불러오는데 실패했습니다.');
      }
    } catch (err: any) {
      console.error('채팅 메시지 로드 오류:', err);
      setError(err.response?.data?.message || '메시지를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasNext) return;
    
    try {
      setIsLoadingMore(true);
      const oldestMessageTime = messages[0]?.sendAt;
      
      if (!oldestMessageTime) {
        setIsLoadingMore(false);
        return;
      }
      
      const response = await chatApiService.getChatRoomMessages(Number(roomId), oldestMessageTime);
      
      if (response.isSuccess) {
        setMessages(prev => [...response.result.messages, ...prev]);
        setHasNext(response.result.hasNext);
        console.log('이전 메시지 로드 성공:', response.result);
      } else {
        console.error('이전 메시지 로드 실패:', response.message);
      }
    } catch (err: any) {
      console.error('이전 메시지 로드 오류:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;
    
    const messageData = {
      type: 'TALK' as const,
      roomId: Number(roomId),
      content: newMessage.trim()
    };
    
    // 내가 보낸 메시지를 즉시 UI에 추가
    const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const myMessage: ChatMessage = {
      id: Date.now().toString(), // 임시 ID
      content: newMessage.trim(),
      senderName: currentUserInfo.name || '나',
      sendAt: new Date().toISOString(),
      type: 'TALK',
      roomId: Number(roomId),
      senderId: currentUserInfo.userId || 0,
      senderProfileImage: currentUserInfo.profileImage,
      image: null,
      isMine: true
    };
    
    setMessages(prev => [...prev, myMessage]);
    setNewMessage('');
    
    // WebSocket으로 메시지 전송
    websocketService.sendMessage(messageData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isMyMessage = (message: ChatMessage) => {
    return message.isMine;
  };

  const isSystemMessage = (message: ChatMessage) => {
    return message.type === 'ENTER' || message.type === 'EXIT';
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    
    return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  // 날짜 포맷팅 함수
  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}년 ${month}월 ${day}일`;
  };

  // 날짜 구분선이 필요한지 확인하는 함수
  const shouldShowDateDivider = (currentMessage: ChatMessage, previousMessage: ChatMessage | null) => {
    if (!previousMessage) return true; // 첫 번째 메시지는 항상 날짜 표시
    
    const currentDate = new Date(currentMessage.sendAt).toDateString();
    const previousDate = new Date(previousMessage.sendAt).toDateString();
    
    return currentDate !== previousDate;
  };

  const leaveRoom = async () => {
    try {
      const response = await chatApiService.leaveChatRoom(Number(roomId));
      if (response.isSuccess) {
        console.log('채팅방 나가기 성공');
        websocketService.disconnect();
        navigate('/mypage/rooms');
      } else {
        console.error('채팅방 나가기 실패:', response.message);
      }
    } catch (error) {
      console.error('채팅방 나가기 API 오류:', error);
    }
  };

  useEffect(() => {
    const handleClickModalBg = (e: MouseEvent) => {
      if (modalBg.current && e.target === modalBg.current) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickModalBg);
    return () => document.removeEventListener('mousedown', handleClickModalBg);
  }, [isModalOpen]);

  const handleSubmit = () => {
    sendMessage();
  };

  // 헤더 제목 결정
  const headerTitle = room?.title || '동행방';

  return (
    <div className="min-h-screen bg-white">
      {/* 고정된 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50">
        <BackHeader
          title={headerTitle}
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
              {messages.map((message, index) => {
                const previousMessage = index > 0 ? messages[index - 1] : null;
                const showDateDivider = shouldShowDateDivider(message, previousMessage);
                
                return (
                  <div key={message.id}>
                    {/* 날짜 구분선 */}
                    {showDateDivider && (
                      <div className="flex justify-center py-4">
                        <div className="text-gray-600 text-xs font-[pretendard]">
                          {formatDate(message.sendAt)}
                        </div>
                      </div>
                    )}
                    
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
                );
              })}
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
          <ChatModal ref={modalBg} roomId={roomId} onLeaveRoom={leaveRoom} onClose={() => setIsModalOpen(false)} />
        </div>
      )}
    </div>
  );
}
