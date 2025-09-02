// 로그인 요청
export type LoginRequest = {
  email: string;
  password: string;
};

// 이메일/비밀번호 회원가입 요청 
export type SignupRequest = {
  email: string;
  password: string;
};

// 비밀번호 변경 요청
export type ChangePasswordRequest = {
  email: string;
  password: string;
};

// 이메일 인증코드 전송 요청 
export type SendEmailCodeRequest = {
  email: string;
};

// 이메일 인증코드 확인 요청 
export type CheckEmailCodeRequest = {
  email: string;
  code: number;
};

// 이메일 중복 확인 요청 
export type CheckEmailRequest = {
  email:string;
};

// 닉네임 중복 확인 요청 
export type CheckNicknameRequest = { 
  nickName: string;
};

// 카카오 프로필 생성 요청
export type KakaoProfileRequest = {
  name: string;
  gender: 'MALE' | 'FEMALE'; 
  birthDate: string; // 'YYYY-MM-DD'
  nickName: string;
  userType: string;
  imageName?: string; 
  imageUrl?: string;  
  bio?: string;
};

// 로그인 응답
export type LoginResponse = {
  id: number;
  accessToken: string;
  refreshToken: string;
};

// 회원가입 응답
export type SignupResponse = {
  id: number;
  name: string;
  role: 'ADMIN' | 'USER';
};

// 카카오 프로필 생성 응답
export type KakaoProfileResponse = { 
  id: number;
  name: string;
  role: 'ADMIN' | 'USER'; 
  bio: string | null;
  userType: string;
};