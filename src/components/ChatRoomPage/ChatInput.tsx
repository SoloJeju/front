import React from 'react';
import ArrowUp from '/src/assets/arrow-up.svg';

interface ChatInputProps {
  message: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
}

const ChatInput = ({ message, onChange, onSubmit, onKeyPress, disabled }: ChatInputProps) => {
  return (
    <form
      className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] flex justify-between items-center gap-3 py-3 px-3 bg-[#FFFFFD]"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <label htmlFor="messsage" className="sr-only">
        메시지 입력
      </label>
      <input
        type="text"
        name="messsage"
        id="messsage"
        placeholder={disabled ? "WebSocket 연결이 필요합니다..." : "메시지 보내기"}
        className="w-full px-4 py-3 rounded-2xl border border-[#D9D9D9] disabled:bg-gray-100 disabled:cursor-not-allowed"
        value={message}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={disabled}
      />
              <button
          type="submit"
          className="w-9 h-9 flex justify-center items-center bg-[#F78938] rounded-full shrink-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={!message.trim() || disabled}
        >
        <img src={ArrowUp} alt="메시지 전송" className="w-6 h-6" />
      </button>
    </form>
  );
};

export default React.memo(ChatInput);
