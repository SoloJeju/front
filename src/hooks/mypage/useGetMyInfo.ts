import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../../apis/mypage';

const useGetMyInfo = () => {
  const accessToken = localStorage.getItem('accessToken');

  return useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24시간
    enabled: !!accessToken,
  });
};

export default useGetMyInfo;
