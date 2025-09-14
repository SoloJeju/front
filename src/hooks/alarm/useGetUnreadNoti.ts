import { useQuery } from '@tanstack/react-query';
import { getUnreadNoti } from '../../apis/alarm';

const useGetUnreadNoti = () => {
  const accessToken = localStorage.getItem('accessToken');

  return useQuery({
    queryKey: ['unreadNotis'],
    queryFn: getUnreadNoti,
    refetchInterval: 30000, // 30초마다 자동 갱신
    enabled: !!accessToken,
  });
};
export default useGetUnreadNoti;
