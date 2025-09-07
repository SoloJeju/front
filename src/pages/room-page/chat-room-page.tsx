import { useParams, useNavigate } from 'react-router-dom';
import BackHeader from '../../components/common/Headers/BackHeader';
import ChatInput from '../../components/ChatRoomPage/ChatInput';
import { useEffect, useRef, useState, useCallback } from 'react';
import ChatModal from '../../components/ChatRoomPage/ChatModal';
import chatApiService from '../../services/chat';
import websocketService from '../../services/websocket';
import type { ChatMessage, WebSocketChatMessage } from '../../types/chat';
import type { MyChatRoom } from '../../types/home';
import { useQueryClient } from '@tanstack/react-query';
import useGetMyChatRooms from '../../hooks/mypage/useGetMyChatRooms';
import { useLocation } from 'react-router-dom';
import ModalPortal from '../../components/ChatRoomPage/ModalPortal';


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
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 초기 로딩 상태 추가
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const HEADER_H = 56;   // BackHeader 실제 높이에 맞춰 조정 (예: 56~64)
  const INPUT_BAR_H = 64;
  const TOP_OFFSET = 100;
  const headerRef = useRef<HTMLDivElement | null>(null);
const [headerH, setHeaderH] = useState(56); // BackHeader 실제 높이 측정값

const [kb, setKb] = useState(0);

const location = useLocation();
const isCompletedFromState = location.state?.isCompleted || false;

useEffect(() => {
  // BackHeader 실제 렌더 높이 측정
  const measure = () => {
    if (headerRef.current) {
      const h = headerRef.current.getBoundingClientRect().height;
      setHeaderH(Math.round(h));
    }
  };
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('orientationchange', measure);
  return () => {
    window.removeEventListener('resize', measure);
    window.removeEventListener('orientationchange', measure);
  };
}, []);

// kb(키보드 높이) 바뀔 때도 스크롤 영역 재계산을 위해 한번 더
useEffect(() => {
  if (headerRef.current) {
    const h = headerRef.current.getBoundingClientRect().height;
    setHeaderH(Math.round(h));
  }
}, [kb]);

// 모바일 키보드 높이 감지 (작은 변동 무시)
useEffect(() => {
  const vv = (window as any).visualViewport;
  if (!vv) return;

  const onResize = () => {
    const raw = Math.max(0, window.innerHeight - vv.height - (vv.offsetTop || 0));
    const CLAMP = 80; // 80px 미만 변화는 주소창/툴바로 간주 → 무시
    setKb(raw > CLAMP ? raw : 0);
  };

  vv.addEventListener('resize', onResize);
  vv.addEventListener('scroll', onResize);
  onResize();

  return () => {
    vv.removeEventListener('resize', onResize);
    vv.removeEventListener('scroll', onResize);
  };
}, []);

