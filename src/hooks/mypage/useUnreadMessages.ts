import { useQuery } from '@tanstack/react-query';
import { getUnreadMessages } from '../../apis/mypage';

export const useUnreadMessages = () => {
  return useQuery({
    queryKey: ['unreadMessages'],
    queryFn: getUnreadMessages,
    refetchInterval: 30000, // 30초마다 자동 갱신
    staleTime: 10000, // 10초간 캐시 유지
  });
};
