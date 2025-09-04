import { authAxios } from './axios';
import type { ReviewTagsResponse, CreateReviewPayload, CreateReviewResponse } from '../types/review';

export const getReviewTags = async (contentTypeId: number): Promise<ReviewTagsResponse> => {
  const { data } = await authAxios.get(`/api/reviews/${contentTypeId}`);
  return data;
};

export const createReview = async (payload: CreateReviewPayload): Promise<CreateReviewResponse> => {
  const { data } = await authAxios.post(`/api/reviews`, payload);
  return data;
};
