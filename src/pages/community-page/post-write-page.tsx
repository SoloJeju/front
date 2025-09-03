import { useCallback, useRef, useState } from 'react';
import CategoryGroup from '../../components/common/Category/Category';
import ImageIcon from '/src/assets/imageIcon.svg';
import CloseIcon from '../../assets/closeIcon.svg';
import InputTitle from '../../components/CommunityPage/InputTitle';
import InputContent from '../../components/CommunityPage/InputContent';
import { filterCategoryKoToEn } from '../../utils/filterCategory';
import toast from 'react-hot-toast';
import { useImageUpload } from '../../apis/s3';
import { createPost } from '../../apis/post';
import { useNavigate } from 'react-router-dom';

export default function PostWritePage() {
  const [selected, setSelected] = useState('궁금해요');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const { uploadImage, isUploading } = useImageUpload();
  const navigate = useNavigate();

  // 이미지 선택을 위한 파일 탐색기 열기
  const handleUploadImage = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  // ui 이미지 렌더링
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (!file) return;

    const imageFile = Array.from(file);
    setImages((prev) => [...prev, ...imageFile]);
  };

  // ui 렌더링 이미지 삭제
  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => index !== idx));
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
      navigate(`/community`);
    } catch (e) {
      console.error(e);
      toast.error('게시글 작성 실패! 잠시 후 다시 시도해주세용...');
    }
  };

  return (
    <>
      <CategoryGroup
        selected={selected}
        setSelected={setSelected}
        isPostWrite={true}
      />

      <div className="pt-17 w-full max-w-[480px]">
        <InputTitle title={title} onChange={setTitle} />
        <InputContent content={content} onChange={setContent} />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {images.length > 0 &&
          images.map((img, idx) => (
            <div key={idx} className="relative">
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
          disabled={!title.trim() || !content.trim()}
          onClick={handleCreatePost}
        >
          {isUploading ? '업로드 중...' : '작성 완료'}
        </button>
      </div>
    </>
  );
}
