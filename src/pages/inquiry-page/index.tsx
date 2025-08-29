import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInquiryCategories, createInquiry } from '../../apis/inquiry';
import { useImageUpload, validateImageFile } from '../../apis/s3';
import type { InquiryCategoryInfo, CreateInquiryRequest } from '../../types/inquiry';
import toast from 'react-hot-toast';
import type { InquiryCategory } from '../../types/inquiry';

const InquiryPage: React.FC = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<InquiryCategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 공통 이미지 업로드 훅 사용
  const { uploadedImage, isUploading, uploadImage, removeImage } = useImageUpload();

  useEffect(() => {
    fetchCategories();
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getInquiryCategories();
      if (response.isSuccess) {
        setCategories(response.result);
        if (response.result.length > 0) {
          setSelectedCategory(response.result[0].code);
        }
      } else {
        // API 응답이 실패하거나 데이터가 없을 때 임시 데이터 사용
        const fallbackCategories: InquiryCategoryInfo[] = [
          {
            code: 'GENERAL',
            name: '일반 문의',
            description: '기타 일반적인 문의사항'
          },
          {
            code: 'TECHNICAL',
            name: '기술 문의',
            description: '앱 사용 중 발생하는 기술적 문제'
          },
          {
            code: 'ACCOUNT',
            name: '계정 문의',
            description: '로그인, 회원가입, 계정 관련 문의'
          },
          {
            code: 'PAYMENT',
            name: '결제 문의',
            description: '결제, 환불, 구독 관련 문의'
          },
          {
            code: 'REPORT',
            name: '신고 문의',
            description: '부적절한 콘텐츠나 사용자 신고'
          },
          {
            code: 'SUGGESTION',
            name: '건의사항',
            description: '서비스 개선을 위한 건의사항'
          },
          {
            code: 'COMPLAINT',
            name: '불만사항',
            description: '서비스 이용 중 발생한 불만사항'
          },
          {
            code: 'OTHER',
            name: '기타',
            description: '위 카테고리에 해당하지 않는 문의'
          }
        ];
        setCategories(fallbackCategories);
        setSelectedCategory(fallbackCategories[0].code);
      }
    } catch (error) {
      console.error('문의 카테고리 조회 오류:', error);
      
      // 에러 발생 시에도 임시 데이터 사용
      const fallbackCategories: InquiryCategoryInfo[] = [
        {
          code: 'GENERAL',
          name: '일반 문의',
          description: '기타 일반적인 문의사항'
        },
        {
          code: 'TECHNICAL',
          name: '기술 문의',
          description: '앱 사용 중 발생하는 기술적 문제'
        },
        {
          code: 'ACCOUNT',
          name: '계정 문의',
          description: '로그인, 회원가입, 계정 관련 문의'
        },
        {
          code: 'PAYMENT',
          name: '결제 문의',
          description: '결제, 환불, 구독 관련 문의'
        },
        {
          code: 'REPORT',
          name: '신고 문의',
          description: '부적절한 콘텐츠나 사용자 신고'
        },
        {
          code: 'SUGGESTION',
          name: '건의사항',
          description: '서비스 개선을 위한 건의사항'
        },
        {
          code: 'COMPLAINT',
          name: '불만사항',
          description: '서비스 이용 중 발생한 불만사항'
        },
        {
          code: 'OTHER',
          name: '기타',
          description: '위 카테고리에 해당하지 않는 문의'
        }
      ];
      setCategories(fallbackCategories);
      setSelectedCategory(fallbackCategories[0].code);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 공통 파일 검증 함수 사용
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.errorMessage || '파일 검증에 실패했습니다.');
        return;
      }
      
      // 공통 업로드 함수 사용
      uploadImage(file).then((result) => {
        if (result.success) {
          toast.success('이미지가 업로드되었습니다.');
        } else {
          toast.error(result.error || '이미지 업로드에 실패했습니다.');
        }
      });
    }
  };

  const handleRemoveImage = async () => {
    const result = await removeImage();
    if (result.success) {
      toast.success('이미지가 삭제되었습니다.');
    } else {
      toast.error(result.error || '이미지 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      toast.error('문의 카테고리를 선택해주세요.');
      return;
    }

    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const inquiryData: CreateInquiryRequest = {
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory as InquiryCategory,
        attachmentUrls: attachmentUrls.filter(url => url.trim() !== ''),
        ...(uploadedImage && { 
          imageUrl: uploadedImage.url,
          imageName: uploadedImage.name
        }),
      };

      const response = await createInquiry(inquiryData);
      
      if (response.isSuccess) {
        toast.success('문의가 등록되었습니다.');
        navigate('/inquiry/my');
      } else {
        toast.error(response.message || '문의 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('문의 등록 오류:', error);
      toast.error('문의 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAttachmentUrl = () => {
    setAttachmentUrls([...attachmentUrls, '']);
  };

  const removeAttachmentUrl = (index: number) => {
    const newUrls = attachmentUrls.filter((_, i) => i !== index);
    setAttachmentUrls(newUrls);
  };

  const updateAttachmentUrl = (index: number, value: string) => {
    const newUrls = [...attachmentUrls];
    newUrls[index] = value;
    setAttachmentUrls(newUrls);
  };

  const getSelectedCategoryName = () => {
    const selected = categories.find(category => category.code === selectedCategory);
    return selected ? selected.name : '문의 카테고리를 선택해주세요';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-Pretendard">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F78938] mx-auto"></div>
          <p className="mt-4 text-[#666666]">문의 카테고리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-Pretendard">
      {/* 헤더 */}
      <header className="relative bg-[#F78938]">
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="float-left bg-[#F78938] text-white text-[12px] px-3 py-[6px] rounded-full border border-white/70 hover:bg-[#F78938]/90 transition-colors"
          >
            ← 뒤로
          </button>
          <div className="clear-both" />
        </div>
        <div className="px-4 pb-4 text-center">
          <h1 className="text-[20px] font-semibold text-white">1:1 문의</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-4 pb-12">
        {/* 안내 메시지 */}
        <section className="mt-6 p-4 bg-[#FFF8F0] border border-[#FFCEAA] rounded-xl">
          <h2 className="text-[#F78938] text-sm mb-2 font-medium">문의 안내</h2>
          <p className="text-[#666666] text-sm">
            궁금한 점이나 건의사항이 있으시면 언제든 문의해주세요. 
            빠른 시일 내에 답변드리도록 하겠습니다.
          </p>
        </section>

        {/* 문의 폼 */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* 카테고리 선택 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-3 font-medium">문의 카테고리 <span className="text-red-500">*</span></h3>
            
            {/* 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 border-2 border-[#FFCEAA] rounded-xl bg-white text-left focus:ring-2 focus:ring-[#F78938] focus:border-[#F78938] transition-colors hover:border-[#F78938]"
              >
                <span className={selectedCategory ? 'text-[#262626]' : 'text-[#B4B4B4]'}>
                  {getSelectedCategoryName()}
                </span>
                <svg 
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666666] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#FFCEAA] rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category.code}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.code);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#FFF8F0] transition-colors border-b border-[#FFCEAA] last:border-b-0"
                    >
                      <div className="font-medium text-[#262626]">{category.name}</div>
                      <div className="text-xs text-[#666666] mt-1">{category.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 제목 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-2 font-medium">제목 <span className="text-red-500">*</span></h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력해주세요 (최대 200자)"
              maxLength={200}
              className="w-full px-4 py-3 border border-[#FFCEAA] rounded-xl focus:ring-2 focus:ring-[#F78938] focus:border-[#F78938] font-Pretendard"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-[#666666]">
                구체적이고 명확한 제목을 작성해주세요.
              </span>
              <span className="text-sm text-[#B4B4B4]">
                {title.length}/200
              </span>
            </div>
          </section>

          {/* 내용 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-2 font-medium">내용 <span className="text-red-500">*</span></h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 자세히 입력해주세요 (최대 5000자)"
              maxLength={5000}
              rows={6}
              className="w-full px-4 py-3 border border-[#FFCEAA] rounded-xl focus:ring-2 focus:ring-[#F78938] focus:border-[#F78938] resize-none font-Pretendard"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-[#666666]">
                문제 상황과 요청사항을 구체적으로 설명해주세요.
              </span>
              <span className="text-sm text-[#B4B4B4]">
                {content.length}/5000
              </span>
            </div>
          </section>

          {/* 이미지 첨부 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-2 font-medium">이미지 첨부 (선택사항)</h3>
            
            {/* 이미지 업로드 버튼 */}
            {!uploadedImage && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-6 border-2 border-dashed border-[#FFCEAA] rounded-xl bg-[#FFF8F0] hover:border-[#F78938] hover:bg-[#FFF8F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  <svg className="w-8 h-8 text-[#F78938] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-[#F78938] font-medium">
                    {isUploading ? '업로드 중...' : '이미지 선택'}
                  </span>
                </div>
                <p className="text-xs text-[#666666] mt-1">최대 5MB, JPG, PNG, GIF</p>
              </button>
            )}

            {/* 업로드된 이미지 */}
            {uploadedImage && (
              <div className="relative">
                <img
                  src={uploadedImage.url}
                  alt="첨부된 이미지"
                  className="w-full h-32 object-cover rounded-xl border-2 border-[#FFCEAA]"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </section>

          {/* 첨부파일 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-2 font-medium">첨부파일 (선택사항)</h3>
            <div className="space-y-3">
              {attachmentUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateAttachmentUrl(index, e.target.value)}
                    placeholder="파일 URL을 입력해주세요 (예: 이미지, 문서 등)"
                    className="flex-1 px-4 py-3 border border-[#FFCEAA] rounded-xl focus:ring-2 focus:ring-[#F78938] focus:border-[#F78938] font-Pretendard"
                  />
                  {attachmentUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttachmentUrl(index)}
                      className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAttachmentUrl}
                className="px-4 py-2 text-[#F78938] border border-[#F78938] rounded-lg hover:bg-[#FFF8F0] transition-colors"
              >
                + 첨부파일 추가
              </button>
            </div>
            <p className="text-sm text-[#666666] mt-2">
              이미지나 문서 등의 URL을 입력하여 문의 내용을 보완할 수 있습니다.
            </p>
          </section>

          {/* 제출 버튼 */}
          <section className="pt-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-3 border border-[#FFCEAA] text-[#666666] rounded-xl hover:bg-[#FFF8F0] transition-colors font-Pretendard"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedCategory || !title.trim() || !content.trim()}
                className="flex-1 px-4 py-3 bg-[#F78938] text-white rounded-xl hover:bg-[#F78938]/90 disabled:bg-[#B4B4B4] disabled:cursor-not-allowed transition-colors font-Pretendard"
              >
                {isSubmitting ? '문의 등록 중...' : '문의 등록'}
              </button>
            </div>
          </section>
        </form>

        {/* 안내사항 */}
        <section className="mt-8 p-4 bg-[#FFF8F0] border border-[#FFCEAA] rounded-xl">
          <h3 className="text-[#F78938] text-sm mb-2 font-medium">📋 문의 안내사항</h3>
          <ul className="text-sm text-[#666666] space-y-1">
            <li>• 문의 접수 후 1-2일 내 답변드립니다.</li>
            <li>• 긴급한 문의는 고객센터로 직접 연락해주세요.</li>
            <li>• 계정 관련 문의는 로그인 후 이용해주세요.</li>
            <li>• 첨부파일은 이미지, PDF 등 공개 가능한 파일만 첨부해주세요.</li>
            <li>• 이미지 첨부 시 최대 5MB까지 가능합니다.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default InquiryPage;
