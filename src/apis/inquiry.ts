import { authAxios, publicAxios } from './axios';
import type {
  CreateInquiryRequest,
  InquiryResponse,
  InquiryCategoriesResponse,
  MyInquiriesResponse,
} from '../types/inquiry';
import type { CommonResponse } from '../types/common';

// 1:1 문의 등록
export const createInquiry = async (
  inquiryData: CreateInquiryRequest
): Promise<CommonResponse<InquiryResponse>> => {
  const { data } = await authAxios.post(
    '/api/inquiries',
    inquiryData
  );
  return data;
};

// 내 문의 목록 조회
export const getMyInquiries = async (
  page: number = 1,
  size: number = 10,
  status?: string
): Promise<CommonResponse<MyInquiriesResponse>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (status) {
    params.append('status', status);
  }

  const { data } = await authAxios.get(
    `/api/inquiries/my?${params}`
  );
  return data;
};

// 문의 상세 조회
export const getInquiryDetail = async (id: number): Promise<CommonResponse<InquiryResponse>> => {
  const { data } = await authAxios.get(
    `/api/inquiries/${id}`
  );
  return data;
};

// 문의 카테고리 목록
export const getInquiryCategories = async (): Promise<CommonResponse<InquiryCategoriesResponse>> => {
  const { data } = await publicAxios.get(
    '/api/inquiries/categories'
  );
  return data;
};

// 이미지 업로드 (S3 공통 함수 사용)
export { uploadImageToS3 as uploadImage } from './s3';

// 이미지 삭제 (S3 공통 함수 사용)
export { deleteImageFromS3 as deleteImage } from './s3';
