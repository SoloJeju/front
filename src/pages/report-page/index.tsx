import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getReportReasons, createReport } from '../../apis/report';
import { useImageUpload, validateImageFile } from '../../apis/s3';
import type { ReportReason, CreateReportRequest } from '../../types/report';
import toast from 'react-hot-toast';

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [evidence, setEvidence] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 공통 이미지 업로드 훅 사용
  const { uploadedImage, isUploading, uploadImage, removeImage } =
    useImageUpload();

  // URL 파라미터에서 신고 대상 정보 추출
  const searchParams = new URLSearchParams(location.search);
  const targetUserId = searchParams.get('targetUserId');
  const targetPostId = searchParams.get('targetPostId');
  const targetCommentId = searchParams.get('targetCommentId');

  // 신고 타입과 대상 정보
  const reportType = targetUserId
    ? 'USER'
    : targetPostId
      ? 'POST'
      : targetCommentId
        ? 'COMMENT'
        : 'UNKNOWN';

  useEffect(() => {
    fetchReportReasons();
  }, []);

  const fetchReportReasons = async () => {
    try {
      setIsLoading(true);
      const response = await getReportReasons();
      if (response.isSuccess) {
        setReasons(response.result);
      } else {
        // API 응답이 실패하거나 데이터가 없을 때 임시 데이터 사용 (에러 메시지 없이)
        setReasons([
          {
            code: 'SPAM',
            name: '스팸',
            description: '스팸성 게시물',
            enabled: true,
            category: 'CONTENT',
          },
          {
            code: 'ABUSE',
            name: '욕설/비방',
            description: '욕설 또는 비방성 내용',
            enabled: true,
            category: 'BEHAVIOR',
          },
          {
            code: 'INAPPROPRIATE',
            name: '부적절한 내용',
            description: '부적절하거나 부도덕한 내용',
            enabled: true,
            category: 'CONTENT',
          },
          {
            code: 'COPYRIGHT',
            name: '저작권 침해',
            description: '저작권이 있는 콘텐츠 무단 사용',
            enabled: true,
            category: 'LEGAL',
          },
          {
            code: 'HARASSMENT',
            name: '괴롭힘/협박',
            description: '지속적인 괴롭힘이나 협박',
            enabled: true,
            category: 'BEHAVIOR',
          },
          {
            code: 'MISLEADING',
            name: '허위 정보',
            description: '사실과 다른 허위 정보',
            enabled: true,
            category: 'CONTENT',
          },
        ]);
      }
    } catch (error) {
      console.error('신고 사유 조회 오류:', error);
      // 에러 발생 시에도 임시 데이터 사용 (에러 메시지 없이)
      setReasons([
        {
          code: 'SPAM',
          name: '스팸',
          description: '스팸성 게시물',
          enabled: true,
          category: 'CONTENT',
        },
        {
          code: 'ABUSE',
          name: '욕설/비방',
          description: '욕설 또는 비방성 내용',
          enabled: true,
          category: 'BEHAVIOR',
        },
        {
          code: 'INAPPROPRIATE',
          name: '부적절한 내용',
          description: '부적절하거나 부도덕한 내용',
          enabled: true,
          category: 'CONTENT',
        },
        {
          code: 'COPYRIGHT',
          name: '저작권 침해',
          description: '저작권이 있는 콘텐츠 무단 사용',
          enabled: true,
          category: 'LEGAL',
        },
        {
          code: 'HARASSMENT',
          name: '괴롭힘/협박',
          description: '지속적인 괴롭힘이나 협박',
          enabled: true,
          category: 'BEHAVIOR',
        },
        {
          code: 'MISLEADING',
          name: '허위 정보',
          description: '사실과 다른 허위 정보',
          enabled: true,
          category: 'CONTENT',
        },
      ]);
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

    if (!selectedReason) {
      toast.error('신고 사유를 선택해주세요.');
      return;
    }

    if (!detail.trim()) {
      toast.error('상세 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const reportData: CreateReportRequest = {
        reason: selectedReason,
        detail: detail.trim(),
        ...(evidence && { evidence: evidence.trim() }),
        ...(targetUserId && { targetUserId: parseInt(targetUserId) }),
        ...(targetPostId && { targetPostId: parseInt(targetPostId) }),
        ...(targetCommentId && { targetCommentId: parseInt(targetCommentId) }),
        ...(uploadedImage && {
          imageUrl: uploadedImage.url,
          imageName: uploadedImage.name,
        }),
      };

      const response = await createReport(reportData);

      if (response.isSuccess) {
        toast.success('신고가 접수되었습니다.');
        navigate(-1); // 이전 페이지로 돌아가기
      } else {
        toast.error(response.message || '신고 접수에 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 접수 오류:', error);
      toast.error('신고 접수에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetDescription = () => {
    switch (reportType) {
      case 'USER':
        return '사용자';
      case 'POST':
        return '게시물';
      case 'COMMENT':
        return '댓글';
      default:
        return '콘텐츠';
    }
  };

  const getTargetInfo = () => {
    switch (reportType) {
      case 'USER':
        return '사용자 닉네임'; // 실제로는 API에서 사용자 닉네임을 가져와야 함
      case 'POST':
        return '혼자 성산일출봉 가도 괜찮을까요?'; // 실제로는 API에서 게시글 제목을 가져와야 함
      case 'COMMENT':
        return '안녕하세요! 혼놀 꿀팁 전문가입니다 ~'; // 실제로는 API에서 댓글 내용을 가져와야 함
      default:
        return '';
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'USER':
        return '사용자 신고하기';
      case 'POST':
        return '게시물 신고하기';
      case 'COMMENT':
        return '댓글 신고하기';
      default:
        return '신고하기';
    }
  };

  const getSelectedReasonName = () => {
    const selected = reasons.find((reason) => reason.code === selectedReason);
    return selected ? selected.name : '신고 사유를 선택해주세요';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-Pretendard">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F78938] mx-auto"></div>
          <p className="mt-4 text-[#666666]">신고 사유를 불러오는 중...</p>
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
          <h1 className="text-[20px] font-semibold text-white">
            {getReportTitle()}
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-4 pb-12">
        {/* 신고 대상 정보 */}
        <section className="mt-6 p-4 bg-gradient-to-r from-[#FFF8F0] to-[#FFF0E0] border-2 border-[#FFCEAA] rounded-xl shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-[#F78938] rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-[#F78938] text-base font-semibold">
              신고 대상
            </h2>
          </div>
          <div className="space-y-2">
            <p className="text-[#666666] text-sm leading-relaxed">
              <span className="font-medium">{getTargetDescription()}</span>에
              대한 신고를 접수합니다.
            </p>
            <div className="inline-block px-3 py-2 bg-white border border-[#FFCEAA] rounded-lg">
              <p className="text-[#F78938] text-sm font-medium">
                {getTargetInfo()}
              </p>
            </div>
          </div>
        </section>

        {/* 신고 폼 */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* 신고 사유 선택 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-3 font-medium">
              신고 사유 <span className="text-red-500">*</span>
            </h3>

            {/* 드롭다운 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 border-2 border-[#FFCEAA] rounded-xl bg-white text-left focus:ring-2 focus:ring-[#F78938] focus:border-[#F78938] transition-colors"
              >
                <span
                  className={
                    selectedReason ? 'text-[#262626]' : 'text-[#B4B4B4]'
                  }
                >
                  {getSelectedReasonName()}
                </span>
                <svg
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666666] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#FFCEAA] rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  {reasons.map((reason) => (
                    <button
                      key={reason.code}
                      type="button"
                      onClick={() => {
                        setSelectedReason(reason.code);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#FFF8F0] transition-colors border-b border-[#FFCEAA] last:border-b-0"
                    >
                      <div className="font-medium text-[#262626]">
                        {reason.name}
                      </div>
                      <div className="text-xs text-[#666666] mt-1">
                        {reason.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 상세 내용 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-2 font-medium">
              상세 내용 <span className="text-red-500">*</span>
            </h3>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder={`${getTargetDescription()}에 대한 구체적인 신고 사유를 입력해주세요. (최대 500자)`}
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border border-[#FFCEAA] rounded-xl focus:ring-2 focus:ring-[#F78938] focus:border-[#F78938] resize-none font-Pretendard"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-[#666666]">
                구체적이고 객관적인 내용을 작성해주세요.
              </span>
              <span className="text-sm text-[#B4B4B4]">
                {detail.length}/500
              </span>
            </div>
          </section>

          {/* 이미지 첨부 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-2 font-medium">
              이미지 첨부 (선택사항)
            </h3>

            {/* 이미지 업로드 버튼 */}
            {!uploadedImage && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full px-4 py-3 border-2 border-dashed border-[#FFCEAA] rounded-xl bg-[#FFF8F0] hover:bg-[#FFF0E0] transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#F78938] mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-[#F78938] font-medium">
                    {isUploading ? '업로드 중...' : '이미지 선택'}
                  </span>
                </div>
                <p className="text-xs text-[#666666] mt-1">
                  최대 5MB, JPG, PNG, GIF
                </p>
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
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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

          {/* 증거 자료 */}
          <section>
            <h3 className="text-[#737373] text-sm mb-2 font-medium">
              증거 자료 (선택사항)
            </h3>
            <input
              type="url"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="증거 자료의 URL을 입력해주세요 (예: 스크린샷, 링크 등)"
              className="w-full px-4 py-3 border border-[#FFCEAA] rounded-xl focus:ring-2 focus:ring-[#F78938] focus:border-[#F78938] font-Pretendard"
            />
            <p className="text-sm text-[#666666] mt-2">
              신고 내용을 뒷받침할 수 있는 증거 자료가 있다면 URL로
              첨부해주세요.
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
                disabled={isSubmitting || !selectedReason || !detail.trim()}
                className="flex-1 px-4 py-3 bg-[#F78938] text-white rounded-xl hover:bg-[#F78938]/90 disabled:bg-[#B4B4B4] disabled:cursor-not-allowed transition-colors font-Pretendard"
              >
                {isSubmitting ? '신고 접수 중...' : '신고 접수'}
              </button>
            </div>
          </section>
        </form>

        {/* 주의사항 */}
        <section className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-red-600 text-base font-semibold">주의사항</h3>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">•</span>
              <span>허위 신고는 제재 대상이 될 수 있습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">•</span>
              <span>신고된 내용은 관리자 검토 후 처리됩니다.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">•</span>
              <span>신고 처리 결과는 별도로 안내드리지 않습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">•</span>
              <span>긴급한 상황이라면 고객센터로 직접 연락해주세요.</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default ReportPage;
