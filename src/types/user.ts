import type { CommonResponse } from './common';

// 내 프로필 조회
export type MyInfo = {
  userId: number;
  email: string;
  name: string;
  nickName: string;
  imageUrl: string;
  birth: Date;
  gender: string;
  country: string;
  soloPlanCount: number;
  groupChatCount: number;
  bio: string;
  userType: string;
};

export type ResponseMyInfoDto = CommonResponse<MyInfo>;
