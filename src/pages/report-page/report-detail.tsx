import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReportDetail, cancelReport } from '../../apis/report';
import toast from 'react-hot-toast';

interface Report {
  reportId: number;
  targetType: string;
  targetId: number;
  targetTitle: string;
  targetContent: string;
  targetUserName: string;
  targetUserId: number;
  reason: string;
  reasonName: string;
  detail: string;
  status: string;
  statusName: string;
  createdAt: string;
  processedAt: string | null;
  adminNote: string | null;
  evidence?: string | null;
  imageUrl?: string | null;
  imageName?: string | null;
  canCancel: boolean;
}

const ReportDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await getReportDetail(parseInt(id));
        
        if (response.isSuccess) {
          setReport(response.result);
        } else {
          toast.error('신고 상세 정보를 불러오는데 실패했습니다.');
          navigate('/my-reports');
        }
      } catch (error) {
        console.error('신고 상세 조회 오류:', error);
        toast.error('신고 상세 정보를 불러오는데 실패했습니다.');
        navigate('/my-reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportDetail();
  }, [id, navigate]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { text: '검토 대기중', color: 'bg-[#FFF8F0] text-[#F78938] border-[#FFCEAA]' },
      REVIEWED: { text: '검토 완료', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      ACTION_TAKEN: { text: '조치 완료', color: 'bg-green-50 text-green-600 border-green-200' },
      REJECTED: { text: '반려됨', color: 'bg-red-50 text-red-600 border-red-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTargetTypeBadge = (targetType: string) => {
    const typeConfig = {
      USER: { text: '사용자', color: 'bg-purple-50 text-purple-600 border-purple-200' },
      POST: { text: '게시글', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      COMMENT: { text: '댓글', color: 'bg-green-50 text-green-600 border-green-200' },
    };

    const config = typeConfig[targetType as keyof typeof typeConfig] || typeConfig.POST;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleCancelReport = async () => {
    if (!report || !id) return;
    
    try {
      const response = await cancelReport(parseInt(id));
      
      if (response.isSuccess) {
        toast.success('신고가 취소되었습니다.');
        navigate('/my-reports');
      } else {
        toast.error(response.message || '신고 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 취소 오류:', error);
      toast.error('신고 취소에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-Pretendard">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F78938] mx-auto"></div>
          <p className="mt-4 text-[#666666]">신고 상세 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-Pretendard">
        <div className="text-center">
          <p className="text-[#666666]">신고 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/my-reports')}
            className="mt-4 px-4 py-2 bg-[#F78938] text-white rounded-lg hover:bg-[#F78938]/90 transition-colors"
          >
            신고 내역으로 돌아가기
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
          <h1 className="text-[20px] font-semibold text-white">신고 상세</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-4 pb-12">
        {/* 신고 정보 카드 */}
        <section className="mt-6">
          <div className="p-4 border border-[#FFCEAA] rounded-xl bg-white">
            {/* 신고 상태 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#262626]">신고 상태</h2>
              {getStatusBadge(report.status)}
            </div>

            {/* 신고 대상 정보 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#262626] mb-2">신고 대상</h3>
              <div className="p-3 bg-[#F8F9FA] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getTargetTypeBadge(report.targetType)}
                  <span className="text-sm text-[#666666]">
                    {report.targetType === 'USER' ? '사용자' : 
                     report.targetType === 'POST' ? '게시글' : '댓글'}
                  </span>
                </div>
                <div className="text-[#262626]">
                  <p className="font-medium">{report.targetTitle || '제목 없음'}</p>
                  {report.targetContent && (
                    <p className="text-sm text-[#666666] mt-1 line-clamp-3">
                      {report.targetContent}
                    </p>
                  )}
                  <p className="text-xs text-[#666666] mt-2">
                    작성자: {report.targetUserName}
                  </p>
                </div>
              </div>
            </div>

            {/* 신고 사유 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#262626] mb-2">신고 사유</h3>
              <div className="p-3 bg-[#F8F9FA] rounded-lg">
                <p className="text-[#262626] font-medium">{report.reasonName}</p>
                {report.detail && (
                  <p className="text-sm text-[#666666] mt-2 whitespace-pre-wrap">
                    {report.detail}
                  </p>
                )}
              </div>
            </div>

            {/* 증거 자료 */}
            {report.evidence && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#262626] mb-2">증거 자료</h3>
                <div className="p-3 bg-[#F8F9FA] rounded-lg text-[#262626] whitespace-pre-wrap">
                  {report.evidence}
                </div>
              </div>
            )}

            {/* 첨부 이미지 */}
            {report.imageUrl && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#262626] mb-2">첨부 이미지</h3>
                <img 
                  src={report.imageUrl} 
                  alt={report.imageName || '첨부 이미지'} 
                  className="max-w-full h-auto rounded-lg border border-[#FFCEAA]"
                />
              </div>
            )}

            {/* 관리자 답변 */}
            {report.adminNote && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-[#262626] mb-2">관리자 답변</h3>
                <div className="p-3 bg-[#E8F5E8] rounded-lg text-[#262626] whitespace-pre-wrap">
                  {report.adminNote}
                </div>
                {report.processedAt && (
                  <p className="text-xs text-[#666666] mt-2">
                    처리일: {new Date(report.processedAt).toLocaleDateString('ko-KR')}
                  </p>
                )}
              </div>
            )}

            {/* 신고 취소 가능 여부 */}
            {report.canCancel && (
              <div className="mb-4 p-3 bg-[#FFF8F0] border border-[#FFCEAA] rounded-lg">
                <p className="text-sm text-[#F78938] font-medium">
                  이 신고는 취소할 수 있습니다.
                </p>
              </div>
            )}

            {/* 신고 일시 */}
            <div className="text-xs text-[#B4B4B4]">
              <p>신고일: {new Date(report.createdAt).toLocaleDateString('ko-KR')}</p>
              {report.processedAt && (
                <p>처리일: {new Date(report.processedAt).toLocaleDateString('ko-KR')}</p>
              )}
            </div>
          </div>
        </section>

        {/* 하단 버튼 */}
        <section className="mt-6 flex gap-3">
          <button
            onClick={() => navigate('/my-reports')}
            className="flex-1 p-3 bg-[#F78938] text-white rounded-xl hover:bg-[#F78938]/90 transition-colors font-medium"
          >
            신고 내역으로
          </button>
          <button
            onClick={() => navigate('/report')}
            className="flex-1 p-3 bg-white text-[#F78938] border-2 border-[#F78938] rounded-xl hover:bg-[#F78938] hover:text-white transition-all duration-200 font-medium"
          >
            새 신고 작성
          </button>
        </section>

        {/* 신고 취소 버튼 (취소 가능한 경우에만 표시) */}
        {report.canCancel && (
          <section className="mt-3">
            <button
              onClick={handleCancelReport}
              className="w-full p-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors font-medium"
            >
              신고 취소하기
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default ReportDetailPage;
