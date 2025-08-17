import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function FindPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordFormValid = password && passwordCheck && !passwordError;

  // 타이머 로직
  useEffect(() => {
    if (!isCodeSent) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setIsCodeSent(false); // 시간이 다 되면 재전송 가능하도록
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCodeSent]);

  // 비밀번호 일치 체크
  useEffect(() => {
    setPasswordError(passwordCheck !== "" && password !== passwordCheck);
  }, [password, passwordCheck]);

  // UI 테스트용 핸들러들
  const handleSendCode = () => {
    if (!isEmailValid) return;
    setTimer(180);
    setIsCodeSent(true);
    toast.success("인증번호가 전송되었습니다.");
  };

  const handleVerifyCode = () => {
    if (authCode === "123456") {
      // 테스트용 인증번호
      setIsVerified(true);
      toast.success("인증되었습니다.");
      setStep(2); // 인증 성공 시 다음 단계로 자동 이동
    } else {
      setIsVerified(false);
      toast.error("인증번호가 틀립니다.");
    }
  };

  const handlePasswordReset = () => {
    if (!isPasswordFormValid) return;
    toast.success("비밀번호가 성공적으로 변경되었습니다.");
    navigate("/login"); // 로그인 페이지로 이동
  };

  // Step 1: 이메일 인증
  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 font-Pretendard bg-white">
        <main className="w-full max-w-sm mx-auto mb-20">
          <h1 className="text-2xl font-bold mb-8">비밀번호 찾기</h1>
          <div className="flex flex-col space-y-4">
            <Input
              type="email"
              placeholder="가입한 이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              endAdornment={
                <Button
                  size="small"
                  disabled={!isEmailValid}
                  onClick={handleSendCode}
                >
                  {isCodeSent ? "재전송" : "인증"}
                </Button>
              }
            />
            <Input
              type="text"
              placeholder="인증번호"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              endAdornment={
                isCodeSent &&
                timer > 0 && (
                  <span className="ml-4 text-[#B4B4B4]">
                    {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(
                      2,
                      "0"
                    )}`}
                  </span>
                )
              }
            />
          </div>
          <div className="mt-8">
            <Button
              onClick={handleVerifyCode}
              disabled={!authCode || isVerified}
            >
              {isVerified ? "인증 완료" : "인증번호 확인"}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Step 2: 새 비밀번호 입력
  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 font-Pretendard bg-white">
        <main className="w-full max-w-sm mx-auto mb-20">
          <h1 className="text-2xl font-bold mb-8">새 비밀번호 설정</h1>
          <div className="flex flex-col space-y-4">
            <Input
              type="password"
              placeholder="새 비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              <Input
                type="password"
                placeholder="새 비밀번호 확인"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                error={passwordError}
              />
              {passwordError && (
                <p className="mt-1 text-xs text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
          </div>
          <div className="mt-8">
            <Button
              onClick={handlePasswordReset}
              disabled={!isPasswordFormValid}
            >
              비밀번호 변경
            </Button>
          </div>
        </main>
      </div>
    );
  }
}
