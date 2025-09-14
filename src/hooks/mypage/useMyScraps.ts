import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyScraps } from '../../apis/mypage';
import type {
  ResponseMyScrapsDto,
  CursorPage,
  ScrapItem,
} from '../../types/mypage';

function isCursorPage(result: unknown): result is CursorPage<ScrapItem> {
  if (typeof result !== 'object' || result === null) {
    return false;
  }

  return (
    'hasNext' in result &&
    typeof (result as { hasNext: unknown }).hasNext === 'boolean'
  );
}

export const useMyScraps = (size = 10) => {
  return useInfiniteQuery<ResponseMyScrapsDto>({
    queryKey: ['myScraps', 'infinite', size],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      getMyScraps(pageParam as string | undefined, undefined, size),
    getNextPageParam: (lastPage) => {
      const result = lastPage.result;

      if (isCursorPage(result) && result.hasNext) {
        return result.nextCursor;
      }

      return undefined;
    },
  });
};
