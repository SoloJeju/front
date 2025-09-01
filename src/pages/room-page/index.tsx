import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Back from '/src/assets/beforeArrow.svg';
import ExImage from '/src/assets/exampleImage.png';
import Clock from '/src/assets/clock.svg';
import Location from '/src/assets/location.svg';
import People from '/src/assets/people.svg';
import useGetMyChatRooms from '../../hooks/mypage/useGetMyChatRooms';

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const {
    data: myChatRooms,
    isPending,
    isError,
    error,
  } = useGetMyChatRooms();

  const handleNavigate = () => {
    navigate(-1);
  };

  const handleJoinRoom = () => {
    navigate(`/chat-room/${roomId}`);
  };

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

  // 해당 채팅방 정보 찾기 (InfiniteQuery 구조에 맞게 수정)
  const room = myChatRooms?.pages?.[0]?.result?.content?.find(
    (room: any) => room.chatRoomId === Number(roomId)
  );

  if (isPending) {
    return (
      <div className="h-full p-5 bg-[#F78938] flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="h-full p-5 bg-[#F78938] flex items-center justify-center">
        <div className="text-white text-lg">
          채팅방 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-5 bg-[#F78938]">
      <button type="button" onClick={handleNavigate}>
        <img src={Back} alt="뒤로가기" />
      </button>

      <div className="flex flex-col justify-center items-center px-5 py-6 mt-9 bg-[#FFFFFD] rounded-[20px]">
        <div className="w-full pb-4 border-b-2 border-[#FFCEAA]">
          <img
            src={room.touristSpotImage ? room.touristSpotImage : ExImage}
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
              {formatDate(room.joinDate)}
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

        <p className="py-5 break-keep border-b-2 border-[#FFCEAA] font-[pretendard] font-normal text-sm text-[#262626]">
          {room.description}
        </p>

        <button
          type="button"
          className="pt-4 font-[pretendard] font-semibold text-base text-[#F78938] cursor-pointer disabled:cursor-not-allowed"
          disabled={room.currentMembers === room.maxMembers || room.isCompleted}
          onClick={handleJoinRoom}
        >
          {room.isCompleted ? '모집 완료' : '동행방 입장하기'}
        </button>
      </div>
    </div>
  );
}
