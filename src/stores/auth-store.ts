// 로그인 상태 기억하는 역할
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 

// 최소한의 사용자 정보
interface User {
  id: number;
  nickName: string;
  profileImage: string;
}

// 스토어의 전체 구조
interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: User | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      isLoggedIn: false,
      accessToken: null,
      user: null,

      // 로그인 시 호출할 함수
      login: (accessToken, user) =>
        set({
          isLoggedIn: true,
          accessToken: accessToken,
          user: user,
        }),

      // 로그아웃 시 호출할 함수
      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 때 사용될 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);
