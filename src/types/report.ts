// 신고 관련 타입 정의

export type ReportReason = {
  code: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
};

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'ACTION_TAKEN' | 'REJECTED';

export type ReportTargetType = 'USER' | 'POST' | 'COMMENT';

export type CreateReportRequest = {
  targetUserId?: number;
  targetPostId?: number;
  targetCommentId?: number;
  reason: string;
  detail?: string;
  evidence?: string;
  imageUrl?: string;
  imageName?: string;
};

export type ReportResponse = {
  reportId: number;
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  detail?: string;
  status: ReportStatus;
  createdAt: string;
  message: string;
};

export type MyReport = {
  reportId: number;
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  status: ReportStatus;
  createdAt: string;
};

export type ReportReasonsResponse = ReportReason[];
export type MyReportsResponse = {
  reports: MyReport[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
