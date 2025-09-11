import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { checkNickname } from '../../apis/auth';
import { updateMyProfile } from '../../apis/mypage';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../../types/mypage';

export const useProfile = () => {
  const qc = useQueryClient();

  // 닉네임 중복 확인
  const { mutate: executeCheckNickname, isPending: isCheckingNickname } =
    useMutation({
      mutationFn: checkNickname,
      onSuccess: () => toast.success('사용 가능한 닉네임입니다.'),
      onError: (error: any) => {
        console.error('닉네임 중복 확인 실패:', error);
        toast.error(
          error?.message || '이미 사용 중이거나 사용할 수 없는 닉네임입니다.'
        );
      },
    });

  // 프로필 수정
  const { mutate: executeUpdateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: (payload: UpdateProfileRequest) => updateMyProfile(payload),
      onSuccess: (res: UpdateProfileResponse) => {
        toast.success('프로필이 수정되었습니다.');
        qc.setQueryData(['myInfo'], res);
      },
      onError: (error: any) => {
        console.error('프로필 수정 실패:', error);
        toast.error(error?.message || '프로필 수정 중 오류가 발생했습니다.');
      },
    });

  return {
    // 닉네임
    executeCheckNickname,
    isCheckingNickname,
    // 수정
    executeUpdateProfile,
    isUpdatingProfile,
  };
};
