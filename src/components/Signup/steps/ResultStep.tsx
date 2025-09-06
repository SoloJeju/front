// 회원가입 6단계 - 모든 답변을 종합해서 보여주는 최종 결과 화면
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  userTypeImages,
  userTypeDescriptions,
  defaultUserImage,
  type UserType,
} from '../../../constants/userTypeImages';
import Button from '../../common/Button';
import { useProfileStore } from '../../../stores/profile-store';
import toast from 'react-hot-toast';

function isUserType(v: unknown): v is UserType {
  return typeof v === 'string' && v in userTypeImages;
}

export default function ResultStep() {
  const navigate = useNavigate();

  const nickName = useProfileStore((s) => s.nickName);
  const rawUserType = useProfileStore((s) => s.userType);
  const calculateUserType = useProfileStore((s) => s.calculateUserType);

  const [hydrated, setHydrated] = useState<boolean>(() => {
    const api = (useProfileStore as any).persist;
    return !!api?.hasHydrated?.();
  });
  useEffect(() => {
    const api = (useProfileStore as any).persist;
    const unsub = api?.onFinishHydration?.(() => setHydrated(true));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!rawUserType) calculateUserType();
  }, [hydrated, rawUserType, calculateUserType]);

  if (!hydrated) return null;

  const userType = isUserType(rawUserType) ? rawUserType : undefined;
  const resultImage = userType ? userTypeImages[userType] : defaultUserImage;
  const resultName = userType ? `${userType} 여행자` : '유형 분석 중...';
  const resultDescription = userType
    ? userTypeDescriptions[userType]
    : '당신의 성향을 분석하고 있어요!';

  const handleStart = () => {
    const finalProfileData = useProfileStore.getState();
    console.log('Final Profile Submitted:', finalProfileData);
    toast.success('회원가입이 완료되었습니다! 환영해요 👋');
    navigate('/');
  };

  return (
    <div className="px-6 pb-6 flex flex-col h-full">
      <div className="flex-grow flex flex-col items-center justify-center text-center pt-12">
        <h2 className="text-xl text-center mb-8 leading-snug">
          <span className="font-bold text-3xl">{nickName}</span> 님의
          <br />
          여행 성향은?
        </h2>

        <div className="w-full max-w-xs p-6 flex flex-col items-center">
          <img src={resultImage} alt={resultName} className="w-70 h-70 mb-8" />
          <p className="text-2xl font-Pretendard font-bold text-primary mb-2">
            {resultName}
          </p>
          <p className="text-gray-600">{resultDescription}</p>
        </div>
      </div>

      <div className="pb-4">
        <Button
          onClick={handleStart}
          className="w-full py-3 rounded-[10px] text-white bg-primary"
          variant="primary"
          disabled={!userType}
        >
          {userType ? '시작하기' : '분석 중...'}
        </Button>
      </div>
    </div>
  );
}
