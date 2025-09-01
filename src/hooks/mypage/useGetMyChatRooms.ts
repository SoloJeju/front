import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyChatRooms } from '../../apis/mypage';

function useGetMyChatRooms(size: number = 10) {
  return useInfiniteQuery({
    queryKey: ['myChatRooms'],
    queryFn: ({ pageParam }) => getMyChatRooms(undefined, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.result.last) {
        return undefined;
      }
      return lastPage.result.number + 1;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
  });
}

export default useGetMyChatRooms;
