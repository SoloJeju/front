import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useGetReviewDetail } from '../../hooks/review/useGetReviewDetail';
import { useUpdateReview } from '../../hooks/review/useUpdateReview';
import type { ImageItem, TagDetail, UpdateReviewPayload } from '../../types/review';
import CalendarIcon from '../../assets/calendar.svg?react';
import MapIcon from '../../assets/map.svg?react';
import Easy from '../../assets/EASY.svg?react';
import Normal from '../../assets/NORMAL.svg?react';
import Hard from '../../assets/HARD.svg?react';
import NoEasy from '../../assets/noEASY.svg?react';
import NoNormal from '../../assets/noNORMAL.svg?react';
import NoHard from '../../assets/noHARD.svg?react';
import CloseIcon from '../../assets/closeIcon.svg?react';
import ImageIcon from '../../assets/imageIcon.svg?react';
import Calendar from '../../components/Plus/CalendarPannel';
import StarIcon from '../../assets/Star.svg?react';
import NoStarIcon from '../../assets/noStar.svg?react';
dayjs.locale('ko');

const EditReviewPage = () => {
  const navigate = useNavigate();
  const { reviewId } = useParams<{ reviewId: string }>();
  const numericReviewId = Number(reviewId);
  const { uploadImage, isUploading: isImageUploading } = useImageUpload();
  const { data: reviewDetail, isLoading, isError, isSuccess } = useGetReviewDetail(numericReviewId);
  const { mutate: updateReviewMutate, isPending: isUpdating } = useUpdateReview();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [spotName, setSpotName] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<TagDetail[]>([]);
  const [selectedTagCodes, setSelectedTagCodes] = useState<number[]>([]);
  const [text, setText] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [existingImages, setExistingImages] = useState<ImageItem[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImageNames, setDeletedImageNames] = useState<string[]>([]);

  useEffect(() => {
    if (isSuccess && reviewDetail) {
      setSpotName(reviewDetail.content);
      setText(reviewDetail.text);
      setDifficulty(reviewDetail.difficulty);
      setSelectedDate(reviewDetail.visitDate);
      setRating(reviewDetail.rating);
      setAllTags(reviewDetail.tags);
      setSelectedTagCodes(reviewDetail.tags.filter(tag => tag.selected).map(tag => tag.code));
      setExistingImages(reviewDetail.images);
    }
  }, [reviewDetail, isSuccess]);

  const handleSubmit = async () => {
    if (!difficulty || !selectedDate || rating === 0) {
      alert('날짜, 별점, 난이도는 필수 입력 항목입니다.');
      return;
    }

    try {
      const newImageUrls: string[] = [];
      const newImageNames: string[] = [];

      if (newImages.length > 0) {
        const uploadPromises = newImages.map((imageFile) => uploadImage(imageFile));
        const uploadResults = await Promise.all(uploadPromises);

        for (const result of uploadResults) {
          if (result.success && result.data) {
            newImageUrls.push(result.data.imageUrl);
            newImageNames.push(result.data.imageName);
          } else {
            console.error('Image upload failed:', result.error);
            alert('일부 이미지 업로드에 실패했습니다. 다시 시도해주세요.');
            return;
          }
        }
      }

      const payload: UpdateReviewPayload = {
        text,
        difficulty,
        tagCodes: selectedTagCodes,
        visitDate: dayjs(selectedDate).format('YYYY-MM-DD'),
        rating,
        newImageUrls: newImageUrls.length > 0 ? newImageUrls : undefined,
        newImageNames: newImageNames.length > 0 ? newImageNames : undefined,
        deleteImageNames: deletedImageNames.length > 0 ? deletedImageNames : undefined,
      };

      updateReviewMutate({ reviewId: numericReviewId, payload }, {
        onSuccess: () => {
          alert('리뷰가 성공적으로 수정되었습니다.');
          navigate('/mypage/reviews');
        },
        onError: (error) => {
          console.error('Failed to update review:', error);
          alert('리뷰 수정에 실패했습니다.');
        },
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('리뷰 수정 중 오류가 발생했습니다.');
    }
  };

  const toggleTag = (code: number) => {
    setSelectedTagCodes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : prev.length < 3 ? [...prev, code] : prev
    );
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (existingImages.length + newImages.length + files.length > 10) {
        alert('이미지는 최대 10개까지 업로드할 수 있습니다.');
        return;
      }
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageNameToDelete: string) => {
    setExistingImages(prev => prev.filter(img => img.imageName !== imageNameToDelete));
    setDeletedImageNames(prev => [...prev, imageNameToDelete]);
  };

  const handleDateSelect = (start: string) => {
    setSelectedDate(start);
    setIsCalendarOpen(false);
  };

  if (isLoading) return <div className="text-center pt-40">로딩 중...</div>;
  if (isError) return <div className="text-center pt-40">오류가 발생했습니다.</div>;

  const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY. MM. DD (ddd)') : '';

  return (
    <div className="flex justify-center bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] pb-24">
        <div className="flex flex-col gap-6 pt-3 font-['Pretendard'] px-4">
          <div>
            <label className="text-black text-base font-medium leading-none">장소</label>
            <div className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2 bg-gray-100">
              <input
                type="text"
                className="w-full focus:outline-none font-medium bg-transparent"
                value={spotName || ''}
                readOnly
              />
              <MapIcon />
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">날짜</label>
            <div
              className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2 cursor-pointer"
              onClick={() => setIsCalendarOpen(true)}
            >
              <input
                type="text"
                placeholder="방문 날짜를 선택해주세요"
                className="w-full focus:outline-none font-medium bg-transparent cursor-pointer"
                value={formattedDate}
                readOnly
              />
              <CalendarIcon />
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">별점</label>
            <div className="flex flex-row gap-2 mt-3 items-center justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  {star <= rating ? (
                    <StarIcon className="w-10 h-10 text-[#FFD700]" />
                  ) : (
                    <NoStarIcon className="w-10 h-10 text-[#D9D9D9]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">혼놀 난이도는 어땠나요?</label>
            <div className="flex flex-row justify-between items-center px-8 mt-4 gap-4">
              <button type="button" onClick={() => setDifficulty('EASY')} className="flex flex-col items-center">
                {difficulty === 'EASY' ? <Easy /> : <NoEasy />}
                <span className={`text-s mt-1 font-medium ${difficulty === 'EASY' ? 'text-[#006259]' : 'text-[#B4B4B4]'}`}>쉬워요</span>
              </button>
              <button type="button" onClick={() => setDifficulty('MEDIUM')} className="flex flex-col items-center">
                {difficulty === 'MEDIUM' ? <Normal /> : <NoNormal />}
                <span className={`text-s mt-1 font-medium ${difficulty === 'MEDIUM' ? 'text-[#F78938]' : 'text-[#B4B4B4]'}`}>보통이에요</span>
              </button>
              <button type="button" onClick={() => setDifficulty('HARD')} className="flex flex-col items-center">
                {difficulty === 'HARD' ? <Hard /> : <NoHard />}
                <span className={`text-s mt-1 font-medium ${difficulty === 'HARD' ? 'text-[#FF3E3E]' : 'text-[#B4B4B4]'}`}>어려웠어요</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-row items-center justify-between pb-1">
              <label className="text-black text-base font-medium leading-none">기억에 남는 순간을 골라주세요</label>
              <span className="text-xs text-[#B4B4B4]">최대 3개</span>
            </div>
            <div className="flex flex-col gap-2 mt-5">
              {allTags.map((tag) => (
                <button
                  key={tag.code}
                  type="button"
                  onClick={() => toggleTag(tag.code)}
                  className={`text-left px-4 py-2 rounded-xl text-base border ${
                    selectedTagCodes.includes(tag.code)
                      ? 'text-[#F78937] border-[#F78937] border-[1.5px] font-medium'
                      : 'bg-[#FFFFFD] text-[#5D5D5D] border-[#D9D9D9]'
                  }`}
                >
                  {tag.description}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-black text-base font-medium leading-none">리뷰 작성</label>
            <div className="relative">
              <textarea
                placeholder="리뷰를 작성해주세요!"
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full mt-2 border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none font-medium"
              />
              <label className="absolute bottom-4 left-4 cursor-pointer">
                <ImageIcon className="w-6 h-6 text-[#B4B4B4]" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewImageChange} />
              </label>
            </div>
          </div>

          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex gap-2 w-max">
                {existingImages.map((image) => (
                  <div key={image.imageName} className="relative w-24 h-24 flex-shrink-0">
                    <img src={image.imageUrl} alt="기존 이미지" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeExistingImage(image.imageName)} className="absolute top-[-8px] right-[-8px] bg-white rounded-full p-1 shadow-md">
                      <CloseIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
                {newImages.map((image, idx) => (
                  <div key={idx} className="relative w-24 h-24 flex-shrink-0">
                    <img src={URL.createObjectURL(image)} alt={`미리보기 ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-[-8px] right-[-8px] bg-white rounded-full p-1 shadow-md">
                      <CloseIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white">
            <div className="max-w-[480px] mx-auto px-4 py-3">
              <button
                onClick={handleSubmit}
                className="w-full bg-[#F78938] text-white py-4 rounded-[10px] text-base font-semibold leading-snug disabled:bg-gray-400"
                disabled={isImageUploading || isUpdating}
              >
                {isImageUploading ? '이미지 업로드 중...' : isUpdating ? '수정 중...' : '수정 완료'}
              </button>
            </div>
          </div>
        </div>

        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/20" onClick={() => setIsCalendarOpen(false)}>
            <div className="w-full max-w-[480px] bg-white rounded-t-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <Calendar onSelect={handleDateSelect} mode="single" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditReviewPage;