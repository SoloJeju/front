// src/components/auth/EmailAuth.tsx
import { useState } from "react";
import { useTimer } from "../../hooks/use-timer";
import Input from "../common/Input";
import Button from "../common/Button";

interface EmailAuthProps {
  email: string;
  authCode: string;
  onEmailChange: (value: string) => void;
  onAuthCodeChange: (value: string) => void;
  onNext: () => void;
}

export default function EmailAuth({
  email,
  authCode,
  onEmailChange,
  onAuthCodeChange,
  onNext,
}: EmailAuthProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { time, startTimer } = useTimer(180);

  const handleSendCode = () => {
    // TODO: 이메일 유효성 검사, 실제 API 호출
    setIsCodeSent(true);
    startTimer();
  };

  const handleVerifyCode = () => {
    // TODO: 실제 API 호출
    if (authCode === "123455") {
      setIsVerified(true);
      alert("인증되었습니다.");
    } else {
      alert("인증번호가 틀립니다.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
        <Input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          endAdornment={
            <button
              onClick={handleSendCode}
              className={`ml-4 flex-shrink-0 px-4 h-9 text-sm font-medium rounded-[8px] ${
                !isCodeSent
                  ? "bg-[#D9D9D9] text-[#666666]"
                  : "bg-[#FF7A00] text-white"
              }`}
            >
              {!isCodeSent ? "인증" : "재전송"}
            </button>
          }
        />
        {isCodeSent && (
          <>
            <p className="text-sm text-[#FF7A00]">
              이메일이 전송되었습니다. 이메일을 확인해 주세요.
            </p>
            <Input
              type="text"
              placeholder="인증번호"
              value={authCode}
              onChange={(e) => onAuthCodeChange(e.target.value)}
              onBlur={handleVerifyCode}
              endAdornment={
                time > 0 && (
                  <span className="ml-4 text-[#B4B4B4]">{`${Math.floor(
                    time / 60
                  )}:${String(time % 60).padStart(2, "0")}`}</span>
                )
              }
            />
          </>
        )}
      </div>
      <div className="mt-8">
        <Button onClick={onNext} disabled={!isVerified}>
          비밀번호 입력하러 가기
        </Button>
      </div>
    </div>
  );
}
