import CloseIcon from '../../assets/closeIcon.svg?react';

type ModalButton = {
  text: string;
  onClick: () => void;
  variant?: 'gray' | 'orange';
};

interface ModalProps {
  title: string;
  children: React.ReactNode;
  buttons?: ModalButton[];
  onClose?: () => void;
}

const Modal = ({ title, children, buttons = [], onClose }: ModalProps) => {
  const getButtonStyle = (variant: string = 'gray') => {
    switch (variant) {
      case 'orange':
        return 'bg-[#F78938] text-white hover:brightness-110';
      case 'gray':
      default:
        return 'bg-[#D9D9D9] text-white hover:bg-gray-400';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4"
    >
      <div className="w-full max-w-[480px] bg-white p-4 rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)] flex flex-col gap-6">
        <div className="w-full flex justify-end">
          <button onClick={onClose} aria-label="닫기" className="cursor-pointer">
            <CloseIcon />
          </button>
        </div>
        <div className="w-full flex flex-col items-center gap-4 text-center px-6 font-['Pretendard']">
          <h2 className="text-black text-xl font-semibold leading-snug">
            {title}
          </h2>
          <div>{children}</div>

          {buttons.length > 0 && (
            <div className="flex w-full gap-3 mt-3">
              {buttons.map(({ text, onClick, variant }, idx) => (
                <button
                  key={idx}
                  onClick={onClick}
                  className={`w-full py-3 rounded-[10px] cursor-pointer transition ${getButtonStyle(variant)}`}
                >
                  <span className="text-base font-medium">{text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
