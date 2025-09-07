import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useProfileStore } from '../../stores/profile-store';
import { useValidatePassword } from './useValidatePassword';

const validatePasswordClientSide = (password: string): { isValid: boolean; message: string | null } => {
  if (password.length < 8 || password.length > 12) {
    return { isValid: false, message: '비밀번호는 8~12자 사이여야 합니다.' };
  }
  const typeCount = [/[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password)].filter(Boolean).length;
  if (typeCount < 2) {
    return { isValid: false, message: '영어 대/소문자, 숫자 중 2종류 이상을 조합해야 합니다.' };
  }
  return { isValid: true, message: null };
};

export const usePassword = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const storeSetPassword = useProfileStore((state) => state.setPassword);
  
  const { checkPassword, isCheckingPassword, isPasswordValid } = useValidatePassword();

  const isFormFilled = password && passwordCheck && !passwordError;
  
  useEffect(() => { setPasswordError(passwordCheck !== '' && password !== passwordCheck); }, [password, passwordCheck]);

  const handlePasswordBlur = () => {
    if (!password) return;
    const clientResult = validatePasswordClientSide(password);
    if (!clientResult.isValid) {
      toast.error(clientResult.message || '비밀번호 규칙에 맞지 않습니다.');
      return;
    }
    checkPassword(password);
  };
  
  const handleProceed = () => {
    if (!isFormFilled) {
      toast.error('비밀번호를 확인해주세요.');
      return;
    }
    const clientResult = validatePasswordClientSide(password);
    if (!clientResult.isValid) {
      toast.error(clientResult.message || '비밀번호 규칙에 맞지 않습니다.');
      return;
    }
    if (!isPasswordValid) {
        toast.error('비밀번호 유효성 검사를 통과하지 못했습니다. 다시 입력해주세요.');
        return;
    }
    
    storeSetPassword(password);
    onSuccess();
  };
  
  return { password, setPassword, passwordCheck, setPasswordCheck, passwordError, isCheckingPassword, isPasswordValid, handlePasswordBlur, handleProceed };
};