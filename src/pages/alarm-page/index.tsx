import { useEffect } from 'react';
import AlarmCard from '../../components/AlarmPage/AlarmCard';
import { useInView } from 'react-intersection-observer';
import useGetInfiniteGroupedNoti from '../../hooks/alarm/useGetInfiniteGroupedNoti';
import PostNone from '/src/assets/post-none.svg';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AlarmPage() {
  const { data, isFetching, hasNextPage, fetchNextPage, isPending, isError } =
    useGetInfiniteGroupedNoti();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Erorr</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {data?.pages.flatMap((page) => {
          const notis = page.result.content;

          return notis ? (
            notis.map((noti) => (
              <AlarmCard
                key={noti.latestId}
                type={noti.type}
                message={noti.latestMessage}
                unreadCount={noti.unreadCount}
                resourceId={noti.resourceId}
                resourceType={noti.resourceType}
              />
            ))
          ) : (
            <div className="pt-15 flex flex-col justify-center items-center h-full">
              <img src={PostNone} className="w-20 h-20" />
              <p className="font-[pretendard] font-medium text-[#B4B4B4]">
                알림이 존재하지 않습니다
              </p>
            </div>
          );
        })}
      </div>
      <div ref={ref}></div>
    </>
  );
}
