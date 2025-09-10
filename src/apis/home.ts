import type {
  ResponseLatestReviewsDto,
  ResponseRecommendedChatRoomsDto,
  ResponseTodayRecommendedSpotsDto,
} from '../types/home';
import { authAxios } from './axios';

export const getTodayRecommendedSpots =
  async (): Promise<ResponseTodayRecommendedSpotsDto> => {
    const { data } = await authAxios.get(`/api/home/recommended-spots`);

    return data;
  };

export const getLatestReviews = async (): Promise<ResponseLatestReviewsDto> => {
  const { data } = await authAxios.get(`/api/home/latest-reviews`);

  return data;
};

export const getRecommendedChatRooms =
  async (): Promise<ResponseRecommendedChatRoomsDto> => {
    const { data } = await authAxios.get(`/api/home/recommended-rooms`);

    return data;
  };
