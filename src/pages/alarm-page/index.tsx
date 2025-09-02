import { useEffect } from 'react';
import AlarmCard from '../../components/AlarmPage/AlarmCard';
import useGetInfiniteNotiList from '../../hooks/alarm/useGetInfiniteNotiList';
import { useInView } from 'react-intersection-observer';

// const mockData = [
//   {
//     id: 1,
//     type: '댓글',
//     title: '게시글에 새로운 댓글이 달렸어요!',
//     content: '밥은 먹고 다니냐 ...',
//   },
//   {
//     id: 2,
//     type: '메시지',
//     title: '동행방에 새로운 메시지가 있어요!',
//     content: '밥은 먹고 다니냐 ...',
//   },
//   {
//     id: 3,
//     type: '댓글',
//     title: '게시글에 새로운 댓글이 달렸어요!',
//     content: '밥은 먹고 다니냐 ...',
//   },
//   {
//     id: 4,
//     type: '댓글',
//     title: '게시글에 새로운 댓글이 달렸어요!',
//     content: '밥은 먹고 다니냐 ...',
//   },
// ];

export default function AlarmPage() {
  const { data, isFetching, hasNextPage, fetchNextPage, isPending, isError } =
    useGetInfiniteNotiList();

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
              key={noti.id}
              id={noti.id}
              type={noti.type}
              message={noti.message}
              isRead={noti.isRead}
              resourceId={noti.resourceId}
            />
          ));
        })}
      </div>
      <div ref={ref}></div>
    </>
  );
}
