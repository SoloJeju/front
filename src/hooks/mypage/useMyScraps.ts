import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyScraps } from '../../apis/mypage';
import type {
  ResponseMyScrapsDto,
  CursorPage,
  ScrapItem,
} from '../../types/mypage';

// 서버 응답이 커서 페이지 형태인지 확인하는 타입 가드
// (백엔드 응답에 nextCursor가 없을 수도 있으니 hasNext로만 확인해도 충분합니다)
function isCursorPage(result: any): result is CursorPage<ScrapItem> {
  return result && typeof result.hasNext === 'boolean';
}

export const useMyScraps = (size = 10) => {
  return useInfiniteQuery<ResponseMyScrapsDto>({
    queryKey: ['myScraps', 'infinite', size],

    // 첫 페이지를 불러올 때는 pageParam이 undefined입니다.
    initialPageParam: undefined,

    // API를 호출하는 함수입니다. pageParam이 다음 페이지를 가리키는 '커서'가 됩니다.
    queryFn: ({ pageParam }) =>
      getMyScraps(pageParam as string | undefined, undefined, size),

    // 마지막으로 불러온 페이지(lastPage) 정보를 바탕으로 다음 페이지를 요청할 커서를 결정합니다.
    getNextPageParam: (lastPage) => {
      const result = lastPage.result;

      // 응답 결과가 커서 페이지 형태이고, 다음 페이지가 존재할 경우에만
      // 서버가 알려준 nextCursor 값을 다음 pageParam으로 사용합니다.
      if (isCursorPage(result) && result.hasNext) {
        return result.nextCursor;
      }

      // 다음 페이지가 없으면 undefined를 반환하여 더 이상 요청하지 않습니다.
      return undefined;
    },
  });
};
