import { authAxios } from './axios';
import type { ReviewTagsResponse, CreateReviewPayload, CreateReviewResponse } from '../types/review';
import type { CommonResponse } from '../types/common'; 

export const getReviewTags = async (contentTypeId: number): Promise<ReviewTagsResponse> => {
  const { data } = await authAxios.get(`/api/reviews/${contentTypeId}`);
  return data;
};

export const createReview = async (payload: CreateReviewPayload): Promise<CreateReviewResponse> => {
  const { data } = await authAxios.post(`/api/reviews`, payload);
  return data;
};

export const verifyReceipt = async (contentId: number, file: File): Promise<CommonResponse<boolean>> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await authAxios.post(
    `/api/reviews/${contentId}/receipt`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};