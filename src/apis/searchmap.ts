import { authAxios } from "./axios";
import type { Place, GetPlaceListRequest } from "../types/searchmap";

export interface PlaceListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    spots: Place[];
    totalCount: number;
  };
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPlaceList = async (params: GetPlaceListRequest): Promise<PlaceListResponse> => {
  const { data } = await authAxios.get(`${BASE_URL}/api/tourist-spots/nearby`, {
    params,
  });
  return data;
};