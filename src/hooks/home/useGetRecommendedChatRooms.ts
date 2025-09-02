import { useQuery } from '@tanstack/react-query';
import { getRecommendedChatRooms } from '../../apis/home';

function useGetRecommendedChatRooms() {
  return useQuery({
    queryKey: ['recommendedChatRooms', new Date().toISOString().split('T')[0]],
    queryFn: () => getRecommendedChatRooms(),
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24시간
    retry: 1,
    select: (data) => data.result,
  });
}

export default useGetRecommendedChatRooms;
