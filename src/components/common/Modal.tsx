import CloseIcon from '../../assets/closeIcon.svg?react';

interface ModalProps {
  children: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal = ({ children, confirmText = '확인', cancelText = '취소', onConfirm, onCancel }: ModalProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <div className="p-4 bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)] inline-flex flex-col items-start gap-6">
        <div className="w-80 flex flex-col items-end gap-4">
          <button
            onClick={onCancel}
            aria-label="닫기"
            className="self-auto"
          >
            <CloseIcon />
          </button>

          <div className="self-stretch flex flex-col items-center gap-6">
            <div className="w-64 flex flex-col items-center gap-4 px-7.5">
              {children}
            </div>

            <div className="flex w-full justify-between items-center gap-3">
              <button
                onClick={onCancel}
                className="w-full py-3 bg-gray-300 rounded-[10px] flex justify-center items-center hover:bg-gray-400 transition"
              >
                <span className="text-black text-base font-semibold">
                  {cancelText}
                </span>
              </button>
              <button
                onClick={onConfirm}
                className="w-full py-3 bg-[#F78938] rounded-[10px] flex justify-center items-center hover:brightness-110 transition"
              >
                <span className="text-white text-base font-semibold">
                  {confirmText}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
