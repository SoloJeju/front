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
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
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

export type UpdateReviewPayload = {
  text?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  tagCodes?: number[];
  visitDate?: string;
  rating?: number;
  newImageUrls?: string[];
  newImageNames?: string[];
  deleteImageNames?: string[];
};

export type ImageItem = {
  imageUrl: string;
  imageName: string;
};

export type TagDetail = {
  code: number;
  description: string;
  selected: boolean;
};

export type ReviewDetail = {
  id: number;
  contentId: number;
  content:string;
  text: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  visitDate: string;
  receipt: boolean;
  rating: number;
  images: ImageItem[];
  tags: TagDetail[];
  selectedTagCodes: number[];
};

export type ReviewDetailResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ReviewDetail;
};

export type UpdateReviewResult = {
  id: number;
  content: string;
};

export type UpdateReviewResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: UpdateReviewResult;
};