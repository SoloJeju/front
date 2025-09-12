import type { CommonResponse, CommonCursorResponse } from './common';

// 내 알림 조회
export type MyNoti = {
  id: number;
  type: string;
  message: string;
  resourceType: string;
  resourceId: number;
  isRead: boolean;
  createdAt: Date;
};

export type ResponseMyNotiListDto = CommonCursorResponse<{
  content: MyNoti[];
}>;

// 미확인 알림 여부
export type ResponseUnreadNotiDto = CommonResponse<boolean>;

// 내 알림 그룹 조회
export type ResponseGroupedNotiDto = CommonResponse<{
  content: [
    {
      type: string;
      resourceType: string;
      resourceId: number;
      latestId: number;
      latestMessage: string;
      totalCount: number;
      unreadCount: number;
      latestCreatedAt: Date;
    },
  ];
  nextCursor: string | null;
  hasNext: boolean;
  size: number;
}>;

// 그룹 알림 읽음 처리
export type ResponseReadGroupedNotiDto = CommonResponse<unknown>;
