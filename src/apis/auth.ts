// src/apis/auth.ts
import axios from 'axios';

type ApiWrapper<T = unknown> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

const API_URL = import.meta.env.VITE_API_URL;

const unwrap = async <T>(p: Promise<{ data: ApiWrapper<T> }>): Promise<T> => {
  const { data } = await p;
  if (!data.isSuccess) throw new Error(data.message || 'Request failed');
  return data.result;
};

export const AuthApi = {
  // 로그인
  login: (payload: { email: string; password: string }) =>
    unwrap<{ accessToken: string; refreshToken: string }>(
      axios.post(`${API_URL}/api/auth/login`, payload)
    ),

  // 회원가입(사용자)
  userSignUp: (payload: { email: string; password: string; nickname: string; userType: string }) =>
    // 필요 시 제네릭을 실제 스키마로 변경(예: { userId: string })
    unwrap<Record<string, unknown>>(
      axios.post(`${API_URL}/api/auth/userSignUp`, payload)
    ),

  // 로그아웃
  logout: () =>
    unwrap<null>(axios.delete(`${API_URL}/api/auth/logout`)),

  // 토큰 재발급
  reissue: (payload: { refreshToken: string }) =>
    unwrap<{ accessToken: string }>(
      axios.post(`${API_URL}/api/auth/reissue`, payload)
    ),

  // 선택: 이메일/닉네임/비밀번호 유틸 (스웨거 스키마에 맞춰 필요 시 사용)
  checkEmail: (email: string) =>
    unwrap<{ available: boolean }>(
      axios.get(`${API_URL}/api/auth/check-email`, { params: { email } })
    ),

  sendEmail: (email: string) =>
    unwrap<{ sent: boolean }>(
      axios.post(`${API_URL}/api/auth/send-email`, { email })
    ),

  checkNumber: (email: string, code: string) =>
    unwrap<{ valid: boolean }>(
      axios.get(`${API_URL}/api/auth/check-number`, { params: { email, code } })
    ),

  checkNickname: (nickname: string) =>
    unwrap<{ available: boolean }>(
      axios.get(`${API_URL}/api/auth/check-nickname`, { params: { nickname } })
    ),

  validatePassword: (password: string) =>
    unwrap<{ valid: boolean }>(
      axios.get(`${API_URL}/api/auth/validate-password`, { params: { password } })
    ),

  changePassword: (payload: { oldPassword: string; newPassword: string }) =>
    unwrap<{ success: boolean }>(
      axios.patch(`${API_URL}/api/auth/password`, payload)
    ),
};
