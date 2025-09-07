import { useQuery } from '@tanstack/react-query';
import { getTouristGroups } from '../../apis/tourist';

export default function useGetChatRooms(contentId: number) {
  return useQuery({
    queryKey: ['chatRooms', contentId],
    queryFn: () => getTouristGroups(contentId),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    select: (data) => data.result,
  });
}
