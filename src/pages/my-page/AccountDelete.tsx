import { useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import BackHeader from '../../components/common/Headers/BackHeader';

const AccountDelete = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  // 1. 탈퇴 처리가 완료되었는지 확인하는 상태 추가
  const [isDeleted, setIsDeleted] = useState(false);

  // 탈퇴 시 주의사항 목록
  const warnings = [
    '모든 동행 기록과 리뷰가 영구적으로 삭제됩니다.',
    '작성하신 게시글과 댓글을 더 이상 수정하거나 삭제할 수 없습니다.',
    '계정은 복구할 수 없으며, 동일한 정보로 재가입 시 제약이 있을 수 있습니다.',
  ];

  // 2. 삭제 버튼 클릭 시 isDeleted 상태를 true로 변경하는 함수
  const handleDeleteClick = () => {
    // 실제 서버에 탈퇴를 요청하는 API 호출 로직 (이곳에 추가)
    console.log('서버에 탈퇴 요청 전송');

    // API 호출이 성공했다고 가정하고, UI를 변경
    setIsDeleted(true);
  };

  return (
    <div className="font-Pretendard bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] mx-auto">
        <BackHeader title="회원 탈퇴" />

        <main className="pt-16 p-4">
          <div className="flex flex-col items-center text-center p-4">
            <FiAlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">
              탈퇴하기 전에 꼭 확인해주세요.
            </h2>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <ul className="space-y-2 text-sm text-gray-700">
              {warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-1 text-primary">✔</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="agree-checkbox"
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
              className="w-5 h-5 accent-primary"
              // 3. 탈퇴 처리 후에는 체크박스도 비활성화
              disabled={isDeleted}
            />
            <label
              htmlFor="agree-checkbox"
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              위 내용을 모두 확인했으며, 계정 삭제에 동의합니다.
            </label>
          </div>

          {/* 4. isDeleted 상태에 따라 버튼 또는 완료 메시지를 표시 */}
          <div className="mt-8">
            {isDeleted ? (
              <div className="p-4 text-center text-gray-600 bg-gray-100 rounded-lg">
                <p>회원 탈퇴가 처리되었습니다.</p>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                disabled={!isAgreed}
                className="w-full p-3 text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                네, 계정을 삭제하겠습니다.
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountDelete;
