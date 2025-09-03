import { useState } from 'react';
import { deleteImageFromS3, uploadImageToS3 } from '../apis/s3';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await uploadImageToS3(file);

      if (response.isSuccess) {
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

  const removeImage = async (fileName: string) => {
    try {
      const response = await deleteImageFromS3(fileName);
      if (response.isSuccess) {
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
    uploadImage,
    removeImage,
    isUploading,
  };
};
