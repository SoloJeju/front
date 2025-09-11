import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyReports } from '../../apis/report';
import type { MyReport } from '../../types/report';
import toast from 'react-hot-toast';

const MyReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<MyReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMyReports(currentPage, 10, selectedStatus);

      if (response.isSuccess) {
        setReports(response.result.reports);
        setTotalPages(response.result.pagination.totalPages);
        setTotalElements(response.result.pagination.totalElements);
      } else {
        toast.error('신고 내역을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 내역 조회 오류:', error);
      toast.error('신고 내역을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedStatus]);

  useEffect(() => {
    fetchMyReports();
  }, [fetchMyReports]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        text: '접수됨',
        color: 'bg-[#FFF8F0] text-[#F78938] border-[#FFCEAA]',
      },
      REVIEWED: {
        text: '검토완료',
        color: 'bg-blue-50 text-blue-600 border-blue-200',
      },
      ACTION_TAKEN: {
        text: '조치완료',
        color: 'bg-green-50 text-green-600 border-green-200',
      },
      REJECTED: {
        text: '반려',
        color: 'bg-red-50 text-red-600 border-red-200',
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getTargetTypeText = (type: string) => {
    const typeConfig = {
      USER: '사용자',
      POST: '게시물',
      COMMENT: '댓글',
    };
    return typeConfig[type as keyof typeof typeConfig] || type;
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-[Pretendard]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F78938] mx-auto"></div>
          <p className="mt-4 text-[#666666]">신고 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-[Pretendard]">
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
          <h1 className="text-[20px] font-semibold text-white">내 신고 내역</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-4 pb-12">
        {/* 상태 필터 */}
        <section className="mt-6 p-4 bg-[#FFF8F0] border border-[#FFCEAA] rounded-xl">
          <h3 className="text-[#F78938] text-sm mb-3 font-medium">
            상태별 필터
          </h3>
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
              접수됨
            </button>
            <button
              onClick={() => handleStatusChange('REVIEWED')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'REVIEWED'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8F0] border border-[#FFCEAA]'
              }`}
            >
              검토완료
            </button>
            <button
              onClick={() => handleStatusChange('ACTION_TAKEN')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'ACTION_TAKEN'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8F0] border border-[#FFCEAA]'
              }`}
            >
              조치완료
            </button>
            <button
              onClick={() => handleStatusChange('REJECTED')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'REJECTED'
                  ? 'bg-[#F78938] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8F0] border border-[#FFCEAA]'
              }`}
            >
              반려
            </button>
          </div>
        </section>

        {/* 신고 내역 목록 */}
        <section className="mt-6">
          {reports.length === 0 ? (
            <div className="p-8 text-center bg-[#FFF8F0] border border-[#FFCEAA] rounded-xl">
              <div className="text-[#B4B4B4] mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#262626] mb-2">
                신고 내역이 없습니다
              </h3>
              <p className="text-[#666666]">
                {selectedStatus
                  ? '해당 상태의 신고 내역이 없습니다.'
                  : '아직 신고한 내역이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.reportId}
                  className="p-4 border border-[#FFCEAA] rounded-xl bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#666666]">
                        {getTargetTypeText(report.targetType)}
                      </span>
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  <div
                    className="text-sm text-[#262626] mb-2 cursor-pointer hover:text-[#F78938] transition-colors"
                    onClick={() => navigate(`/report/${report.reportId}`)}
                  >
                    신고 사유: {report.reasonName}
                  </div>
                  <div className="text-xs text-[#B4B4B4]">
                    접수일:{' '}
                    {new Date(report.createdAt).toLocaleDateString('ko-KR')}
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
          총 {totalElements}건의 신고 내역이 있습니다.
        </section>
      </main>
    </div>
  );
};

export default MyReportsPage;
