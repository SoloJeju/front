import { useState } from 'react';

interface MemoEditorModalProps {
  initialMemo: string;
  onSave: (memo: string) => void;
  onClose: () => void;
}

const MemoEditorModal = ({ initialMemo, onSave, onClose }: MemoEditorModalProps) => {
  const [memo, setMemo] = useState(initialMemo);

  const handleSave = () => {
    onSave(memo);
  };

  return (
    <div className="bg-[#fffffd] p-4 rounded-t-[20px] shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.10)] w-full max-w-[480px] font-['Pretendard'] animate-slide-up">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">메모 수정</h3>
        
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력하세요..."
          className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F78938] text-base resize-none"
          rows={4}
        />

        <div className="flex justify-end gap-3 pt-4 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-sm font-bold text-white bg-[#F78938] rounded-lg"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoEditorModal;