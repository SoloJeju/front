import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { checkNickname } from '../../apis/auth';

export const useProfile = () => {
  // 닉네임 중복 확인
  const { mutate: executeCheckNickname, isPending: isCheckingNickname } =
    useMutation({
      mutationFn: checkNickname,
      onSuccess: () => {
        toast.success('사용 가능한 닉네임입니다.');
      },
      onError: (error) => {
        console.error('닉네임 중복 확인 실패:', error);
        toast.error(error.message || '이미 사용 중이거나 사용할 수 없는 닉네임입니다.');
      },
    });

  // 나중에 프로필 생성/수정 API 추가

  return {
    executeCheckNickname,
    isCheckingNickname,
  };
};