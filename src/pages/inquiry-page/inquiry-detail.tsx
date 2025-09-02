import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInquiryDetail } from '../../apis/inquiry';
import type { InquiryResponse } from '../../types/inquiry';
import toast from 'react-hot-toast';

const InquiryDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState<InquiryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiryDetail = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await getInquiryDetail(parseInt(id));
        
        if (response.isSuccess) {
          setInquiry(response.result);
        } else {
          toast.error('문의 상세 정보를 불러오는데 실패했습니다.');
          navigate('/my-inquiries');
        }
      } catch (error) {
        console.error('문의 상세 조회 오류:', error);
        toast.error('문의 상세 정보를 불러오는데 실패했습니다.');
        navigate('/my-inquiries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiryDetail();
  }, [id, navigate]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { text: '대기중', color: 'bg-[#FFF8F0] text-[#F78938] border-[#FFCEAA]' },
      IN_PROGRESS: { text: '처리중', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      REPLIED: { text: '답변완료', color: 'bg-green-50 text-green-600 border-green-200' },
      CLOSED: { text: '완료', color: 'bg-gray-50 text-gray-600 border-gray-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: { text: '낮음', color: 'bg-gray-50 text-gray-600 border-gray-200' },
      NORMAL: { text: '보통', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      HIGH: { text: '높음', color: 'bg-orange-50 text-orange-600 border-orange-200' },
      URGENT: { text: '긴급', color: 'bg-red-50 text-red-600 border-red-200' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.NORMAL;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-Pretendard">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F78938] mx-auto"></div>
          <p className="mt-4 text-[#666666]">문의 상세 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-Pretendard">
        <div className="text-center">
          <p className="text-[#666666]">문의 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/my-inquiries')}
            className="mt-4 px-4 py-2 bg-[#F78938] text-white rounded-lg hover:bg-[#F78938]/90 transition-colors"
          >
            문의 내역으로 돌아가기
          </button>
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
          <h1 className="text-[20px] font-semibold text-white">문의 상세</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-4 pb-12">
        {/* 문의 정보 카드 */}
        <section className="mt-6">
          <div className="p-4 border border-[#FFCEAA] rounded-xl bg-white">
            {/* 제목과 상태 */}
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#262626] break-words flex-1 min-w-0 mr-4">
                {inquiry.title}
              </h2>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {getStatusBadge(inquiry.status)}
              </div>
            </div>

            {/* 카테고리와 우선순위 */}
            <div className="flex items-center justify-between text-sm text-[#666666] mb-4">
              <span>카테고리: {inquiry.categoryName}</span>
              {getPriorityBadge(inquiry.priority)}
            </div>

            {/* 작성자 정보 */}
            <div className="text-sm text-[#666666] mb-4">
              <p>작성자: {inquiry.userName} ({inquiry.userEmail})</p>
            </div>

            {/* 문의 내용 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#262626] mb-2">문의 내용</h3>
              <div className="p-3 bg-[#F8F9FA] rounded-lg text-[#262626] whitespace-pre-wrap">
                {inquiry.content}
              </div>
            </div>

            {/* 첨부파일 */}
            {inquiry.attachments && inquiry.attachments.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#262626] mb-2">첨부파일</h3>
                <div className="space-y-2">
                  {inquiry.attachments.map((attachment: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-[#F8F9FA] rounded-lg">
                      <svg className="w-4 h-4 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm text-[#666666]">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 이미지 */}
            {inquiry.imageUrl && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#262626] mb-2">첨부 이미지</h3>
                <img 
                  src={inquiry.imageUrl} 
                  alt={inquiry.imageName || '첨부 이미지'} 
                  className="max-w-full h-auto rounded-lg border border-[#FFCEAA]"
                />
              </div>
            )}

            {/* 답변 */}
            {inquiry.adminReply && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#262626] mb-2">관리자 답변</h3>
                <div className="p-3 bg-[#E8F5E8] rounded-lg text-[#262626] whitespace-pre-wrap">
                  {inquiry.adminReply}
                </div>
                {inquiry.repliedAt && (
                  <p className="text-xs text-[#666666] mt-2">
                    답변일: {new Date(inquiry.repliedAt).toLocaleDateString('ko-KR')}
                  </p>
                )}
              </div>
            )}

            {/* 작성일 */}
            <div className="text-xs text-[#B4B4B4]">
              <p>작성일: {new Date(inquiry.createdDate).toLocaleDateString('ko-KR')}</p>
              {inquiry.modifiedDate && inquiry.modifiedDate !== inquiry.createdDate && (
                <p>수정일: {new Date(inquiry.modifiedDate).toLocaleDateString('ko-KR')}</p>
              )}
            </div>
          </div>
        </section>

        {/* 하단 버튼 */}
        <section className="mt-6 flex gap-3">
          <button
            onClick={() => navigate('/my-inquiries')}
            className="flex-1 p-3 bg-[#F78938] text-white rounded-xl hover:bg-[#F78938]/90 transition-colors font-medium"
          >
            문의 내역으로
          </button>
          <button
            onClick={() => navigate('/inquiry')}
            className="flex-1 p-3 bg-white text-[#F78938] border-2 border-[#F78938] rounded-xl hover:bg-[#F78938] hover:text-white transition-all duration-200 font-medium"
          >
            새 문의 작성
          </button>
        </section>
      </main>
    </div>
  );
};

export default InquiryDetailPage;
