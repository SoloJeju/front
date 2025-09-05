// 회원가입 2단계 - 비밀번호 입력, 유효성 검사
import Input from '../../common/Input';
import Button from '../../common/Button';
import { usePassword } from '../../../hooks/auth/usePassword';

/**
 * 비밀번호 규칙 만족 여부를 시각적으로 보여주는 작은 아이템 컴포넌트
 */
function RuleItem({ isMet, text }: { isMet: boolean; text: string }) {
  const color = isMet ? 'text-green-600' : 'text-gray-500';
  
  return (
    <li className={`flex items-center gap-2 ${color}`}>
      {isMet ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l4.25-5.832z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      )}
      <span>{text}</span>
    </li>
  );
}

export default function PasswordStep({ onNext }: { onNext: () => void }) {
  const {
    password,
    setPassword,
    passwordCheck,
    setPasswordCheck,
    passwordError,
    isCheckingPassword,
    isPasswordValid,
    handlePasswordBlur,
    handleProceed,
  } = usePassword({ onSuccess: onNext });

  // ✨ 1. 비밀번호 규칙을 실시간으로 계산합니다.
  const lenOk = password.length >= 8 && password.length <= 12;
  const typeCount = [/[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password)].filter(Boolean).length;
  const comboOk = typeCount >= 2;

  const isButtonDisabled = !password || !passwordCheck || passwordError || !isPasswordValid || isCheckingPassword;

  return (
    <div className="px-6 pt-15 pb-6">
      <h1 className="text-24 font-bold mb-6">비밀번호 설정</h1>
      <div className="flex flex-col space-y-4">
        <div>
          <Input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
          />
          {/* ✨ 2. 기존의 긴 줄글 대신, 실시간 체크리스트 UI를 보여줍니다. */}
          <ul className="mt-2 space-y-1 text-xs">
            <RuleItem isMet={lenOk} text="8~12자 이내" />
            <RuleItem isMet={comboOk} text="영문(대/소)·숫자 중 2가지 이상 조합" />
          </ul>
        </div>
        <div>
          <Input
            type="password"
            placeholder="비밀번호 확인"
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
        <Button onClick={handleProceed} disabled={isButtonDisabled}>
          다음으로
        </Button>
      </div>
    </div>
  );
}