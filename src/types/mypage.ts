import type { CommonResponse } from "./common";

// 프로필 수정 요청 
export type UpdateProfileRequest = {
  nickName?: string;
  imageName?: string;
  imageUrl?: string;
  bio?: string;         
};

// 응답
export type UpdateProfilePayload = {
  id: number;
  nickName: string;
  avatarUrl: string; // 서버가 어케 내려줘요?
  bio: string | null;
};

export type UpdateProfileResponse = CommonResponse<UpdateProfilePayload>;
