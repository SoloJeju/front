import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Headers/BackHeader';
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

const MOCK_MOMENTS = [
  '1인 좌석이 잘 되어있어요',
  '직원이 친절해요',
  '혼밥하기 딱 좋아요',
  '웨이팅 없이 들어갔어요',
  '부담없는 가격이에요',
];

const WriteReviewPage = () => {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedMoments, setSelectedMoments] = useState<string[]>([]);
  const [moments, setMoments] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard' | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    setMoments(MOCK_MOMENTS);
  }, []);

  const toggleMoment = (moment: string) => {
    if (selectedMoments.includes(moment)) {
      setSelectedMoments(prev => prev.filter(m => m !== moment));
    } else {
      if (selectedMoments.length >= 3) return;
      setSelectedMoments(prev => [...prev, moment]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        setSelectedImages(prev => [...prev, ...files]);
    }};

  return (
    <div className="flex justify-center bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] pb-10">
        <Header title="리뷰 작성"/>
        
        <div className="flex flex-col gap-6 pt-3 font-['Pretendard']">
          <div>
            <label className="text-black text-base font-medium leading-none">장소</label>
            <div className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2" onClick={() => navigate('/search')}>
              <input
                type="text"
                placeholder="장소를 선택해주세요"
                className="w-full focus:outline-none font-medium"
                readOnly/>
              <MapIcon/>
            </div>
          </div>
          <div>
            <label className="text-black text-base font-medium leading-none">날짜</label>
            <div className="flex items-center border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm justify-between mt-2" onClick={() => setIsCalendarOpen(true)}>
              <input
                type="text"
                placeholder="방문 날짜를 선택해주세요"
                className="w-full focus:outline-none font-medium"
                readOnly/>
              <CalendarIcon/>
            </div>
          </div>
            <div>
                <label className="text-black text-base font-medium leading-none">혼놀 난이도는 어땠나요?</label>
                <div className="flex flex-row justify-between items-center px-8 mt-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setDifficulty('easy')}
                      className="flex flex-col items-center">
                      {difficulty === 'easy' ? <Easy /> : <NoEasy />}
                      <span className={`text-s mt-1 font-medium ${difficulty === 'easy' ? 'text-[#006259]' : 'text-[#B4B4B4]'}`}>쉬워요 </span> </button>

                    <button
                      type="button"
                      onClick={() => setDifficulty('normal')}
                      className="flex flex-col items-center">
                      {difficulty === 'normal' ? <Normal /> : <NoNormal />}
                      <span className={`text-s mt-1 font-medium ${difficulty === 'normal' ? 'text-[#F78938]' : 'text-[#B4B4B4]'}`}>보통이에요</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDifficulty('hard')}
                      className="flex flex-col items-center">
                      {difficulty === 'hard' ? <Hard /> : <NoHard />}
                      <span className={`text-s mt-1 font-medium ${difficulty === 'hard' ? 'text-[#FF3E3E]' : 'text-[#B4B4B4]'}`}>어려웠어요</span>
                    </button>
                </div>
            </div>
          <div>
           <div className="flex flex-row items-center justify-between pb-1">
              <label className="text-black text-base font-medium leading-none">기억에 남는 순간을 골라주세요</label>
              <span className="text-xs text-[#B4B4B4]">최대 3개</span>
            </div>
            <div className="flex flex-col gap-2 mt-5">
                {moments.map((moment, idx) => {
                const isSelected = selectedMoments.includes(moment);
                return (
                    <button
                    key={idx}
                    type="button"
                    onClick={() => toggleMoment(moment)}
                    className={`text-left px-4 py-2 rounded-xl text-base border ${
                        isSelected ? 'text-[#F78937] border-[#F78937] border-[1.5px] font-medium' : 'bg-[#FFFFFD] text-[#5D5D5D] border-[#D9D9D9]'}`}>
                    {moment}
                    </button>);
                })}
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-between">
              <label className="text-black text-base font-medium leading-none">리뷰 작성</label>
            </div>
            <div className="relative">
                <textarea
                    placeholder="리뷰를 작성해주세요!"
                    rows={5}
                    className="w-full mt-2 border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none font-medium"/>

                <label className="absolute bottom-4 left-4 cursor-pointer">
                    <ImageIcon className="w-6 h-6 text-[#B4B4B4]" />
                    <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}/>
                </label>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="max-w-[480px] mx-auto px-4 py-3">
              <button className="w-full bg-[#F78938] text-white py-4 rounded-[10px] text-base font-semibold leading-snug">
                작성 완료
              </button>
            </div>
          </div>
        </div>
        {selectedImages.length > 0 && (
  <div className="mt-4 overflow-x-auto">
    <div className="flex gap-2 w-max">
      {selectedImages.map((image, idx) => (
            <div key={idx} className="relative w-24 h-24 flex-shrink-0">
            <img
                src={URL.createObjectURL(image)}
                alt={`미리보기 ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg"/>
            <button
                type="button"
                onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                className="absolute top-[-8px] right-[-8px] bg-white rounded-full p-1 shadow-md">
                <CloseIcon className="w-4 h-4 text-gray-500" />
            </button>
            </div>
        ))}
        </div>
    </div>
    )}


      </div>
    </div>
  );
};
export default WriteReviewPage;