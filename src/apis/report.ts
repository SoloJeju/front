import axios from 'axios';
import type {
  CreateReportRequest,
  ReportResponse,
  ReportReasonsResponse,
  MyReportsResponse,
} from '../types/report';
import type { CommonResponse } from '../types/common';

// 토큰을 헤더에 포함하는 함수
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 신고 접수
export const createReport = async (
  reportData: CreateReportRequest
): Promise<CommonResponse<ReportResponse>> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/reports`,
    reportData,
    { headers: getAuthHeaders() }
  );
  return data;
};

// 신고 사유 목록 조회
export const getReportReasons = async (): Promise<CommonResponse<ReportReasonsResponse>> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/reports/reasons`
  );
  return data;
};

// 내 신고 내역 조회
export const getMyReports = async (
  page: number = 1,
  size: number = 10,
  status?: string
): Promise<CommonResponse<MyReportsResponse>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (status) {
    params.append('status', status);
  }

  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/reports/my-reports?${params}`,
    { headers: getAuthHeaders() }
  );
  return data;
};

// 이미지 업로드 (S3 공통 함수 사용)
export { uploadImageToS3 as uploadImage } from './s3';

// 이미지 삭제 (S3 공통 함수 사용)
export { deleteImageFromS3 as deleteImage } from './s3';
