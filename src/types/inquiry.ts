// 문의 관련 타입 정의

export type InquiryCategory = 
  | 'GENERAL' 
  | 'TECHNICAL' 
  | 'ACCOUNT' 
  | 'PAYMENT' 
  | 'REPORT' 
  | 'SUGGESTION' 
  | 'COMPLAINT' 
  | 'OTHER';

export type InquiryStatus = 'PENDING' | 'IN_PROGRESS' | 'REPLIED' | 'CLOSED';

export type InquiryPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type InquiryCategoryInfo = {
  code: InquiryCategory;
  name: string;
  description: string;
};

export type CreateInquiryRequest = {
  title: string;
  content: string;
  category: InquiryCategory;
  attachmentUrls?: string[];
  imageUrl?: string;
  imageName?: string;
};

export type InquiryResponse = {
  id: number;
  title: string;
  content: string;
  category: InquiryCategory;
  categoryName: string;
  status: InquiryStatus;
  statusName: string;
  priority: InquiryPriority;
  priorityName: string;
  userEmail: string;
  userId: number;
  userName: string;
  createdDate: string;
  isReplied: boolean;
  isClosed: boolean;
};

export type MyInquiry = {
  id: number;
  title: string;
  category: InquiryCategory;
  categoryName: string;
  status: InquiryStatus;
  statusName: string;
  priority: InquiryPriority;
  priorityName: string;
  createdDate: string;
  isReplied: boolean;
  hasAttachment: boolean;
};

export type MyInquiriesResponse = {
  inquiries: MyInquiry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type InquiryCategoriesResponse = InquiryCategoryInfo[];
