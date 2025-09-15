import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyPlans } from '../../apis/mypage';
import type { PlanItem } from '../../types/mypage';

type PlansPage = {
  content: PlanItem[];
  totalElements: number;
  totalPages: number;
};

function useMyPlans(size: number = 10) {
  return useInfiniteQuery({
    queryKey: ['myPlans', size],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getMyPlans(undefined, pageParam as number, size),
    getNextPageParam: (lastPage: { result: PlansPage }, pages) => {
      const totalPages = lastPage.result.totalPages ?? 0;
      const next = pages.length; // 0,1,2,...
      return next < totalPages ? next : undefined;
    },
    select: (data) => ({
      pages: data.pages.flatMap((p: { result: PlansPage }) => p.result.content),
      pageParams: data.pageParams,
    }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export default useMyPlans;
