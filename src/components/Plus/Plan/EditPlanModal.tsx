interface EditPlanModalProps {
  onClose: () => void;
  onDelete: () => void;
  onEditMemo: () => void;
  onEditPlace: () => void;
  onEditTime: () => void;
}
const EditPlanModal = ({
  onClose,
  onDelete,
  onEditMemo,
  onEditPlace,
  onEditTime,
}: EditPlanModalProps) => {
  const menuItems = [
    { label: '메모 수정', action: onEditMemo },
    { label: '장소 바꾸기', action: onEditPlace },
    { label: '시간 바꾸기', action: onEditTime },
  ];

  return (
    <div
      className="fixed inset-0 z-40 bg-black/30 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-0 right-0 bg-[#fffffd] p-4 pt-6 rounded-t-[20px] shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.10)] w-full max-w-[480px] mx-auto font-['Pretendard'] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-center gap-1 mb-4">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="py-3 text-stone-700 text-base font-normal leading-none cursor-pointer hover:font-semibold hover:text-orange-500 rounded-lg hover:bg-gray-50"
              onClick={item.action}
            >
              {item.label}
            </div>
          ))}
        </div>
        <button
          className="w-full rounded-lg py-3 text-center items-center bg-red-50 text-red-500 font-semibold mt-2 hover:bg-red-100"
          onClick={onDelete}
        >
          이 장소 삭제하기
        </button>
      </div>
    </div>
  );
};

export default EditPlanModal;