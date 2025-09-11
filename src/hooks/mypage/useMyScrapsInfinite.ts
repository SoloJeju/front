import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyScraps } from '../../apis/mypage';
import type { ResponseMyScrapsDto } from '../../types/mypage';
import { isCursorPage } from '../../types/mypage';

export const useMyScrapsInfinite = (size = 10) =>
  useInfiniteQuery<ResponseMyScrapsDto>({
    queryKey: ['myScraps', 'cursor', size],
    queryFn: ({ pageParam }) =>
      getMyScraps(pageParam as string | undefined, undefined, size),
    initialPageParam: undefined,
    getNextPageParam: (last) => {
      const r = last.result;
      return isCursorPage(r) && r.hasNext
        ? (r.nextCursor ?? undefined)
        : undefined;
    },
  });
