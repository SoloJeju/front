import ArrowUp from '/src/assets/arrow-up.svg';

interface CommentInputProps {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const CommentInput = ({ value, onChange, onSubmit }: CommentInputProps) => {
  return (
    <form className="w-full flex justify-between items-center gap-3 px-4 py-3 bg-[#FFFFFD] fixed bottom-0" onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.()
    }}>
      <label htmlFor="commentInput" className="sr-only">
        댓글 입력창
      </label>
      <input
        type="text"
        id="commentInput"
        placeholder="댓글을 입력하세요"
        className="w-full px-5 py-3 font-[pretendard] font-medium text-sm text-black border border-[#D9D9D9] rounded-2xl placeholder:text-[#D9D9D9]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
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
