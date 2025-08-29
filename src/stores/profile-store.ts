import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 프로필 상태 타입 정의
export interface ProfileState {
  // 기본 정보
  name: string;
  nickname: string;
  gender: '남자' | '여자' | '';
  birthdate: string;
  profileImage: string;
  type: string;
  bio: string;

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
  setNickname: (nickname: string) => void;
  setGender: (gender: '남자' | '여자') => void;
  setBirthdate: (birthdate: string) => void;
  setProfileImage: (image: string) => void;
  setType: (type: string) => void;
  setBio: (bio: string) => void;
  setQ1: (answer: string) => void;
  setQ2: (answer: string) => void;
  setQ3: (answer: string) => void;
  setQ4: (answer: string) => void;
  setQ5: (answer: string) => void;
  reset: () => void;
  setSoloTripCount: (count: number) => void;
  setCompanionRoomCount: (count: number) => void;
}

// 액션 제외한 상태만 추출
type ProfileData = Omit<ProfileState, 'setName' | 'setNickname' | 'setGender' | 'setBirthdate' | 'setProfileImage' | 'setType' | 'setBio' | 'setQ1' | 'setQ2' | 'setQ3' | 'setQ4' | 'setQ5' | 'reset' | 'setSoloTripCount' | 'setCompanionRoomCount'>;

// 초기 상태
export const initialState: ProfileData = {
  name: '',
  nickname: '',
  gender: '',
  birthdate: '',
  profileImage: '/default-profile.svg',
  type: '',
  bio: '',
  soloTripCount: 16,
  companionRoomCount: 4,
  q1_expect: '',
  q2_habit: '',
  q3_avoid: '',
  q4_feeling: '',
  q5_necessity: '',
};

// 프로필 상태를 전역 관리, localStorage에 저장되는 스토어
export const useProfileStore = create(
  persist<ProfileState>(
    (set) => ({
      ...initialState,
      setName: (name) => set({ name }),
      setNickname: (nickname) => set({ nickname }),
      setGender: (gender) => set({ gender }),
      setBirthdate: (birthdate) => set({ birthdate }),
      setProfileImage: (image) => set({ profileImage: image }),
      setType: (type) => set({ type }),
      setBio: (bio) => set({ bio }),
      setQ1: (answer) => set({ q1_expect: answer }),
      setQ2: (answer) => set({ q2_habit: answer }),
      setQ3: (answer) => set({ q3_avoid: answer }),
      setQ4: (answer) => set({ q4_feeling: answer }),
      setQ5: (answer) => set({ q5_necessity: answer }),
      reset: () => set(initialState),
      setSoloTripCount: (count) => set({ soloTripCount: count }),
      setCompanionRoomCount: (count) => set({ companionRoomCount: count }),
    }),
    {
      name: 'user-profile-storage', // localStorage key 이름
    },
  ),
);
