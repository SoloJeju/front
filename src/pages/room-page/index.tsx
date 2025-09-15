import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Back from '/src/assets/beforeArrow.svg';
import ExImage from '/src/assets/exampleImage.png';
import Clock from '/src/assets/clock.svg';
import Location from '/src/assets/location.svg';
import People from '/src/assets/people.svg';
import chatApiService from '../../services/chat';
import type { ChatRoomDetailResponse } from '../../types/chat';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [isJoining, setIsJoining] = useState(false);
  const [roomData, setRoomData] = useState<
    ChatRoomDetailResponse['result'] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // 날짜 포맷터
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
  };

  // 상세조회 호출
  useEffect(() => {
    let mounted = true;
    const loadRoomData = async () => {
      setIsLoading(true);
      try {
        const res = await chatApiService.detailChatRoom(Number(roomId));
        if (mounted && res.isSuccess) {
          setRoomData(res.result);
        } else if (mounted) {
          setIsError(true);
        }
      } catch (err) {
        if (mounted) setIsError(true);
        console.error('채팅방 상세조회 오류:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    if (roomId) loadRoomData();
    return () => {
      mounted = false;
    };
  }, [roomId]);

  const handleJoinRoom = async () => {
    if (!roomId || isJoining) return;

    if (!roomId || isNaN(Number(roomId))) {
      console.error('❌ 잘못된 roomId:', roomId);
      return;
    }
    setIsJoining(true);
    try {
      const res = await chatApiService.joinChatRoom(Number(roomId));
      if (res.isSuccess) {
        navigate(`/chat-room/${roomId}`);
      } else {
        switch (res.code) {
          case 'CHAT4002': // 이미 joinChat에 추가된 사용자
          case 'CHAT4004': // 이미 참가한 채팅방
            navigate(`/chat-room/${roomId}`);
            break;
          case 'CHAT4005': // 인원수 제한
            alert('채팅방이 이미 최대 인원에 도달했습니다.');
            break;
          case 'CHAT4007': // 성별 제한 위반
            alert('이 채팅방의 성별 제한에 맞지 않습니다.');
            break;
          case 'CHAT4009': // 종료된 방
            alert('이미 종료된 채팅방입니다. 메시지를 작성할 수 없습니다.');
            navigate(`/chat-room/${roomId}`, { state: { isCompleted: true } });
            break;
          default:
            alert(res.message || '채팅방 입장에 실패했습니다.');
        }
      }
    } catch (error: unknown) {
      console.error('채팅방 입장 API 오류:', error);
      const err = error as { response?: { data?: { code?: string } } };
      const code = err.response?.data?.code;

      switch (code) {
        case 'CHAT4002':
        case 'CHAT4004':
          navigate(`/chat-room/${roomId}`);
          break;
        case 'CHAT4005':
          alert('채팅방이 이미 최대 인원에 도달했습니다.');
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
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner color="#ffffff" />;
  }

  if (isError || !roomData) {
    return (
      <div className="h-full p-5 bg-[#F78938] flex items-center justify-center">
        <div className="text-white text-lg">
          채팅방 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  // 뷰 모델 통일
  const room = {
    title: roomData.title,
    description: roomData.description ?? '',
    spotName: roomData.spotName ?? '',
    spotImage: roomData.touristSpotImage ?? '',
    currentMembers: roomData.currentMembers ?? 0,
    maxMembers: roomData.maxMembers ?? 0,
    scheduledDate: roomData.joinDate ?? '',
  };

  return (
    <div className="h-full p-5 bg-[#F78938]">
      <button type="button" onClick={() => navigate(-1)}>
        <img src={Back} alt="뒤로가기" />
      </button>

      <div className="flex flex-col justify-center items-center px-5 py-6 mt-9 bg-[#FFFFFD] rounded-[20px]">
        {/* 이미지 + 제목 + 인원 */}
        <div className="w-full pb-4 border-b-2 border-[#FFCEAA]">
          <img
            src={room.spotImage || ExImage}
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
              {room.currentMembers}명/{room.maxMembers}명
            </span>
          </p>
        </div>

        {/* 설명 */}
        <p className="py-5 break-keep border-b-2 border-[#FFCEAA] font-[pretendard] font-normal text-sm text-[#262626]">
          {room.description}
        </p>

        {/* 버튼 */}
        <button
          type="button"
          className="pt-4 font-[pretendard] font-semibold text-base text-[#F78938] cursor-pointer disabled:cursor-not-allowed"
          disabled={isJoining}
          onClick={handleJoinRoom}
        >
          {isJoining ? '입장 중...' : '동행방 입장하기'}
        </button>
      </div>
    </div>
  );
}
