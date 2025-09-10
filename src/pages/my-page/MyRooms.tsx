import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import RoomCard from '../../components/common/RoomCard/RoomCard';
import PostNone from '/src/assets/post-none.svg';
import useGetMyChatRooms from '../../hooks/mypage/useGetMyChatRooms';

export default function MyRooms() {
  const { data, isFetching, hasNextPage, fetchNextPage, isPending, isError } =
    useGetMyChatRooms();
  


  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  // 모든 페이지의 동행방 데이터를 평탄화하고 읽지 않은 메시지가 있는 채팅방을 상단에 정렬
  const allRooms = data?.pages.flatMap((page) => page.result.content) || [];
  const sortedRooms = [...allRooms].sort((a, b) => {
    // 읽지 않은 메시지가 있는 채팅방을 먼저 표시
    if (a.hasUnreadMessages && !b.hasUnreadMessages) return -1;
    if (!a.hasUnreadMessages && b.hasUnreadMessages) return 1;
    return 0;
  });

  return (
    <div className="font-Pretendard bg-[#FFFFFD] min-h-screen flex justify-center">
      <div className="w-full max-w-[480px]">
        {/* 헤더 */}
        {/* <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <BackHeader title="동행방 리스트" />
        </div> */}

        {/* 콘텐츠 */}
        <div className="p-4">
          {isPending ? (
            <div className="pt-40 text-center text-gray-500 flex flex-col items-center">
              <p className="text-lg">동행방 목록을 불러오는 중...</p>
            </div>
          ) : isError ? (
            <div className="pt-40 text-center text-gray-500 flex flex-col items-center">
              <p className="text-lg">동행방 목록을 불러오는데 실패했습니다.</p>
              <p className="mt-2 text-sm">잠시 후 다시 시도해주세요.</p>
            </div>
          ) : sortedRooms.length === 0 ? (
            <div className="pt-40 text-center text-gray-500 flex flex-col items-center">
              <img
                src={PostNone}
                alt="동행방 없음"
                className="w-[170px] h-[102px] mb-4"
              />
              <p className="text-lg">참여중인 동행방이 없어요.</p>
              <p className="mt-2 text-sm">새로운 동행방을 찾아보세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedRooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  id={room.roomId}
                  isEnd={room.isCompleted || false}
                  title={room.title}
                  location={room.spotName}
                  date={room.scheduledDate || room.joinDate || ''}
                  pre={room.currentParticipants || room.currentMembers || 0}
                  all={room.maxParticipants || room.maxMembers || 0}
                  imageUrl={room.spotImage || room.touristSpotImage}
                  gender={room.genderRestriction}
                  hasUnreadMessages={room.hasUnreadMessages}
                  unreadCount={room.unreadCount}
                />
              ))}
              
              {/* 무한스크롤 감지 요소 */}
              {hasNextPage && (
                <div ref={ref} className="py-4 text-center">
                  {isFetching ? (
                    <p className="text-gray-500">더 많은 동행방을 불러오는 중...</p>
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
