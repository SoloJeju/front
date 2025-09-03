import type { CommonResponse } from './common';

export type CreateRoomPayload = {
  title: string;
  description: string;
  contentId: number;
  joinDate: string;
  maxMembers: number;
  genderRestriction: 'MIXED' | 'MALE' | 'FEMALE';
};

export type CreatedRoomResult = {
  chatRoomId: number;
  title: string;
  description: string;
  touristSpotName: string;
  contentId: number;
  joinDate: string;
  maxMembers: number;
  currentMembers: number;
  createdAt: string;
};

export type CreateRoomApiResponse = CommonResponse<CreatedRoomResult>;

// 채팅방 나가기 API 응답 타입
export type LeaveRoomApiResponse = CommonResponse<string>;