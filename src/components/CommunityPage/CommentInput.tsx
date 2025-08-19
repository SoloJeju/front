import ArrowUp from '/src/assets/arrow-up.svg';

interface CommentInputProps {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const CommentInput = ({ value, onChange, onSubmit }: CommentInputProps) => {
  return (
    <form
      className="pb-25 fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] flex justify-between items-center gap-3 px-3 py-3 bg-[#FFFFFD]"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <div className="flex-1">
        <label htmlFor="commentInput" className="sr-only">
          댓글 입력창
        </label>
        <input
          type="text"
          id="commentInput"
          placeholder="댓글을 입력하세요"
          className="w-full px-5 py-3 font-[pretendard] font-medium text-sm text-black border border-[#D9D9D9] rounded-2xl placeholder:text-[#D9D9D9] focus:border-[#FFCEAA] focus:outline focus:border-2 focus:rounded-2xl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-9 h-9 flex justify-center items-center bg-[#F78938] rounded-full shrink-0"
        disabled={!value.trim()}
      >
        <img src={ArrowUp} alt="댓글 등록" />
      </button>
    </form>
  );
};

export default CommentInput;
