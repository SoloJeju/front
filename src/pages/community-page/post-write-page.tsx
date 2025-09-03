import { useCallback, useRef, useState } from 'react';
import CategoryGroup from '../../components/common/Category/Category';
import ImageIcon from '/src/assets/imageIcon.svg';
import CloseIcon from '../../assets/closeIcon.svg';
import InputTitle from '../../components/CommunityPage/InputTitle';
import InputContent from '../../components/CommunityPage/InputContent';
import {
  filterCategoryEntoKo,
  filterCategoryKoToEn,
} from '../../utils/filterCategory';
import toast from 'react-hot-toast';
import { useImageUpload } from '../../apis/s3';
import { createPost, patchPost } from '../../apis/post';
import { useLocation, useNavigate } from 'react-router-dom';
import { queryClient } from '../../App';

export default function PostWritePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const prevTitle = location?.state?.title;
  const prevContent = location?.state?.content;
  const prevCategory = location?.state?.category;
  const prevImages = location?.state?.images;
  const postId = location?.state?.postId;

  const [selected, setSelected] = useState(
    prevCategory
      ? (filterCategoryEntoKo(prevCategory) ?? '궁금해요')
      : '궁금해요'
  );
  const [title, setTitle] = useState(prevTitle ? prevTitle : '');
  const [content, setContent] = useState(prevContent ? prevContent : '');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<File[]>([]);
  // 삭제된 기존 이미지 (imageName만 저장)
  const [deletedPrevImages, setDeletedPrevImages] = useState<string[]>([]);
  const { uploadImage, isUploading, removeImage } = useImageUpload();

  // 이미지 선택을 위한 파일 탐색기 열기
  const handleUploadImage = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  // 새로 선택된 이미지
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (!file) return;

    const imageFile = Array.from(file);
    setImages((prev) => [...prev, ...imageFile]);
  };

  // 새로 추가한 이미지 삭제
  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => index !== idx));
  };

  // 기존 이미지 삭제
  const handleDeletePrevImage = (imageName: string) => {
    setDeletedPrevImages((prev) => [...prev, imageName]);
  };

  const handleCreatePost = async () => {
    try {
      // s3 이미지 업로드
      const uploadedUrls: string[] = [];
      const uploadedNames: string[] = [];

      for (const file of images) {
        const res = await uploadImage(file);

        if (res.success) {
          if (res.data?.imageUrl) {
            uploadedUrls.push(res.data.imageUrl);
          }
          if (res.data?.imageName) {
            uploadedNames.push(res.data.imageName);
          }
        } else {
          console.error('이미지 업로드 실패', res.error);
        }
      }

      // 게시글 생성
      const postData = {
        title,
        content,
        postCategory: filterCategoryKoToEn(selected) || 'QUESTION',
        imageUrls: uploadedUrls,
        imageNames: uploadedNames,
      };

      await createPost(postData);
      toast.success('게시글이 작성 완료!');
      navigate(`/community`);
    } catch (e) {
      console.error(e);
      toast.error('게시글 작성 실패! 잠시 후 다시 시도해주세용...');
    }
  };

  const handleModifyPost = async () => {
    try {
      const newImageUrls: string[] = [];
      const newImageNames: string[] = [];

      // 새로 업로드된 이미지 처리
      for (const file of images) {
        const res = await uploadImage(file);
        if (res.success && res.data) {
          newImageUrls.push(res.data.imageUrl);
          newImageNames.push(res.data.imageName);
        }
      }

      // 삭제된 기존 이미지 S3에서 제거
      for (const delName of deletedPrevImages) {
        await removeImage(delName);
      }

      // 기존 이미지 중 삭제되지 않은 것만 남김
      const finalPrevImages =
        prevImages?.filter(
          (img: { imageName: string }) =>
            !deletedPrevImages.includes(img.imageName)
        ) || [];

      // 최종 이미지 목록
      const finalImageUrls = [
        ...finalPrevImages.map((img: { imageUrl: string }) => img.imageUrl),
        ...newImageUrls,
      ];
      const finalImageNames = [
        ...finalPrevImages.map((img: { imageName: string }) => img.imageName),
        ...newImageNames,
      ];

      const postData = {
        title,
        content,
        postCategory: filterCategoryKoToEn(selected) || 'QUESTION',
        newImageUrls: finalImageUrls,
        newImageNames: finalImageNames,
        deleteImageNames: deletedPrevImages,
      };

      await patchPost({ postId: Number(postId), body: postData });

      // 수정 후 게시글 상세 정보 캐싱 업데이트
      queryClient.invalidateQueries({
        queryKey: ['postDetail', Number(postId)],
      });
      toast.success('게시글이 수정되었습니다!');
      navigate(`/community`);
    } catch (e) {
      console.error(e);
      toast.error('게시글 수정 실패! 잠시 후 다시 시도해주세용...');
    }
  };

  return (
    <>
      <CategoryGroup
        selected={selected}
        setSelected={(type: string) =>
          setSelected(type as '궁금해요' | '동행제안' | '혼행꿀팁')
        }
        isPostWrite={true}
      />

      <div className="pt-17 w-full max-w-[480px]">
        <InputTitle title={title} onChange={setTitle} />
        <InputContent content={content} onChange={setContent} />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {/* 새로 추가한 이미지 */}
        {images.map((img, idx) => (
          <div key={`new-${idx}`} className="relative">
            <img
              src={URL.createObjectURL(img)}
              alt={img.name}
              className="w-24 h-24 object-cover"
            />
            <button
              type="button"
              className="absolute top-[-8px] right-[-8px] bg-white rounded-full p-1 shadow-md"
              onClick={() => handleDeleteImage(idx)}
            >
              <img src={CloseIcon} alt="이미지 삭제" className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* 기존 이미지 */}
        {prevImages &&
          prevImages.map(
            (img: { imageUrl: string; imageName: string }, idx: number) =>
              !deletedPrevImages.includes(img.imageName) && (
                <div key={`prev-${idx}`} className="relative">
                  <img
                    src={img.imageUrl}
                    alt={img.imageName}
                    className="w-24 h-24 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-[-8px] right-[-8px] bg-white rounded-full p-1 shadow-md"
                    onClick={() => handleDeletePrevImage(img.imageName)}
                  >
                    <img
                      src={CloseIcon}
                      alt="이미지 삭제"
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              )
          )}
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="pt-1 w-8 h-8"
          onClick={handleUploadImage}
        >
          <img
            src={ImageIcon}
            alt="이미지 추가"
            className="fixed bottom-16 ml-1 w-8 h-8 cursor-pointer"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
        </button>

        <button
          type="button"
          className="fixed bottom-1 left-0 right-0 mx-auto w-[calc(100%-2rem)] max-w-[480px] h-[54px] py-4 bg-[#F78938] font-[pretendard] font-semibold text-white text-base rounded-[10px] cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!title.trim() || !content.trim() || isUploading}
          onClick={prevTitle ? handleModifyPost : handleCreatePost}
        >
          {isUploading ? '업로드 중...' : prevTitle ? '수정 완료' : '작성 완료'}
        </button>
      </div>
    </>
  );
}
