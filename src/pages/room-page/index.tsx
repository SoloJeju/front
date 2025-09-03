import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Back from '/src/assets/beforeArrow.svg';
import ExImage from '/src/assets/exampleImage.png';
import Clock from '/src/assets/clock.svg';
import Location from '/src/assets/location.svg';
import People from '/src/assets/people.svg';
import useGetMyChatRooms from '../../hooks/mypage/useGetMyChatRooms';
import { getRecommendedChatRooms } from '../../apis/home';
import chatApiService from '../../services/chat';
import type { RecommendedChatRooms, MyChatRoom } from '../../types/home';

type RoomData = RecommendedChatRooms | MyChatRoom;

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isJoining, setIsJoining] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // URL에서 어디서 왔는지 확인 (from=home 또는 from=mypage)
  const from = searchParams.get('from') || 'mypage'; // 기본값은 마이페이지

  const {
    data: myChatRooms,
    isPending: isMyChatRoomsPending,
    isError: isMyChatRoomsError,
  } = useGetMyChatRooms();

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 채팅방 데이터 로드
  useEffect(() => {
    const loadRoomData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        if (from === 'home') {
          // 홈화면에서 온 경우 - 홈화면 API 호출
          const response = await getRecommendedChatRooms();
          if (response.isSuccess) {
            const room = response.result.find((room: RecommendedChatRooms) => room.roomId === Number(roomId));
            if (room) {
              setRoomData(room);
            } else {
              setIsError(true);
            }
          } else {
            setIsError(true);
          }
        } else {
          // 마이페이지에서 온 경우 - 마이페이지 데이터 사용
          if (myChatRooms && !isMyChatRoomsPending && !isMyChatRoomsError) {
            const room = myChatRooms.pages?.[0]?.result?.content?.find(
              (room: MyChatRoom) => room.roomId === Number(roomId)
            );
            if (room) {
              setRoomData(room);
            } else {
              setIsError(true);
            }
          }
        }
      } catch (error) {
        console.error('채팅방 데이터 로드 오류:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      loadRoomData();
    }
  }, [roomId, from, myChatRooms, isMyChatRoomsPending, isMyChatRoomsError]);

  const handleNavigate = () => {
    navigate(-1);
  };

  const handleJoinRoom = async () => {
  if (!roomId || isJoining) return;
  setIsJoining(true);

  try {
    const response = await chatApiService.joinChatRoom(Number(roomId));

    if (response.isSuccess) {
      console.log('채팅방 입장 성공:', response.result);
      navigate(`/chat-room/${roomId}`);
    } else {
      switch (response.code) {
        case 'CHAT4002': // 이미 joinChat에 추가된 사용자
        case 'CHAT4004': // 이미 참가한 채팅방
          console.log('이미 참가한 채팅방입니다. 메시지 페이지로 이동합니다.');
          navigate(`/chat-room/${roomId}`);
          break;
        case 'CHAT4005': // 인원수 제한
          alert('채팅방 최대 인원에 도달했습니다.');
          break;
        case 'CHAT4007': // 성별 제한 위반
          alert('이 채팅방의 성별 제한에 맞지 않습니다.');
          break;
        case 'CHAT4009': // 종료된 방
          alert('이미 종료된 채팅방입니다.');
          break;
        default:
          alert(response.message || '채팅방 입장에 실패했습니다.');
      }
    }
  } catch (error: unknown) {
    console.error('채팅방 입장 API 오류:', error);

    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { code?: string } } };
      switch (apiError.response?.data?.code) {
        case 'CHAT4002':
        case 'CHAT4004':
          console.log('이미 참가한 채팅방입니다. 메시지 페이지로 이동합니다.');
          navigate(`/chat-room/${roomId}`);
          break;
        case 'CHAT4005':
          alert('채팅방 최대 인원에 도달했습니다.');
          break;
        case 'CHAT4007':
          alert('이 채팅방의 성별 제한에 맞지 않습니다.');
          break;
        case 'CHAT4009':
          alert('이미 종료된 채팅방입니다. 메시지를 작성할 수 없습니다.');
            navigate(`/chat-room/${roomId}`, { state: { isCompleted: true } });
          break;
        default:
          alert('채팅방 입장 중 오류가 발생했습니다.');
      }
    } else {
      alert('채팅방 입장 중 오류가 발생했습니다.');
    }
  } finally {
    setIsJoining(false);
  }
};


  if (isLoading || isMyChatRoomsPending) {
    return (
      <div className="h-full p-5 bg-[#F78938] flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  if (isError || isMyChatRoomsError || !roomData) {
    return (
      <div className="h-full p-5 bg-[#F78938] flex items-center justify-center">
        <div className="text-white text-lg">
          채팅방 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  // 홈화면과 마이페이지 데이터 구조가 다르므로 통합 처리
  const room = {
    title: roomData.title,
    description: roomData.description,
    spotName: roomData.spotName,
    spotImage: roomData.spotImage,
    currentMembers: 'currentParticipants' in roomData ? roomData.currentParticipants : 0,
    maxMembers: 'maxParticipants' in roomData ? roomData.maxParticipants : 0,
    scheduledDate: 'scheduledDate' in roomData ? 
      (typeof roomData.scheduledDate === 'string' ? roomData.scheduledDate : roomData.scheduledDate.toISOString()) : '',
    isCompleted: 'isCompleted' in roomData ? roomData.isCompleted : false,
  };



  return (
    <div className="h-full p-5 bg-[#F78938]">
      <button type="button" onClick={handleNavigate}>
        <img src={Back} alt="뒤로가기" />
      </button>

      <div className="flex flex-col justify-center items-center px-5 py-6 mt-9 bg-[#FFFFFD] rounded-[20px]">
        <div className="w-full pb-4 border-b-2 border-[#FFCEAA]">
          <img
            src={room.spotImage ? room.spotImage : ExImage}
            alt=""
            className="w-full h-61 object-cover"
          />
          <h1 className="mt-5 mb-4 font-[pretendard] font-semibold text-2xl text-black">
            {room.title}
          </h1>
          <p className="flex gap-1 items-center">
            <img src={Location} alt="동행 위치" className="w-4.5 h-4.5" />
            <span className="font-[pretendard] font-normal text-[#666666]">
              {room.spotName}
            </span>
          </p>
          <p className="flex gap-1 items-center">
            <img src={Clock} alt="동행 시간" className="w-4.5 h-4.5" />
            <span className="font-[pretendard] font-normal text-[#666666]">
              {formatDate(room.scheduledDate)}
            </span>
          </p>
          <p className="flex gap-1 items-center">
            <img src={People} alt="동행 인원수" className="w-4.5 h-4.5" />
            <span
              aria-label={`최대 ${room.maxMembers}명 현재 인원 ${room.currentMembers}명`}
              className="font-[pretendard] font-medium text-base text-[#F78938]"
            >
              {room.currentMembers || 0}명/{room.maxMembers}명
            </span>
          </p>
        </div>

        <p className="py-5 break-keep border-b-2 border-[#FFCEAA] font-[pretendard] font-normal text-sm text-[#262626]">
          {room.description}
        </p>

        <button
          type="button"
          className="pt-4 font-[pretendard] font-semibold text-base text-[#F78938] cursor-pointer disabled:cursor-not-allowed"
          disabled={room.currentMembers === room.maxMembers || room.isCompleted || isJoining}
          onClick={handleJoinRoom}
        >
          {isJoining ? '입장 중...' : room.isCompleted ? '모집 완료' : '동행방 입장하기'}
        </button>
      </div>
    </div>
  );
}
