import axios from 'axios';
import type { CommonResponse } from '../types/common';
import { useState } from 'react';

// 토큰을 헤더에 포함하는 함수
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// S3 이미지 업로드
export const uploadImageToS3 = async (
  file: File
): Promise<CommonResponse<{ imageName: string; imageUrl: string }>> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/image/upload`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};

// S3 이미지 삭제
export const deleteImageFromS3 = async (
  imageName: string
): Promise<CommonResponse<string>> => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/image/delete`,
    { headers: getAuthHeaders(), data: { imageName } }
  );
  return data;
};

// 파일 검증 함수
export const validateImageFile = (
  file: File
): { isValid: boolean; errorMessage?: string } => {
  // 파일 크기 체크 (5MB 제한)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, errorMessage: '파일 크기는 5MB 이하여야 합니다.' };
  }

  // 파일 타입 체크
  if (!file.type.startsWith('image/')) {
    return { isValid: false, errorMessage: '이미지 파일만 업로드 가능합니다.' };
  }

  return { isValid: true };
};

// 이미지 업로드 상태 타입
export type ImageUploadState = {
  url: string;
  name: string;
} | null;

// 이미지 업로드 훅 (선택사항)
export const useImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<ImageUploadState>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await uploadImageToS3(file);

      if (response.isSuccess) {
        setUploadedImage({
          url: response.result.imageUrl,
          name: response.result.imageName,
        });
        return { success: true, data: response.result };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      return { success: false, error: '이미지 업로드에 실패했습니다.' };
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (!uploadedImage)
      return { success: false, error: '삭제할 이미지가 없습니다.' };

    try {
      const response = await deleteImageFromS3(uploadedImage.name);
      if (response.isSuccess) {
        setUploadedImage(null);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('이미지 삭제 오류:', error);
      return { success: false, error: '이미지 삭제에 실패했습니다.' };
    }
  };

  return {
    uploadedImage,
    isUploading,
    uploadImage,
    removeImage,
    setUploadedImage,
  };
};
