import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 로그인 API
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data: { message?: string } } };
      console.error('로그인 실패:', {
        status: axiosError.response.status,
        data: axiosError.response.data,
        message: axiosError.response.data?.message || '알 수 없는 오류가 발생했습니다.'
      });
      
      if (axiosError.response.status === 401) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      
      if (axiosError.response.status === 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error(axiosError.response.data?.message || '로그인 중 오류가 발생했습니다.');
    } else if (error && typeof error === 'object' && 'request' in error) {
      console.error('로그인 요청 실패 (응답 없음):', (error as { request: unknown }).request);
      throw new Error('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
      console.error('로그인 요청 실패:', error instanceof Error ? error.message : '알 수 없는 오류');
      throw new Error('로그인 요청을 보낼 수 없습니다.');
    }
  }
};

// 로그아웃 API
export const logout = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('액세스 토큰이 없습니다.');
    }

    const response = await axios.delete(`${API_BASE_URL}/api/auth/logout`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data: { message?: string } } };
      // 서버 응답이 있는 경우
      console.error('로그아웃 실패:', {
        status: axiosError.response.status,
        data: axiosError.response.data,
        message: axiosError.response.data?.message || '알 수 없는 오류가 발생했습니다.'
      });
      
      // 401 에러인 경우 토큰이 만료되었거나 유효하지 않음
      if (axiosError.response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      }
      
      // 500 에러인 경우 서버 내부 오류
      if (axiosError.response.status === 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error(axiosError.response.data?.message || '로그아웃 중 오류가 발생했습니다.');
    } else if (error && typeof error === 'object' && 'request' in error) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('로그아웃 요청 실패 (응답 없음):', (error as { request: unknown }).request);
      throw new Error('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
      // 요청 자체를 보내지 못한 경우
      console.error('로그아웃 요청 실패:', error instanceof Error ? error.message : '알 수 없는 오류');
      throw new Error('로그아웃 요청을 보낼 수 없습니다.');
    }
  }
};