useEffect(() => {
  if (isCompletedFromState) {
    setIsCompleted(true);
  }
}, [isCompletedFromState]);
  const {
    data: myChatRooms,
  } = useGetMyChatRooms();

  // 해당 채팅방 정보 찾기 (roomId로 찾기)
  const room = myChatRooms?.pages?.[0]?.result?.content?.find(
    (room: MyChatRoom) => room.roomId === Number(roomId)
  );

  // 읽음 처리 API 호출
  const markMessagesAsRead = useCallback(async () => {
    try {
      const response = await chatApiService.markMessagesAsRead(Number(roomId));
      if (response.isSuccess) {
        
        // 미확인 메시지 상태와 동행방 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
        queryClient.invalidateQueries({ queryKey: ['myChatRooms'] });
      } else {
        console.error('메시지 읽음 처리 실패:', response.message);
      }
    } catch (error) {
      console.error('메시지 읽음 처리 API 오류:', error);
    }
  }, [roomId, queryClient]);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await chatApiService.getChatRoomMessages(Number(roomId), undefined, 20);

      if (response.isSuccess) {
        // 시간 오름차순 정렬(보장)
        const sorted = [...response.result.messages].sort(
          (a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime()
        );
        setMessages(sorted);
        setHasNext(response.result.hasNext);

        // ✅ 초기에는 바로 맨 아래로 (부드럽지 않게 'auto'가 깔끔)
        requestAnimationFrame(() => scrollToBottom(false));
      } else {
        setError(response.message || '메시지를 불러오는데 실패했습니다.');
      }

    } catch (err: unknown) {
      console.error('채팅 메시지 로드 오류:', err);
      setError('메시지를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('인증 토큰이 없습니다.');
      return;
    }

    // 이미 연결된 상태라면 중복 연결 방지
    if (isConnected) {
      return;
    }

    console.log("ROOMID: ",roomId);
    if (!roomId) {
  console.error("roomId가 비어있음, WebSocket 연결 불가");
      return;
    }
    websocketService.connect(Number(roomId), token);

    
    // WebSocket 콜백 등록
    websocketService.onConnect(() => {
     
      setIsConnected(true);
      setError('');
    });
    
    websocketService.onMessage((data: WebSocketChatMessage) => {
     
      
    
      // 현재 사용자 정보 가져오기
      const currentUserId = localStorage.getItem('userId');
      
     
      // 내가 보낸 메시지는 WebSocket으로 받지 않음 (이미 UI에 추가했으므로)
      if (data.senderId === Number(currentUserId)) {
       
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
        
       setMessages(prev => {
      const combined = [...prev, newChatMessage];
      // id 중복 제거
      return Array.from(new Map(combined.map(m => [m.id, m])).values());
    });
        
        // 다른 사람의 메시지가 왔을 때는 자동 스크롤하지 않음 (사용자가 스크롤 위치를 유지할 수 있도록)
      } else if (data.type === 'ENTER') {
        const enterMessage: ChatMessage = {
          id: data.id,
          content: data.content,
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
          content: data.content,
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
      setIsConnected(false);
      setError('WebSocket 연결이 종료되었습니다.');
    });
    
    websocketService.onError((error: Event) => {
      console.error('WebSocket 오류:', error);
      setIsConnected(false);
      setError('WebSocket 연결 중 오류가 발생했습니다.');
    });
  }, [roomId, isConnected]);

  // 입장 메시지 전송
  const sendEnterMessage = useCallback(() => {
     if (!newMessage.trim() || !isConnected || isCompleted) return;
    if (isConnected) {
      websocketService.sendMessage({
        type: 'ENTER',
        roomId: Number(roomId)
      });
    }
  }, [isConnected, roomId]);

  // 채팅방 입장 시퀀스 (가이드 4.1에 따라 구현)
  const enterChatRoom = useCallback(async () => {
    try {
      // 1-1. 기존 메시지 조회
      await loadMessages();
      
      // 1-2. WebSocket 구독 시작
      if (!isConnected) {
        connectWebSocket();
      }
      
      // 1-3. 읽음 처리 API 호출 (중요!)
       setTimeout(async () => {
      await markMessagesAsRead();
      
    }, 300); // scrollToBottom 실행 후 약간 지연
      
     
    } catch (error) {
      console.error('채팅방 입장 중 오류:', error);
    }
  }, [isConnected, loadMessages, connectWebSocket, markMessagesAsRead, sendEnterMessage]);

  useEffect(() => {
    if (roomId) {
      enterChatRoom();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [roomId]); // roomId와 enterChatRoom을 의존성으로 설정

  // 메시지 스크롤시 읽음 처리 및 무한 스크롤 (가이드 4.2에 따라 구현)
  const handleMessageScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    
    // 스크롤이 하단에 가까워지면 읽음 처리
   const isNearBottom = () => {
      if (!listRef.current) return false;
      const el = listRef.current;
      return el.scrollHeight - el.scrollTop - el.clientHeight < 120; // 임계값
    };

    if (isNearBottom()) {
       markMessagesAsRead();
    }

    
    // 무한 스크롤 로직 - 스크롤이 맨 위에 가까워지면 이전 메시지 로드
    const isNearTop = target.scrollTop < 100; // 감지 범위를 늘림
    
    if (isNearTop && hasNext && !isLoadingMore) {
    
      loadMoreMessages();
    }
  };

  // 초기 로딩 완료 시에만 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messages.length > 0 && !isLoading && !isLoadingMore && isInitialLoad) {
      // 초기 로딩이 완료되었을 때만 스크롤을 맨 아래로 이동
    
      setTimeout(() => {
        scrollToBottom();
        setIsInitialLoad(false); // 초기 로딩 완료 표시
      }, 200);
    }
  }, [messages.length, isLoading, isLoadingMore, isInitialLoad]);

  // 스크롤 이벤트 핸들러 (읽음 처리 포함)
  const handleScroll = handleMessageScroll;

