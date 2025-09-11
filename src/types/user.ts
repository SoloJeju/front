import type { CommonResponse } from './common';

// 내 프로필 조회
export type MyInfo = {
  userId: number;
  email: string;
  name: string;
  nickName: string;
  imageUrl: string;
  birth: string;
  gender: string;
  country: string;
  soloPlanCount: number;
  groupChatCount: number;
  bio: string;
  userType: string;
};

export type ResponseMyInfoDto = CommonResponse<MyInfo>;

// 다른 사용자 프로필 조회
export type OtherUserProfile = {
  userId: number;
  nickName: string;
  imageUrl: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
  country: string;
  soloPlanCount: number;
  groupChatCount: number;
  bio: string;
  userType: string;
};

export type GetOtherUserProfileResponse = CommonResponse<OtherUserProfile>;
