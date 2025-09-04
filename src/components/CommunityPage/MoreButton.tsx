interface MoreButtonProps {
  isMine: boolean;
  isComment: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  onModify?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

const MoreButton = ({
  isMine,
  isComment,
  ref,
  onModify,
  onDelete,
  onReport,
}: MoreButtonProps) => {
  return (
    <div>
      {isMine ? (
        <div
          className="flex flex-col gap-4 px-4 py-5 bg-[#FFFFFD] rounded-xl shadow-md z-50"
          ref={ref}
        >
          {!isComment && (
            <button
              type="button"
              className="font-[pretendard] font-normal text-[#666666]"
              onClick={() => onModify?.()}
            >
              수정하기
            </button>
          )}
          <button
            type="button"
            className="font-[pretendard] font-normal text-[#666666]"
            onClick={() => onDelete?.()}
          >
            삭제하기
          </button>
        </div>
      ) : (
        <div
          className="inline-block px-4 py-5 bg-[#FFFFFD] rounded-xl shadow-md z-50"
          ref={ref}
        >
          <button
            type="button"
            className="font-[pretendard] font-normal text-[#666666]"
            onClick={() => onReport?.()}
          >
            신고하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MoreButton;
