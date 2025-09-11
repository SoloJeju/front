import { useEffect } from 'react';
import AlarmCard from '../../components/AlarmPage/AlarmCard';
import { useInView } from 'react-intersection-observer';
import useGetInfiniteGroupedNoti from '../../hooks/alarm/useGetInfiniteGroupedNoti';

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
    // loading ui
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Erorr</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-3 px-4">
        {data?.pages.flatMap((page) => {
          const notis = page.result.content;

          return notis?.map((noti) => (
            <AlarmCard
              key={noti.latestId}
              id={noti.latestId}
              type={noti.type}
              message={noti.latestMessage}
              unreadCount={noti.unreadCount}
              resourceId={noti.resourceId}
            />
          ));
        })}
      </div>
      <div ref={ref}></div>
    </>
  );
}