const loadMoreMessages = async () => {
  if (isLoadingMore || !hasNext) return;
  if (!listRef.current) return;

  try {
    setIsLoadingMore(true);

    const container = listRef.current;
    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;

    const oldestMessageTime = messages[0]?.sendAt;
    if (!oldestMessageTime) {
      setIsLoadingMore(false);
      return;
    }

    const response = await chatApiService.getChatRoomMessages(
      Number(roomId),
      oldestMessageTime,
      20
    );

    if (response.isSuccess) {
      setMessages((prev) => {
        const combined = [...response.result.messages, ...prev];
        const unique = Array.from(new Map(combined.map((m) => [m.id, m])).values());
        // 시간 오름차순 정렬 유지
        return unique.sort(
          (a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime()
        );
      });
      setHasNext(response.result.hasNext);

      // ✅ prepend 후 위치 보정
      requestAnimationFrame(() => {
        if (!listRef.current) return;
        const newScrollHeight = listRef.current.scrollHeight;
        listRef.current.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
      });
    } else {
      console.error('이전 메시지 로드 실패:', response.message);
    }
  } catch (err) {
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
    
    // 내가 메시지를 보낼 때는 항상 스크롤을 맨 아래로 이동
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    // WebSocket으로 메시지 전송
    websocketService.sendMessage(messageData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = (smooth: boolean = true) => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  }
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

  useEffect(() => {
  if (!topSentinelRef.current || !listRef.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNext && !isLoadingMore) {
        // 위에 닿으면 추가 로드
        loadMoreMessages();
      }
    },
    {
      root: listRef.current,
      threshold: 0,
    }
  );

  observer.observe(topSentinelRef.current);
  return () => observer.disconnect();
}, [hasNext, isLoadingMore, loadMoreMessages]);


  const handleSubmit = () => {
    sendMessage();
  };

  // 헤더 제목 결정 - 실제 채팅방 제목 사용
  const headerTitle = room?.title || '동행방';

  return (
    // 1) 최상단: 모바일 100vh 버그 회피 (dvh) + overflow-x만 숨김
    <div className="flex justify-center bg-white h-[100dvh] overflow-x-hidden">
      {/* 내부 컨테이너: 상대위치 필요 (fixed 중앙정렬용) */}
      <div className="relative w-full max-w-[480px] bg-white flex flex-col h-full">

        {/* 헤더 - 고정 */} 
        <div className="flex-shrink-0 bg-white border-b border-gray-200 sticky top-0 z-90"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}> 
          <div className="mx-auto w-full max-w-[480px]">
          <BackHeader
            title={headerTitle}
            isChatRoom={true}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        </div>

        {/* 3) 메시지 영역: 유일한 세로 스크롤러 */}
        <div
          className="flex-1 min-h-0"
          // overscroll-behavior로 상단/하단 탄성 스크롤 부작용 방지
          style={{ overscrollBehavior: 'contain' }}
        >
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto px-4"
            style={{
                paddingTop: `${HEADER_H+100}px`,
              paddingBottom: `calc(${INPUT_BAR_H}px + ${kb}px + env(safe-area-inset-bottom, 0px) + 8px)`,
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}
          >

            {error && (
              <div className="p-4 mt-4 mb-4 mx-0 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{error}</p>
                <div className="mt-2">
                  <p className="font-semibold">문제 해결 방법:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>백엔드 서버 (8080) 확인</li>
                    <li>WebSocket 서버 활성화 확인</li>
                    <li>네트워크 상태 확인</li>
                  </ul>
                  <button
                    onClick={connectWebSocket}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    다시 연결 시도
                  </button>
                </div>
                  <div ref={messagesEndRef} />
              </div>
            )}

            <div className="pt-2 pb-2">
              {isLoading ? (
                <div className="text-center py-8">채팅방을 불러오는 중...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p>아직 메시지가 없습니다.</p>
                  {!isConnected && (
                    <p className="text-orange-600 mt-2">WebSocket 연결이 필요합니다.</p>
                  )}
                </div>
              ) : (
                <>
                  {isLoadingMore && (
                    <div className="text-center py-2">이전 메시지를 불러오는 중...</div>
                  )}

                  {messages.map((message, index) => {
                    const previousMessage = index > 0 ? messages[index - 1] : null;
                    const showDateDivider = shouldShowDateDivider(message, previousMessage);

                    return (
                      <div key={message.id} className="w-full">
                        {showDateDivider && (
                          <div className="flex justify-center py-2">
                            <div className="text-gray-600 text-xs font-[pretendard]">
                              {formatDate(message.sendAt)}
                            </div>
                          </div>
                        )}

                        {isSystemMessage(message) ? (
                          <div className="text-center py-1 mb-1">
                            <span className="text-xs text-gray-500">{message.content}</span>
                          </div>
                        ) : (
                          <div
                            className={`flex items-end gap-1 pb-1 w-full ${
                              isMyMessage(message) ? 'flex-row-reverse ml-auto' : 'justify-start'
                            }`}
                          >
                            {!isMyMessage(message) && (
                              <img
                                src="/src/assets/basicProfile.png"
                                alt={`${message.senderName}님의 프로필`}
                                className="w-8 h-8 shrink-0"
                              />
                            )}

                            <div
                              className={`flex flex-col gap-1 ${
                                isMyMessage(message) ? 'items-end' : 'items-start'
                              }`}
                            >
                              {!isMyMessage(message) && (
                                <span className="font-[pretendard] font-normal text-[10px] text-[#262626]">
                                  {message.senderName}
                                </span>
                              )}
                              <div
                                className={`flex items-end gap-1 ${
                                  isMyMessage(message) ? 'flex-row-reverse' : 'flex-row'
                                }`}
                              >
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
                </>
              )}
            </div>
          </div>
        </div>

       {/* 고정 입력바 */}
        <div
          className="fixed inset-x-0 z-[80] bg-white border-t border-gray-200"
          style={{
            bottom: `calc(${kb}px + env(safe-area-inset-bottom, 0px))`,
            transform: 'translateZ(0)', // iOS 레이어 안정화
          }}
        >
          <div className="mx-auto w-full max-w-[480px] px-4 py-2" style={{ height: INPUT_BAR_H }}>
            <ChatInput
              message={newMessage}
              onChange={setNewMessage}
              onSubmit={handleSubmit}
              onKeyPress={handleKeyPress}
              disabled={!isConnected || isCompleted}
            />
          </div>
        </div>



        {isModalOpen && (
          <ModalPortal>
            <ChatModal
              panelRef={modalBg}          // ← 이름 바뀜 (아래 2번 참고)
              roomId={roomId}
              onLeaveRoom={leaveRoom}
              onClose={() => setIsModalOpen(false)}
            />
          </ModalPortal>
        )}

      </div>
    </div>
  );
}