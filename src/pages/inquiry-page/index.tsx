import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInquiryCategories, createInquiry } from '../../apis/inquiry';
import type { InquiryCategoryInfo, CreateInquiryRequest } from '../../types/inquiry';
import toast from 'react-hot-toast';

const InquiryPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<InquiryCategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
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
        toast.error('문의 카테고리를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('문의 카테고리 조회 오류:', error);
      toast.error('문의 카테고리를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
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
        category: selectedCategory as any,
        attachmentUrls: attachmentUrls.filter(url => url.trim() !== ''),
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-Pretendard">
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
            <div className="space-y-3">
              {categories.map((category) => (
                <label
                  key={category.code}
                  className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                    selectedCategory === category.code
                      ? 'border-[#F78938] bg-[#FFF8F0]'
                      : 'border-[#FFCEAA] hover:border-[#F78938]'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.code}
                    checked={selectedCategory === category.code}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-[#262626]">{category.name}</div>
                    <div className="text-sm text-[#666666] mt-1">{category.description}</div>
                  </div>
                  {selectedCategory === category.code && (
                    <div className="ml-3">
                      <div className="w-5 h-5 bg-[#F78938] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </label>
              ))}
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

        {/* 문의 내역 보기 버튼 */}
        <section className="mt-6 text-center">
          <button
            onClick={() => navigate('/inquiry/my')}
            className="text-[#F78938] hover:text-[#F78938]/80 font-medium"
          >
            내 문의 내역 보기 →
          </button>
        </section>

        {/* 안내사항 */}
        <section className="mt-8 p-4 bg-[#FFF8F0] border border-[#FFCEAA] rounded-xl">
          <h3 className="text-[#F78938] text-sm mb-2 font-medium">📋 문의 안내사항</h3>
          <ul className="text-sm text-[#666666] space-y-1">
            <li>• 문의 접수 후 1-2일 내 답변드립니다.</li>
            <li>• 긴급한 문의는 고객센터로 직접 연락해주세요.</li>
            <li>• 계정 관련 문의는 로그인 후 이용해주세요.</li>
            <li>• 첨부파일은 이미지, PDF 등 공개 가능한 파일만 첨부해주세요.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default InquiryPage;
