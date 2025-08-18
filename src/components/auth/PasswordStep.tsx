// src/components/auth/PasswordStep.tsx
import { useMemo } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

interface PasswordStepProps {
  password: string;
  passwordCheck: string;
  onPasswordChange: (value: string) => void;
  onPasswordCheckChange: (value: string) => void;
  onSubmit: () => void;
}

export default function PasswordStep({
  password,
  passwordCheck,
  onPasswordChange,
  onPasswordCheckChange,
  onSubmit,
}: PasswordStepProps) {
  const isFormValid = useMemo(() => {
    return password && password === passwordCheck;
  }, [password, passwordCheck]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={passwordCheck}
          onChange={(e) => onPasswordCheckChange(e.target.value)}
        />
      </div>
      <div className="mt-8">
        <Button onClick={onSubmit} disabled={!isFormValid}>
          프로필 생성하러 가기
        </Button>
      </div>
    </div>
  );
}
