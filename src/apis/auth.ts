import axios from 'axios';
import { publicAxios, authAxios, setAuthData } from './axios';
import type { CommonResponse } from '../types/common';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  SendEmailCodeRequest,
  CheckEmailCodeRequest,
  CheckEmailRequest,
  CheckNicknameRequest,
  KakaoProfileRequest,
  KakaoProfileResponse,
  ChangePasswordRequest,
} from '../types/auth';


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

// 로그아웃 API
export const logout = async () => {
  const { data } = await authAxios.delete('/api/auth/logout');  
  return data;
};

// 토큰 갱신 API
export const reissueToken = async (refreshToken: string): Promise<CommonResponse<{ accessToken: string }>> => {
  try {
    const response = await publicAxios.post<CommonResponse<{ accessToken: string }>>('/api/auth/reissue', {
      refreshToken,
    });
    
    // 토큰 갱신 성공 시 새로운 accessToken 저장
    if (response.data.isSuccess && response.data.result) {
      const currentRefreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');
      
      if (currentRefreshToken && userId) {
        setAuthData(
          parseInt(userId),
          response.data.result.accessToken,
          currentRefreshToken
        );
      }
    }
    
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data: { message?: string } } };
      console.error('토큰 갱신 실패:', {
        status: axiosError.response.status,
        data: axiosError.response.data,
        message: axiosError.response.data?.message || '알 수 없는 오류가 발생했습니다.'
      });
      
      if (axiosError.response.status === 401) {
        throw new Error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.');
      }
      
      if (axiosError.response.status === 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error(axiosError.response.data?.message || '토큰 갱신 중 오류가 발생했습니다.');
    } else if (error && typeof error === 'object' && 'request' in error) {
      console.error('토큰 갱신 요청 실패 (응답 없음):', (error as { request: unknown }).request);
      throw new Error('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
      console.error('토큰 갱신 요청 실패:', error instanceof Error ? error.message : '알 수 없는 오류');
      throw new Error('토큰 갱신 요청을 보낼 수 없습니다.');
    }
  }
};


// 사용자 회원가입 API
export const signup = async (signupData: SignupRequest): Promise<CommonResponse<SignupResponse>> => {
  const { data } = await axios.post<CommonResponse<SignupResponse>>(
    `${import.meta.env.VITE_API_URL}/api/auth/userSignup`,
    signupData
  );
  return data;
};


// 이메일 인증코드 전송 API
export const sendEmailCode = async (
  requestData: SendEmailCodeRequest
) : Promise<CommonResponse<string>> => {
  const {data} = await axios.post<CommonResponse<string>>(
    `${import.meta.env.VITE_API_URL}/api/auth/send-email`,
    requestData
  );
  return data;
}

// 이메일 인증코드 번호 체크 API
export const checkEmailCode = async (
  requestData: CheckEmailCodeRequest
): Promise<CommonResponse<boolean>> => {
  const {data} = await axios.get<CommonResponse<boolean>>(
    `${import.meta.env.VITE_API_URL}/api/auth/check-number`,
    {
      params: requestData,
    }
  );
  return data;
};
   
 
// 이메일 중복확인 API
export const checkEmail = async (
  requestData: CheckEmailRequest
): Promise<CommonResponse<string>> => {
  const {data} = await axios.get<CommonResponse<string>>(
    `${import.meta.env.VITE_API_URL}/api/auth/check-email`,
    {
      params: requestData,
    }
  );
  return data;
}

// 닉네임 중복확인 API
export const checkNickname = async (
  requestData: CheckNicknameRequest
): Promise<CommonResponse<string>> => {
  const {data} = await axios.get<CommonResponse<string>>(
    `${import.meta.env.VITE_API_URL}/api/auth/check-nickname`,
    {
      params: requestData,
    }
  );
  return data;
};

// 카카오 회원가입 API 
export const createKakaoProfile = async (
  body: KakaoProfileRequest
): Promise<CommonResponse<KakaoProfileResponse>> => {
  const {data} = await authAxios.post<CommonResponse<KakaoProfileResponse>>(
    `/api/auth/kakao/profile`,
    body
  );
  return data;
}

// 비밀번호 변경 API
export const changePassword = async (
  requestData: ChangePasswordRequest,
): Promise<CommonResponse<string>> => {
  const { data } = await authAxios.patch<CommonResponse<string>>(
    '/api/auth/password',
    null, 
    { params: requestData }, 
  );
  return data;
};