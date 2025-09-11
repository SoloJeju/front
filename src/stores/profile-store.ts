import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UserType } from '../constants/userTypeImages'; // 타입 안정성을 위해 import
import { determineUserType } from '../utils/calculateUserType'; // 계산 함수 import

// 프로필 상태 타입 정의
export interface ProfileState {
  // 기본 정보
  name: string;
  nickName: string;
  gender: '남자' | '여자';
  birthdate: string;
  profileImage: string;
  userType: UserType | ''; // string 대신 구체적인 UserType으로 변경
  bio: string;
  email: string;
  password: string;
  // 경험 횟수
  soloTripCount: number;
  companionRoomCount: number;
  
  // 여행 성향 질문 답변
  q1_expect: string;
  q2_habit: string;
  q3_avoid: string;
  q4_feeling: string;
  q5_necessity: string;

  // 상태 변경 액션
  setName: (name: string) => void;
  setNickName: (nickName: string) => void;
  setGender: (gender: '남자' | '여자') => void;
  setBirthdate: (birthdate: string) => void;
  setProfileImage: (image: string) => void;
  setUserType: (type: UserType) => void; 
  setBio: (bio: string) => void;
  setQ1: (answer: string) => void;
  setQ2: (answer: string) => void;
  setQ3: (answer: string) => void;
  setQ4: (answer: string) => void;
  setQ5: (answer: string) => void;
  reset: () => void;
  setProfileData: (data: Partial<ProfileData>) => void;
  setSoloTripCount: (count: number) => void;
  setCompanionRoomCount: (count: number) => void;
  setEmail: (email: string) => void;      
  setPassword: (password: string) => void;
  calculateUserType: () => void; // 사용자 유형 계산 액션
}

// 액션을 제외한 순수 데이터 타입
type ProfileData = Omit<ProfileState,
  | 'setName' | 'setNickName' | 'setGender' | 'setBirthdate'
  | 'setProfileImage' | 'setUserType' | 'setBio' | 'setQ1' | 'setQ2'
  | 'setQ3' | 'setQ4' | 'setQ5' | 'reset' | 'setProfileData'
  | 'setSoloTripCount' | 'setCompanionRoomCount' | 'setEmail' | 'setPassword'
  | 'calculateUserType'
>;

// 스토어 초기 상태
export const initialState: ProfileData = {
  name: '',
  nickName: '',
  gender: '남자',
  birthdate: '',
  profileImage: '',
  userType: '', // 초기값은 빈 문자열
  bio: '',
  soloTripCount: 0,
  companionRoomCount: 0,
  q1_expect: '',
  q2_habit: '',
  q3_avoid: '',
  q4_feeling: '',
  q5_necessity: '',
  email: '',
  password: '',
};

// 프로필 상태를 전역으로 관리하는 Zustand 스토어
export const useProfileStore = create(
  persist<ProfileState>(
    (set, get) => ({
      ...initialState,

      setName: (name) => set({ name }),
      setNickName: (nickName) => set({ nickName }),
      setGender: (gender) => set({ gender }),
      setBirthdate: (birthdate) => set({ birthdate }),
      setProfileImage: (image) => set({ profileImage: image }),
      setUserType: (type) => set({ userType: type }),
      setBio: (bio) => set({ bio }),
      setQ1: (answer) => set({ q1_expect: answer }),
      setQ2: (answer) => set({ q2_habit: answer }),
      setQ3: (answer) => set({ q3_avoid: answer }),
      setQ4: (answer) => set({ q4_feeling: answer }),
      setQ5: (answer) => set({ q5_necessity: answer }),
      setSoloTripCount: (count) => set({ soloTripCount: count }),
      setCompanionRoomCount: (count) => set({ companionRoomCount: count }),
      setEmail: (email) => set({ email }),      
      setPassword: (password) => set({ password }), 

      // 외부 계산 함수를 호출하여 사용자 유형을 결정하고 상태를 업데이트하는 액션
      calculateUserType: () => {
        const { q1_expect, q2_habit, q3_avoid, q4_feeling, q5_necessity } = get();
        const answers = { q1_expect, q2_habit, q3_avoid, q4_feeling, q5_necessity };

        const finalType = determineUserType(answers);

        set({ userType: finalType });
      },

      reset: () => set(initialState),
      setProfileData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'user-profile-storage', // localStorage에 저장될 때 사용될 키 이름
    },
  ),
);
