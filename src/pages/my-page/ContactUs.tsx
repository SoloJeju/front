import React, { useState, useRef } from 'react';
import { FiInfo } from 'react-icons/fi';
import BackHeader from '../../components/common/Headers/BackHeader';
import ImageIcon from '/src/assets/imageIcon.svg?react';

const ContactUs = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Selected files:', selectedFiles);
    alert('문의가 제출되었습니다!');
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="font-Pretendard bg-white min-h-screen">
      {/* 헤더 영역 */}
      <div className="w-full max-w-[480px] mx-auto">
        <BackHeader title="1:1 문의하기" />
      </div>

      {/* 메인 배경 색상 영역 */}
      <div className="bg-[#F78938] min-h-screen">
        <div className="w-full max-w-[480px] mx-auto pb-24">
          <main className="p-6">
            <form id="inquiry-form" onSubmit={handleSubmit}>
              <div className="bg-white rounded-[20px] shadow-lg p-6 space-y-6">
                {/* 문의 유형 */}
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="inquiry-type"
                    className="text-sm font-bold text-gray-800"
                  >
                    문의 유형
                  </label>
                  <select
                    id="inquiry-type"
                    className="flex-1 max-w-[200px] py-1 px-3 border border-[#D9D9D9] rounded-[20px] bg-white appearance-none focus:outline-none focus:border-black"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.2em 1.2em',
                    }}
                  >
                    <option>계정 문의</option>
                    <option>오류 신고</option>
                    <option>이용 문의</option>
                    <option>기타</option>
                  </select>
                </div>

                {/* 제목 */}
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-bold text-gray-800"
                  >
                    제목
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full p-1 py-1 px-3 border border-[#D9D9D9] rounded-[20px] focus:outline-none focus:border-black"
                  />
                </div>

                {/* 문의 내용 + 파일 첨부 */}
                <div>
                  <label
                    htmlFor="content"
                    className="block mb-2 text-sm font-bold text-gray-800 flex items-center justify-between"
                  >
                    내용
                    <div className="relative group inline-block">
                      <FiInfo
                        className="text-[#F78938] cursor-pointer"
                        size={18}
                      />
                      <div className="absolute z-50 right-0 top-6 w-64 p-2 bg-white border border-[#D9D9D9] rounded-lg text-xs font-light text-[#000000] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity leading-relaxed">
                        문의 내용은 저장되며, 서비스 개선을 위해 활용될 수
                        있습니다. 비방·비하·욕설 등 부적절한 내용은 법적 책임을
                        받을 수 있습니다.
                      </div>
                    </div>
                  </label>

                  <div className="relative">
                    <textarea
                      id="content"
                      rows={10}
                      className="w-full p-3 border border-[#D9D9D9] rounded-[20px] resize-none focus:outline-none focus:border-black"
                      placeholder="문의 내용을 입력해주세요"
                    ></textarea>

                    {/* 파일 첨부 버튼 - textarea 왼쪽 하단 */}
                    <button
                      type="button"
                      onClick={handleIconClick}
                      className="absolute bottom-3 left-3 p-1 rounded-md hover:bg-gray-100"
                    >
                      <ImageIcon />
                    </button>
                  </div>

                  {/* 숨겨진 파일 input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*, video/*"
                    className="hidden"
                  />

                  {/* 첨부 파일 목록 */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-xs text-gray-700"
                        >
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="ml-2 text-gray-500 hover:text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 문의 작성하기 버튼 */}
                <div className="border-t border-[#FFCEAA] pt-4">
                  <button
                    type="submit"
                    className="w-full text-base font-SemiBold text-center text-[#F78938] cursor-pointer"
                  >
                    문의 작성하기
                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>

      {/* 하단 제출 버튼 */}
      <div className="fixed bottom-0 w-full max-w-[480px] p-4 bg-white">
        <button
          type="submit"
          form="inquiry-form"
          className="w-full p-3 text-white rounded-lg bg-primary hover:bg-orange-600 transition-colors"
        >
          제출하기
        </button>
      </div>
    </div>
  );
};

export default ContactUs;
