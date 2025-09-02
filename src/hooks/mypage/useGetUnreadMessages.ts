import { useQuery } from '@tanstack/react-query';
import { getUnreadMessages } from '../../apis/mypage';

export const useGetUnreadMessages = () => {
  return useQuery({
    queryKey: ['unreadMessages'],
    queryFn: getUnreadMessages,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });
};
