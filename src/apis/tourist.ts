import { publicAxios } from './axios';
import type { GetTouristSpotsParams, ResponseTouristListDto } from '../types/tourist';

export const getTouristSpots = async (params: GetTouristSpotsParams): Promise<ResponseTouristListDto> => {
    const { data } = await publicAxios.get('/api/tourist-spots', { params });
    return data;
};

export const getTouristDetail = async (contentId: number): Promise<ResponseTouristListDto> => {
    const { data } = await publicAxios.get(`/api/tourist-spots/${contentId}/detail`);
    return data;
};

export const getTouristGroups = async (contentId: number): Promise<ResponseTouristListDto> => {
    const { data } = await publicAxios.get(`/api/tourist-spots/${contentId}/groups`);
    return data;
};

export const getTouristReviews = async (contentId: number): Promise<ResponseTouristListDto> => {
    const { data } = await publicAxios.get(`/api/tourist-spots/${contentId}/reviews`);
    return data;
};

export const getTouristImages = async (contentId: number): Promise<ResponseTouristListDto> => {
    const { data } = await publicAxios.get(`/api/tourist-spots/${contentId}/images`);
    return data;
};

export const getTouristSearch = async (keyword: string): Promise<ResponseTouristListDto> => {
    const { data } = await publicAxios.post('/api/tourist-spots/search', {
        keyword: keyword,
    });
    return data;
};