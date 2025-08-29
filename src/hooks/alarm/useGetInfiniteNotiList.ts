// import { useInfiniteQuery } from '@tanstack/react-query';
// import { getMyNotiList } from '../../apis/alarm';

// function useGetInfiniteNotiList() {
//   return useInfiniteQuery({
//     queryKey: ['notifications'],
//     queryFn: () => getMyNotiList(),
//     initialPageParam: undefined,
//     getNextPageParam: (lastPage) => {
//       return lastPage.result.hasNext
//         ? lastPage.result.lastNotificationId
//         : undefined;
//     },
//   });
// }

// export default useGetInfiniteNotiList;
