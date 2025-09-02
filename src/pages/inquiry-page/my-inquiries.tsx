import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyInquiries } from '../../apis/inquiry';
import type { MyInquiry } from '../../types/inquiry';
import toast from 'react-hot-toast';

const MyInquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<MyInquiry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyInquiries = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMyInquiries(currentPage, 10, selectedStatus);
      
      if (response.isSuccess) {
        setInquiries(response.result.inquiries);
        setTotalPages(response.result.pagination.totalPages);
        setTotalElements(response.result.pagination.totalElements);
      } else {
        toast.error('문의 내역을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('문의 내역 조회 오류:', error);
      toast.error('문의 내역을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedStatus]);

  useEffect(() => {
    fetchMyInquiries();
  }, [fetchMyInquiries]);

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

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && inquiries.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-Pretendard">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F78938] mx-auto"></div>
          <p className="mt-4 text-[#666666]">문의 내역을 불러오는 중...</p>
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
          <h1 className="text-[20px] font-semibold text-white">내 문의 내역</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-4 pb-12">
        {/* 새로운 문의 작성 버튼 */}
        <section className="mt-6">
          <button
            onClick={() => navigate('/inquiry')}
            className="w-full p-3 bg-white text-[#F78938] border-2 border-[#F78938] rounded-xl hover:bg-[#F78938] hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>새로운 문의 작성하기</span>
            </div>
          </button>
        </section>

        {/* 상태 필터 */}
        <section className="mt-6 p-4 bg-[#FFF8F0] border border-[#FFCEAA] rounded-xl">
          <h3 className="text-[#F78938] text-sm mb-3 font-medium">상태별 필터</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === ''
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8F0] border border-[#FFCEAA]'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => handleStatusChange('PENDING')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'PENDING'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8F0] border border-[#FFCEAA]'
              }`}
            >
              대기중
            </button>
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'IN_PROGRESS'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8F0] border border-[#FFCEAA]'
              }`}
            >
              처리중
            </button>
            <button
              onClick={() => handleStatusChange('REPLIED')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'REPLIED'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8F0] border border-[#FFCEAA]'
              }`}
            >
              답변완료
            </button>
            <button
              onClick={() => handleStatusChange('CLOSED')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'CLOSED'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8F0] border border-[#FFCEAA]'
              }`}
            >
              완료
            </button>
          </div>
        </section>

        {/* 문의 내역 목록 */}
        <section className="mt-6">
          {inquiries.length === 0 ? (
            <div className="p-8 text-center bg-[#FFF8F0] border border-[#FFCEAA] rounded-xl">
              <div className="text-[#B4B4B4] mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#262626] mb-2">문의 내역이 없습니다</h3>
              <p className="text-[#666666] mb-4">
                {selectedStatus ? '해당 상태의 문의 내역이 없습니다.' : '아직 문의한 내역이 없습니다.'}
              </p>
              <button
                onClick={() => navigate('/inquiry')}
                className="px-4 py-2 bg-[#F78938] text-white rounded-lg hover:bg-[#F78938]/90 transition-colors"
              >
                첫 문의하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 border border-[#FFCEAA] rounded-xl bg-white">
                                     <div className="flex items-start justify-between">
                     <div className="flex items-start gap-3 flex-1 min-w-0">
                       <h3 
                         className="text-lg font-medium text-[#262626] break-words flex-1 min-w-0 cursor-pointer hover:text-[#F78938] transition-colors"
                         onClick={() => navigate(`/inquiry/${inquiry.id}`)}
                       >
                         {inquiry.title}
                       </h3>
                       <div className="flex flex-col gap-2 flex-shrink-0">
                         {getStatusBadge(inquiry.status)}
                       </div>
                     </div>
                   </div>
                                       <div className="flex items-center justify-between text-sm text-[#666666] mb-2">
                      <span>카테고리: {inquiry.categoryName}</span>
                      {getPriorityBadge(inquiry.priority)}
                    </div>
                  <div className="flex items-center gap-4 text-xs text-[#B4B4B4]">
                    <span>접수일: {new Date(inquiry.createdDate).toLocaleDateString('ko-KR')}</span>
                    {inquiry.hasAttachment && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        첨부파일
                      </span>
                    )}
                    {inquiry.isReplied && (
                      <span className="text-green-600 font-medium">답변완료</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <section className="mt-6 flex justify-center">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-[#666666] bg-white border border-[#FFCEAA] rounded-lg hover:bg-[#FFF8F0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-[#F78938] text-white'
                        : 'text-[#666666] bg-white border border-[#FFCEAA] hover:bg-[#FFF8F0]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-[#666666] bg-white border border-[#FFCEAA] rounded-lg hover:bg-[#FFF8F0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </nav>
          </section>
        )}

        {/* 요약 정보 */}
        <section className="mt-6 text-center text-sm text-[#666666]">
          총 {totalElements}건의 문의 내역이 있습니다.
        </section>
      </main>
    </div>
  );
};

export default MyInquiriesPage;
