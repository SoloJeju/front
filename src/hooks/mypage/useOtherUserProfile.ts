import { useQuery } from '@tanstack/react-query';
import { getOtherUserProfile } from '../../apis/mypage';
import type { GetOtherUserProfileResponse } from '../../types/user';

export const useOtherUserProfile = (userId?: number) =>
  useQuery<GetOtherUserProfileResponse>({
    queryKey: ['otherUserProfile', userId],
    queryFn: () => getOtherUserProfile(userId!),
    enabled: !!userId, // userId 있을 때만 호출
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });
