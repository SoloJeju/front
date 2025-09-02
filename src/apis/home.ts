import axios from 'axios';
import type {
  ResponseLatestReviewsDto,
  ResponseRecommendedChatRoomsDto,
  ResponseTodayRecommendedSpotsDto,
} from '../types/home';
// import type { ResponseHomeListDto } from '../types/home';

export const getTodayRecommendedSpots =
  async (): Promise<ResponseTodayRecommendedSpotsDto> => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/home/recommended-spots`
    );

    return data;
  };

export const getLatestReviews = async (): Promise<ResponseLatestReviewsDto> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/home/latest-reviews`
  );

  return data;
};

export const getRecommendedChatRooms =
  async (): Promise<ResponseRecommendedChatRoomsDto> => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/home/recommended-rooms`
    );

    return data;
  };

// export const getHomeList = async (): Promise<ResponseHomeListDto> => {
//   const { data } = await axios.get(`/api/home`);

//   return data;
// };
