import { publicAxios } from './axios';
import type {
  GetTouristSpotsParams,
  ResponseSpotChatRoomDto,
  ResponseSpotDetailDto,
  ResponseSpotImagesDto,
  ResponseSpotReviewDto,
  ResponseTouristListDto,
} from '../types/tourist';

export const getTouristSpots = async (
  params: GetTouristSpotsParams
): Promise<ResponseTouristListDto> => {
  const { data } = await publicAxios.get('/api/tourist-spots', { params });
  return data;
};

export const getTouristDetail = async (
  contentId: number,
  contentTypeId: number
): Promise<ResponseSpotDetailDto> => {
  const { data } = await publicAxios.get(
    `/api/tourist-spots/${contentId}/detail`,
    {
      params: {
        contentId,
        contentTypeId,
      },
    }
  );
  return data;
};

export const getTouristGroups = async (
  contentId: number
): Promise<ResponseSpotChatRoomDto> => {
  const { data } = await publicAxios.get(
    `/api/tourist-spots/${contentId}/groups`
  );
  return data;
};

export const getTouristReviews = async ({
  contentId,
  cursor,
  size = 10,
}: {
  contentId: number;
  cursor: string | undefined;
  size?: number;
}): Promise<ResponseSpotReviewDto> => {
  const { data } = await publicAxios.get(
    `/api/tourist-spots/${contentId}/reviews`,
    {
      params: {
        contentId,
        cursor,
        size,
      },
    }
  );
  return data;
};

export const getTouristImages = async ({
  contentId,
  cursor,
  size = 20,
}: {
  contentId: number;
  cursor: string | undefined;
  size: number;
}): Promise<ResponseSpotImagesDto> => {
  const { data } = await publicAxios.get(
    `/api/tourist-spots/${contentId}/images`,
    {
      params: {
        contentId,
        cursor,
        size,
      },
    }
  );
  return data;
};

export const getTouristSearch = async (
  keyword: string
): Promise<ResponseTouristListDto> => {
  const { data } = await publicAxios.post('/api/tourist-spots/search', {
    keyword: keyword,
  });
  return data;
};
