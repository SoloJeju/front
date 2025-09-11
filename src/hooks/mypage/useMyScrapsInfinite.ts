import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyScraps } from '../../apis/mypage';
import type { ResponseMyScrapsDto } from '../../types/mypage';

export const useMyScrapsInfinite = (size = 10) =>
  useInfiniteQuery<ResponseMyScrapsDto>({
    queryKey: ['myScraps', 'cursor', size],
    queryFn: ({ pageParam }) =>
      getMyScraps(pageParam as string | undefined, undefined, size),
    initialPageParam: undefined, // 첫 페이지
    getNextPageParam: (last) => {
      const r: any = last.result;
      return r?.hasNext ? (r?.nextCursor ?? undefined) : undefined;
    },
  });

