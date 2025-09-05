export type ReviewTag = {
  code: number;
  description: string;
};

export type ReviewTagsResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ReviewTag[];
};

export type CreateReviewPayload = {
  contentId: number;
  text: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  tagCodes: number[];
  visitDate: string;
  receipt: boolean;
  rating: number;
  imageUrls?: string[];
  imageNames?: string[];
};

export type CreateReviewResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
};