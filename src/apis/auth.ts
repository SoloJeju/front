import { publicAxios, authAxios, setAuthData } from './axios';
import type { CommonResponse } from '../types/common';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  CheckEmailCodeRequest,
  CheckEmailRequest,
  CheckNicknameRequest,
  KakaoProfileRequest,
  KakaoProfileResponse,
  ChangePasswordRequest,
} from '../types/auth';

// publicAxios (토큰 불필요)

// 로그인 API
export const login = async (
  requestData: LoginRequest
): Promise<CommonResponse<LoginResponse>> => {
  const { data } = await publicAxios.post<CommonResponse<LoginResponse>>(
    '/api/auth/login',
    requestData
  );
  return data;
};

// 토큰 갱신 API
export const reissueToken = async (
  refreshToken: string
): Promise<CommonResponse<{ accessToken: string }>> => {
  const { data } = await publicAxios.post<
    CommonResponse<{ accessToken: string }>
  >('/api/auth/reissue', {
    refreshToken,
  });

  // 토큰 갱신 성공 시 새로운 accessToken 저장 (기존 로직 유지)
  if (data.isSuccess && data.result) {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
    if (currentRefreshToken && userId) {
      setAuthData(
        parseInt(userId),
        data.result.accessToken,
        currentRefreshToken
      );
    }
  }
  return data;
};

// 사용자 회원가입 API
export const signup = async (
  signupData: SignupRequest
): Promise<CommonResponse<SignupResponse>> => {
  const { data } = await publicAxios.post<CommonResponse<SignupResponse>>(
    '/api/auth/userSignup',
    signupData
  );
  return data;
};

// 이메일 인증코드 전송 API
export const sendEmailCode = async (
  email: string
): Promise<CommonResponse<string>> => {
  const { data } = await publicAxios.post<CommonResponse<string>>(
    '/api/auth/send-email',
    email,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
  return data;
};

// 이메일 인증코드 번호 체크 API
export const checkEmailCode = async (
  requestData: CheckEmailCodeRequest
): Promise<CommonResponse<boolean>> => {
  const { data } = await publicAxios.get<CommonResponse<boolean>>(
    '/api/auth/check-number',
    { params: requestData }
  );
  return data;
};

// 이메일 중복확인 API
export const checkEmail = async (
  requestData: CheckEmailRequest
): Promise<CommonResponse<string>> => {
  const { data } = await publicAxios.get<CommonResponse<string>>(
    '/api/auth/check-email',
    { params: requestData }
  );
  return data;
};

// 닉네임 중복확인 API
export const checkNickname = async (
  requestData: CheckNicknameRequest
): Promise<CommonResponse<string>> => {
  const { data } = await publicAxios.get<CommonResponse<string>>(
    '/api/auth/check-nickname',
    { params: requestData }
  );
  return data;
};

// 비밀번호 유효성 체크 API
export const validatePassword = async (
  password: string
): Promise<CommonResponse<string>> => {
  const { data } = await publicAxios.get<CommonResponse<string>>(
    '/api/auth/validate-password',
    { params: { password } }
  );
  return data;
};

// authAxios (토큰 필요)

// 로그아웃 API
export const logout = async (): Promise<CommonResponse<string>> => {
  const { data } =
    await authAxios.delete<CommonResponse<string>>('/api/auth/logout');
  return data;
};

// 카카오 프로필 API
export const createKakaoProfile = async (
  body: KakaoProfileRequest
): Promise<CommonResponse<KakaoProfileResponse>> => {
  const { data } = await authAxios.post<CommonResponse<KakaoProfileResponse>>(
    '/api/auth/kakao/profile',
    body
  );
  return data;
};

// 비밀번호 변경 API
export const changePassword = async (
  requestData: ChangePasswordRequest
): Promise<CommonResponse<string>> => {
  const { data } = await authAxios.patch<CommonResponse<string>>(
    '/api/auth/password',
    null,
    { params: requestData }
  );
  return data;
};
