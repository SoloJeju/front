import { useEffect, useState } from 'react';
import {
  userTypeImages,
  userTypeDescriptions,
  defaultUserImage,
  type UserType,
} from '../../../constants/userTypeImages';
import Button from '../../common/Button';
import { useProfileStore } from '../../../stores/profile-store';
import { useKakaoSignup } from '../../../hooks/auth/useKakaoSignup.ts';
import { useSignup } from '../../../hooks/auth/useSignupFlow';
import { type SignupRequest } from '../../../types/auth';

function isUserType(value: unknown): value is UserType {
  return typeof value === 'string' && value in userTypeImages;
}

export default function ResultStep() {
  const finalProfileData = useProfileStore.getState();
  const { executeKakaoSignup } = useKakaoSignup();
  const { executeSignup, isSigningUp } = useSignup();

  const nickName = useProfileStore((s) => s.nickName);
  const userType = useProfileStore((s) => s.userType);
  const calculateUserType = useProfileStore((s) => s.calculateUserType);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !userType) {
      calculateUserType();
    }
  }, [isMounted, userType, calculateUserType]);

  if (!isMounted) return null;

  const validUserType = isUserType(userType) ? userType : undefined;
  const resultImage = validUserType
    ? userTypeImages[validUserType]
    : defaultUserImage;
  const resultName = validUserType
    ? `${validUserType} 여행자`
    : '유형 분석 중...';
  const resultDescription = validUserType
    ? userTypeDescriptions[validUserType]
    : '당신의 성향을 분석하고 있어요!';

  const handleStart = () => {
    const isKakaoLogin =
      !!localStorage.getItem('accessToken') &&
      localStorage.getItem('isProfileCompleted') === 'false';

    if (isKakaoLogin) {
      executeKakaoSignup({
        name: finalProfileData.name,
        gender: finalProfileData.gender === '남자' ? 'MALE' : 'FEMALE',
        birthDate: finalProfileData.birthdate,
        nickName: finalProfileData.nickName,
        userType: finalProfileData.userType,
        imageName: finalProfileData.profileImage
          ? finalProfileData.profileImage.split('/').pop()
          : '',
        imageUrl: finalProfileData.profileImage,
        bio: finalProfileData.bio,
      });
      return;
    }

    const signupData: SignupRequest = {
      email: finalProfileData.email,
      name: finalProfileData.name,
      password: finalProfileData.password,
      gender: finalProfileData.gender === '남자' ? 'MALE' : 'FEMALE',
      birthDate: finalProfileData.birthdate,
      nickName: finalProfileData.nickName,
      userType: finalProfileData.userType,
      bio: finalProfileData.bio,
      imageUrl: finalProfileData.profileImage,
      imageName: '',
    };
    executeSignup(signupData);
  };

  return (
    <div className="px-6 pb-6 flex flex-col h-full font-[Pretendard]">
      <div className="flex-grow flex flex-col items-center justify-center text-center pt-12">
        <h2 className="text-xl text-center mb-8 leading-snug">
          <span className="font-bold text-3xl">{nickName}</span> 님의
          <br />
          여행 성향은?
        </h2>

        <div className="w-full max-w-xs p-6 flex flex-col items-center">
          <img src={resultImage} alt={resultName} className="w-70 h-70 mb-8" />
          <p className="text-2xl font-bold text-primary mb-2">{resultName}</p>
          <p className="text-gray-600 whitespace-pre-wrap">
            {resultDescription}
          </p>
        </div>
      </div>

      <div className="pb-4">
        <Button
          onClick={handleStart}
          className="w-full py-3 rounded-[10px] text-white bg-primary"
          variant="primary"
          disabled={!validUserType || isSigningUp}
        >
          {isSigningUp
            ? '가입하는 중...'
            : validUserType
              ? '시작하기'
              : '분석 중...'}
        </Button>
      </div>
    </div>
  );
}
