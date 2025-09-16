// src/pages/chat/ChatRoomPage.tsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BackHeader from '../../components/common/Headers/BackHeader';
import ChatInput from '../../components/ChatRoomPage/ChatInput';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ChatModal from '../../components/ChatRoomPage/ChatModal';
import chatApiService from '../../services/chat';
import websocketService from '../../services/websocket';
import type {
  ChatMessage,
  WebSocketChatMessage,
  ChatRoomUsersResponse,
} from '../../types/chat';
import type { MyChatRoom } from '../../types/home';
import { useQueryClient } from '@tanstack/react-query';
import useGetMyChatRooms from '../../hooks/mypage/useGetMyChatRooms';
import ModalPortal from '../../components/ChatRoomPage/ModalPortal';
import { debounce } from 'lodash';
import BasicProfile from '/src/assets/basicProfile.png';

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
  const [hasNext, setHasNext] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const isConnectedRef = useRef(false);           // 연결 상태 ref (중복 connect 방지)
  const wsHandlersBoundRef = useRef(false);       // 핸들러 1회만 바인딩

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);

  const HEADER_H = 56;
  const INPUT_BAR_H = 64;
  const [kb, setKb] = useState(0);

  const location = useLocation();
  const isCompletedFromState = (location.state as any)?.isCompleted || false;

  // ---- 참여자 목록 (아바타/닉네임 매핑) ----
  const [usersData, setUsersData] = useState<ChatRoomUsersResponse | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  const loadChatRoomUsers = useCallback(async () => {
    if (!roomId) return;
    try {
      setIsUsersLoading(true);
      const response = await chatApiService.getChatRoomUsers(Number(roomId));
      if (response.isSuccess) {
        setUsersData(response.result);
      }
    } catch (err) {
      console.error('채팅방 사용자 목록 로드 오류:', err);
    } finally {
      setIsUsersLoading(false);
    }
  }, [roomId]);

  const userProfileMap = useMemo(() => {
    const map = new Map<number, { profileImage: string | null; username: string }>();
    if (usersData?.users) {
      for (const member of usersData.users) {
        map.set(member.userId, {
          profileImage: member.profileImage,
          username: member.username,
        });
      }
    }
    return map;
  }, [usersData]);

  const getSenderMeta = useCallback(
    (
      senderId: number,
      fallbackName?: string,
      fallbackImage?: string | null
    ): { name: string; avatar: string } => {
      const fromMap = userProfileMap.get(senderId);
      const name = fromMap?.username ?? fallbackName ?? '사용자';
      const avatar = fromMap?.profileImage ?? fallbackImage ?? BasicProfile;
      return { name, avatar };
    },
    [userProfileMap]
  );

  // ---- 키보드/스크롤 환경 ----
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;
    const onResize = () => {
      const raw = Math.max(0, window.innerHeight - vv.height - (vv.offsetTop || 0));
      const CLAMP = 80;
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
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (isCompletedFromState) {
      setIsCompleted(true);
    }
  }, [isCompletedFromState]);

  // ---- 방 정보 ----
  const { data: myChatRooms } = useGetMyChatRooms();
  const room = myChatRooms?.pages?.[0]?.result?.content?.find(
    (r: MyChatRoom) => r.roomId === Number(roomId)
  );

  // ---- 읽음 처리 ----
  const markMessagesAsRead = useCallback(async () => {
    try {
      const response = await chatApiService.markMessagesAsRead(Number(roomId));
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
        queryClient.invalidateQueries({ queryKey: ['myChatRooms'] });
      }
    } catch (err) {
      console.error('메시지 읽음 처리 API 오류:', err);
    }
  }, [roomId, queryClient]);

  // ---- 메시지 초기 로드 ----
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await chatApiService.getChatRoomMessages(Number(roomId), undefined, 20);
      if (response.isSuccess) {
        const sorted = [...response.result.messages].sort(
          (a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime()
        );
        setMessages(sorted);
        setHasNext(response.result.hasNext);
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

  // ---- WebSocket: 핸들러 1회 바인딩 ----
  const bindWsHandlersOnce = useCallback(() => {
    if (wsHandlersBoundRef.current) return;

    websocketService.onConnect(() => {
      setIsConnected(true);
      isConnectedRef.current = true;
      setError('');
    });

    websocketService.onMessage((data: WebSocketChatMessage) => {
      const currentUserId = localStorage.getItem('userId');
      if (data.senderId === Number(currentUserId)) return;

      if (data.type === 'TALK' || data.type === 'ENTER' || data.type === 'EXIT') {
        const newChatMessage: ChatMessage = {
          id: data.id,
          content: data.content,
          senderName: data.senderName,
          sendAt: data.sendAt,
          type: data.type,
          roomId: data.roomId,
          senderId: data.senderId || 0,
          senderProfileImage: data.senderProfileImage,
          image: data.image,
          isMine: false,
        };

        setMessages(prev => {
          const combined = [...prev, newChatMessage];
          return Array.from(new Map(combined.map(m => [m.id, m])).values());
        });

        // 참여자 변동 가능성 있을 때 갱신 (선택)
        if (data.type === 'ENTER' || data.type === 'EXIT') {
          loadChatRoomUsers();
        }
      }
    });

    websocketService.onDisconnect(() => {
      setIsConnected(false);
      isConnectedRef.current = false;
      setError('WebSocket 연결이 종료되었습니다.');
    });

    websocketService.onError((e: Event) => {
      console.error('WebSocket 오류:', e);
      setIsConnected(false);
      isConnectedRef.current = false;
      setError('WebSocket 연결 중 오류가 발생했습니다.');
    });

    wsHandlersBoundRef.current = true;
  }, [loadChatRoomUsers]);

  // ---- WebSocket 연결 ----
  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('인증 토큰이 없습니다.');
      return;
    }
    if (isConnectedRef.current) return; // 중복 연결 방지
    if (!roomId) {
      console.error('roomId가 비어있음, WebSocket 연결 불가');
      return;
    }

    bindWsHandlersOnce(); // 먼저 핸들러를 1회만 바인딩
    websocketService.connect(Number(roomId), token);
  }, [roomId, bindWsHandlersOnce]);

  // 재연결 버튼에서 사용
  const retryConnect = useCallback(() => {
    websocketService.disconnect();
    isConnectedRef.current = false;
    connectWebSocket();
  }, [connectWebSocket]);

  // ---- 입장 시퀀스 ----
  const enterChatRoom = useCallback(async () => {
    if (!roomId) return;
    await Promise.all([loadMessages(), loadChatRoomUsers()]);
    connectWebSocket();
    setTimeout(markMessagesAsRead, 300);
  }, [roomId, loadMessages, loadChatRoomUsers, connectWebSocket, markMessagesAsRead]);

  useEffect(() => {
    if (roomId) {
      enterChatRoom();
    }
    return () => {
      websocketService.disconnect();
      isConnectedRef.current = false;
    };
  }, [roomId, enterChatRoom]);

  // ---- 스크롤/읽음 처리 ----
  const debouncedMarkMessagesAsRead = useMemo(
    () =>
      debounce(() => {
        markMessagesAsRead();
      }, 500),
    [markMessagesAsRead]
  );

  const handleMessageScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    const isNearBottom = () => {
      if (!listRef.current) return false;
      const el = listRef.current;
      return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    };
    if (isNearBottom()) {
      debouncedMarkMessagesAsRead();
    }

    const isNearTop = target.scrollTop < 100;
    if (isNearTop && hasNext && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  useEffect(() => {
    if (messages.length > 0 && !isLoading && !isLoadingMore && isInitialLoad) {
      setTimeout(() => {
        scrollToBottom();
        setIsInitialLoad(false);
      }, 200);
    }
  }, [messages.length, isLoading, isLoadingMore, isInitialLoad]);

  // ---- 이전 메시지 로드 ----
  const loadMoreMessages = useCallback(async () => {
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
        setMessages(prev => {
          const combined = [...response.result.messages, ...prev];
          const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
          return unique.sort(
            (a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime()
          );
        });
        setHasNext(response.result.hasNext);

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
      setTimeout(() => setIsLoadingMore(false), 200);
    }
  }, [isLoadingMore, hasNext, messages, roomId]);

  // ---- 전송 ----
  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    const messageData = {
      type: 'TALK' as const,
      roomId: Number(roomId),
      content: newMessage.trim(),
    };

    const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const myMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderName: currentUserInfo.name || '나',
      sendAt: new Date().toISOString(),
      type: 'TALK',
      roomId: Number(roomId),
      senderId: currentUserInfo.userId || 0,
      senderProfileImage: currentUserInfo.profileImage,
      image: null,
      isMine: true,
    };

    setMessages(prev => [...prev, myMessage]);
    setNewMessage('');
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    websocketService.sendMessage(messageData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ---- 유틸 ----
  const scrollToBottom = (smooth: boolean = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  const isMyMessage = (message: ChatMessage) => message.isMine;
  const isSystemMessage = (message: ChatMessage) =>
    message.type === 'ENTER' || message.type === 'EXIT';

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const shouldShowDateDivider = (
    currentMessage: ChatMessage,
    previousMessage: ChatMessage | null
  ) => {
    if (!previousMessage) return true;
    const currentDate = new Date(currentMessage.sendAt).toDateString();
    const previousDate = new Date(previousMessage.sendAt).toDateString();
    return currentDate !== previousDate;
  };

  // ---- 방 나가기 ----
  const leaveRoom = async () => {
    try {
      const response = await chatApiService.leaveChatRoom(Number(roomId));
      if (response.isSuccess) {
        websocketService.disconnect();
        isConnectedRef.current = false;
        navigate('/mypage/rooms');
      } else {
        console.error('채팅방 나가기 실패:', response.message);
      }
    } catch (err) {
      console.error('채팅방 나가기 API 오류:', err);
    }
  };

  const headerTitle = room?.title || '동행방';

  return (
    <div className="flex justify-center bg-white h-[100dvh] overflow-x-hidden">
      <div className="relative w-full max-w-[480px] bg-white flex flex-col h-full">
        {/* 헤더 */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 sticky top-0 z-90">
          <div className="mx-auto w-full max-w-[480px]">
            <BackHeader
              title={headerTitle}
              isChatRoom={true}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 min-h-0" style={{ overscrollBehavior: 'contain' }}>
          <div
            ref={listRef}
            onScroll={handleMessageScroll}
            className="h-full overflow-y-auto px-4"
            style={{
              paddingTop: `${HEADER_H + 100}px`,
              paddingBottom: `calc(${INPUT_BAR_H}px + ${kb}px + env(safe-area-inset-bottom, 0px) + 8px)`,
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}
          >
            {error && (
              <div className="p-4 mt-4 mb-4 mx-0 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{error}</p>
                <button
                  onClick={retryConnect}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  다시 연결 시도
                </button>
              </div>
            )}

            <div className="pt-2 pb-2">
              {isLoading ? (
                <div className="text-center py-8">채팅방을 불러오는 중...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p>아직 메시지가 없습니다.</p>
                </div>
              ) : (
                <>
                  {isLoadingMore && (
                    <div className="text-center py-2" ref={topSentinelRef}>
                      이전 메시지를 불러오는 중...
                    </div>
                  )}

                  {messages.map((message, index) => {
                    const previousMessage = index > 0 ? messages[index - 1] : null;
                    const showDateDivider = shouldShowDateDivider(message, previousMessage);

                    const { name: displayName, avatar } = getSenderMeta(
                      message.senderId,
                      message.senderName,
                      message.senderProfileImage
                    );

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
                                src={avatar}
                                alt={`${displayName}님의 프로필`}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = BasicProfile;
                                }}
                              />
                            )}

                            <div
                              className={`flex flex-col gap-1 ${
                                isMyMessage(message) ? 'items-end' : 'items-start'
                              }`}
                            >
                              {!isMyMessage(message) && (
                                <span className="font-[pretendard] font-normal text-[10px] text-[#262626]">
                                  {displayName}
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

        {/* 입력바 */}
        <div
          className="fixed inset-x-0 z-[80] bg-white border-t border-gray-200"
          style={{
            bottom: `calc(${kb}px + env(safe-area-inset-bottom, 0px))`,
            transform: 'translateZ(0)',
          }}
        >
          <div className="mx-auto w-full max-w-[480px] px-4 py-2" style={{ height: INPUT_BAR_H }}>
            <ChatInput
              message={newMessage}
              onChange={setNewMessage}
              onSubmit={sendMessage}
              onKeyPress={handleKeyPress}
              disabled={!isConnected || isCompleted}
            />
          </div>
        </div>

        {/* 사이드 모달 */}
        {isModalOpen && (
          <ModalPortal>
            <ChatModal
              panelRef={modalBg}
              roomId={roomId}
              onLeaveRoom={leaveRoom}
              onClose={() => setIsModalOpen(false)}
              usersData={usersData}
              isLoading={isUsersLoading}
            />
          </ModalPortal>
        )}
      </div>
    </div>
  );
}

