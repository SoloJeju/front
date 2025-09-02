export type CommonResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type CommonCursorResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  nextCursor: string;
  hasNext: boolean;
  size: number;
};

// 로그인 응답 타입
export type LoginResponse = {
  id: number;
  accessToken: string;
  refreshToken: string;
};
