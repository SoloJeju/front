import { useQuery } from '@tanstack/react-query';
import { getUnreadNoti } from '../../apis/alarm';

const useGetUnreadNoti = () => {
  return useQuery({
    queryKey: ['unreadNotis'],
    queryFn: getUnreadNoti,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });
};
export default useGetUnreadNoti;
