import { useQuery } from '@tanstack/react-query';
import { getMyScraps } from '../../apis/mypage';
import type { ResponseMyScrapsDto } from '../../types/mypage';

export const useMyScraps = (page = 0, size = 10) =>
  useQuery<ResponseMyScrapsDto>({
    queryKey: ['myScraps', 'offset', page, size],
    queryFn: () => getMyScraps(undefined, page, size),
  });

