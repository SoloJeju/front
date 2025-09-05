// 회원가입 1단계 - 이메일 입력, 인증번호 확인

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useEmail } from '../../../hooks/auth/useEmail';
import { useProfileStore } from '../../../stores/profile-store';
import Input from '../../common/Input';
import Button from '../../common/Button';

export default function EmailStep({ onNext }: { onNext: () => void }) {
  const [isVerified, setIsVerified] = useState(false);
  const {
    email,
    setEmail,
    authCode,
    setAuthCode,
    isCodeSent,
    timer,
    isEmailValid,
    isCheckingEmail,
    isSendingCode,
    isVerifyingCode,
    handleSendCode,
    handleVerifyCode,
  } = useEmail({ onSuccess: () => setIsVerified(true) });

  useEffect(() => {
    if (isVerified) {
      onNext();
    }
  }, [isVerified, onNext]);

  if (isVerified) return null;

  return (
    <div className="px-6 pt-10 pb-6">
      <h1 className="text-24 font-bold mb-6">회원 가입</h1>
      <div className="flex flex-col space-y-4">
        <Input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          endAdornment={
            <Button
              size="small"
              disabled={!isEmailValid || isSendingCode || isCheckingEmail}
              onClick={handleSendCode}
            >
              {isCodeSent ? '재전송' : '인증'}
            </Button>
          }
        />
        {isCodeSent && (
          <p className="text-sm text-[#F78938]">
            이메일이 전송되었습니다. 이메일을 확인해 주세요.
          </p>
        )}
        <Input
          type="text"
          placeholder="인증번호"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
          endAdornment={
            isCodeSent &&
            timer > 0 && (
              <span className="ml-4 text-gray-400">{`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`}</span>
            )
          }
        />
      </div>
      <div className="mt-8">
        <Button
          onClick={handleVerifyCode}
          disabled={!authCode || isVerifyingCode}
        >
          다음으로
        </Button>
        <button
          type="button"
          onClick={() => {
            useProfileStore
              .getState()
              .setEmail(email || 'cheat-email@test.com');
            setIsVerified(true);
            toast.success('🤫 인증 치트 발동!');
          }}
          className="w-full mt-2 py-2 text-sm text-gray-500 bg-gray-100 rounded-md"
        >
          🤫 치트: 바로 인증 성공시키기
        </button>
      </div>
    </div>
  );
}

// import Input from '../../common/Input';
// import Button from '../../common/Button';
// import { useEmail } from '../../../hooks/auth/useEmail';
// import { useProfileStore } from '../../../stores/profile-store';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';

// export default function EmailStep({ onNext }: { onNext: () => void }) {
//   const [isVerified, setIsVerified] = useState(false);
//   const {
//     email,
//     setEmail,
//     authCode,
//     setAuthCode,
//     isCodeSent,
//     timer,
//     isEmailValid,
//     isCheckingEmail,
//     isSendingCode,
//     isVerifyingCode,
//     handleSendCode,
//     handleVerifyCode,
//   } = useEmail({ onSuccess: () => setIsVerified(true) });

//   useEffect(() => {
//     if (isVerified) {
//       onNext();
//     }
//   }, [isVerified, onNext]);

//   if (isVerified) return null;

//   return (
//     <div className="px-6 pt-10 pb-6">
//       <h1 className="text-24 font-bold mb-6">회원 가입</h1>
//       <div className="flex flex-col space-y-4">
//         <Input
//           type="email"
//           placeholder="이메일 주소"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           endAdornment={
//             <Button
//               size="small"
//               disabled={!isEmailValid || isSendingCode || isCheckingEmail}
//               onClick={handleSendCode}
//             >
//               {isCodeSent ? '재전송' : '인증'}
//             </Button>
//           }
//         />
//         {isCodeSent && (
//           <p className="text-sm text-primary">
//             이메일이 전송되었습니다. 이메일을 확인해 주세요.
//           </p>
//         )}
//         <Input
//           type="text"
//           placeholder="인증번호"
//           value={authCode}
//           onChange={(e) => setAuthCode(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
//           endAdornment={
//             isCodeSent &&
//             timer > 0 && (
//               <span className="ml-4 text-gray-400">{`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`}</span>
//             )
//           }
//         />
//       </div>
//       <div className="mt-8">
//         <Button
//           onClick={handleVerifyCode}
//           disabled={!authCode || isVerifyingCode}
//         >
//           다음으로
//         </Button>
//         <button
//           type="button"
//           onClick={() => {
//             useProfileStore
//               .getState()
//               .setEmail(email || 'cheat-email@test.com');
//             setIsVerified(true);
//             toast.success('🤫 인증 치트 발동!');
//           }}
//           className="w-full mt-2 py-2 text-sm text-gray-500 bg-gray-100 rounded-md"
//         >
//           🤫 치트: 바로 인증 성공시키기
//         </button>
//       </div>
//     </div>
//   );
// }
