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
