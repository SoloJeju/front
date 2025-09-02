import { useCallback, useRef, useState } from 'react';
import CategoryGroup from '../../components/common/Category/Category';
import ImageIcon from '/src/assets/imageIcon.svg';
import CloseIcon from '../../assets/closeIcon.svg';
import InputTitle from '../../components/CommunityPage/InputTitle';
import InputContent from '../../components/CommunityPage/InputContent';

export default function PostWritePage() {
  const [selected, setSelected] = useState('전체');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleUploadImage = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (!file) return;

    const imageFile = Array.from(file);
    setImages((prev) => [...prev, ...imageFile]);
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => index !== idx));
  };

  return (
    <>
      <CategoryGroup selected={selected} setSelected={setSelected} />

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
        >
          작성 완료
        </button>
      </div>
    </>
  );
}
