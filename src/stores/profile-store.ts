import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UserType } from '../constants/userTypeImages';
import { determineUserType } from '../utils/calculateUserType';

// 프로필 상태 타입 정의
export interface ProfileState {
  // 기본 정보
  name: string;
  nickName: string;
  gender: '남자' | '여자' | '';
  birthdate: string;
  profileImage: string;
  userType: UserType | '';
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
  setGender: (gender: '남자' | '여자' | '') => void;
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
  calculateUserType: () => void;
}

// 액션을 제외한 순수 데이터 타입
type ProfileData = Omit<
  ProfileState,
  | 'setName'
  | 'setNickName'
  | 'setGender'
  | 'setBirthdate'
  | 'setProfileImage'
  | 'setUserType'
  | 'setBio'
  | 'setQ1'
  | 'setQ2'
  | 'setQ3'
  | 'setQ4'
  | 'setQ5'
  | 'reset'
  | 'setProfileData'
  | 'setSoloTripCount'
  | 'setCompanionRoomCount'
  | 'setEmail'
  | 'setPassword'
  | 'calculateUserType'
>;

// 스토어 초기 상태
export const initialState: ProfileData = {
  name: '',
  nickName: '',
  gender: '', // '남자' 대신 빈 값으로 초기화
  birthdate: '',
  profileImage: '/default-profile.svg',
  userType: '',
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

      calculateUserType: () => {
        const { q1_expect, q2_habit, q3_avoid, q4_feeling, q5_necessity } =
          get();
        const answers = {
          q1_expect,
          q2_habit,
          q3_avoid,
          q4_feeling,
          q5_necessity,
        };
        const finalType = determineUserType(answers);
        set({ userType: finalType });
      },

      reset: () => set(initialState),

      setProfileData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
